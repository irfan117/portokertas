import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PortfolioData,
  ProfileData,
  WorkProject,
  LabNote,
  TalkWriting,
  CareerItem,
  ExperienceSlide,
  CaseStudy,
  ContactData,
  NowItem,
  GitAccount,
} from '../types';
import { INITIAL_PORTFOLIO_DATA } from '../data/kenjiData';
import { DEFAULT_GIT_ACCOUNTS } from '../components/Home/GitAccountsBar';
import { getApiBase } from '../lib/apiBase';

const STORAGE_KEY = 'irfan_portfolio_cms_data_v2';
const API_BASE = `${getApiBase()}/portfolio`;

async function apiRequest(path: string, method: string, body?: unknown) {
  const headers = body === undefined ? undefined : { 'Content-Type': 'application/json' };
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      errorDetail = errJson.error || errJson.message || '';
    } catch {
      // Body respons bukan JSON
    }
    throw new Error(`API ${method} ${path} gagal (${response.status}) ${errorDetail}`.trim());
  }
  return response.status === 204 ? undefined : response.json();
}

function workProjectPayload(project: WorkProject) {
  return {
    id: project.id,
    title: project.title,
    desc: project.desc,
    img: project.img,
    alt: project.alt,
    tags: Array.isArray(project.tags) ? project.tags : [],
    images: Array.isArray(project.images) ? project.images : [],
    period: project.period?.trim() || null,
    github: project.github?.trim() || null,
    demoUrl: project.demoUrl?.trim() || null,
    highlights: Array.isArray(project.highlights) ? project.highlights : [],
  };
}

function mapRemoteWorkProjects(remoteProjects: any[]): WorkProject[] {
  return remoteProjects.map((project) => ({
    ...project,
    tags: Array.isArray(project.tags) ? project.tags : [],
    images: Array.isArray(project.images) ? project.images : [],
    highlights: Array.isArray(project.highlights) ? project.highlights : [],
  }));
}

function labNotePayload(note: LabNote) {
  return {
    id: note.id,
    slug: note.slug,
    title: note.title,
    date: note.date,
    readTime: note.readTime,
    category: note.category,
    tags: Array.isArray(note.tags) ? note.tags : [],
    caption: note.caption,
    img: note.img,
    alt: note.alt,
    summary: note.summary,
    content: Array.isArray(note.content) ? note.content : [],
    codeSnippet: note.codeSnippet ?? undefined,
    keyTakeaways: Array.isArray(note.keyTakeaways) ? note.keyTakeaways : [],
  };
}

function mapRemoteLabNotes(remoteNotes: any[]): LabNote[] {
  return remoteNotes.map((note) => ({
    ...note,
    tags: Array.isArray(note.tags) ? note.tags : [],
    content: Array.isArray(note.content) ? note.content : [],
    keyTakeaways: Array.isArray(note.keyTakeaways) ? note.keyTakeaways : [],
  }));
}

function talkWritingPayload(item: TalkWriting, index: number) {
  return {
    id: item.id || `talk-${index + 1}`,
    title: item.title,
    desc: item.desc,
    tag: item.tag,
  };
}

function mapRemoteTalksWriting(remoteItems: any[]): TalkWriting[] {
  return remoteItems.map((item, index) => ({
    id: item.id || `talk-${index + 1}`,
    title: item.title,
    desc: item.desc,
    tag: item.tag,
  }));
}

function experienceSlideStorageId(slide: ExperienceSlide, index: number) {
  return `${slide.id.replace(/-slide-\d+$/, '')}-slide-${index + 1}`;
}

function mapRemoteExperienceSlides(remoteSlides: any[]): ExperienceSlide[] {
  return remoteSlides.map((slide) => ({
    ...slide,
    id: String(slide.id || '').replace(/-slide-\d+$/, ''),
  }));
}

function syncCollection(resource: string, items: Array<{ id: string }>) {
  let payload: unknown = items;
  if (resource === 'workProjects') payload = (items as WorkProject[]).map(workProjectPayload);
  if (resource === 'labNotes') payload = (items as LabNote[]).map(labNotePayload);
  if (resource === 'talksWriting') payload = (items as TalkWriting[]).map(talkWritingPayload);
  if (resource === 'experienceSlides') {
    payload = (items as ExperienceSlide[]).map((slide, index) => ({
      ...slide,
      id: experienceSlideStorageId(slide, index),
    }));
  }

  void apiRequest(`/${resource}`, 'PUT', payload).catch((error) => console.error('Gagal menyimpan ke TiDB:', error));
}

function mapRemoteProfile(remoteProfile: any): ProfileData {
  return {
    ...INITIAL_PORTFOLIO_DATA.profile,
    ...remoteProfile,
    splitParallax: {
      title: remoteProfile.splitTitle ?? INITIAL_PORTFOLIO_DATA.profile.splitParallax.title,
      desc: remoteProfile.splitDesc ?? INITIAL_PORTFOLIO_DATA.profile.splitParallax.desc,
      img: remoteProfile.splitImg ?? INITIAL_PORTFOLIO_DATA.profile.splitParallax.img,
    },
    homeQuote: {
      text: remoteProfile.homeText ?? INITIAL_PORTFOLIO_DATA.profile.homeQuote.text,
      cite: remoteProfile.homeCite ?? INITIAL_PORTFOLIO_DATA.profile.homeQuote.cite,
      bgImage: remoteProfile.homeBg ?? INITIAL_PORTFOLIO_DATA.profile.homeQuote.bgImage,
    },
    aboutQuote: {
      text: remoteProfile.aboutText ?? INITIAL_PORTFOLIO_DATA.profile.aboutQuote.text,
      cite: remoteProfile.aboutCite ?? INITIAL_PORTFOLIO_DATA.profile.aboutQuote.cite,
      bgImage: remoteProfile.aboutBg ?? INITIAL_PORTFOLIO_DATA.profile.aboutQuote.bgImage,
    },
  };
}

function profilePayload(profile: ProfileData) {
  return {
    id: 1,
    name: profile.name,
    role: profile.role,
    location: profile.location,
    heroTitle: profile.heroTitle,
    heroLead: profile.heroLead,
    heroMeta: profile.heroMeta,
    heroStats: profile.heroStats,
    splitTitle: profile.splitParallax?.title ?? '',
    splitDesc: profile.splitParallax?.desc ?? '',
    splitImg: profile.splitParallax?.img ?? '',
    homeText: profile.homeQuote?.text ?? '',
    homeCite: profile.homeQuote?.cite ?? '',
    homeBg: profile.homeQuote?.bgImage ?? '',
    aboutText: profile.aboutQuote?.text ?? '',
    aboutCite: profile.aboutQuote?.cite ?? '',
    aboutBg: profile.aboutQuote?.bgImage ?? '',
    aboutBio: profile.aboutBio,
    toolsHeading: profile.toolsHeading,
    toolsText1: profile.toolsText1,
    toolsText2: profile.toolsText2,
    portraitImg: profile.portraitImg,
    approachHeading: profile.approachHeading,
    approachLead: profile.approachLead,
    approachSteps: profile.approachSteps,
  };
}

function caseStudyPayload(study: CaseStudy) {
  return {
    id: study.id,
    period: study.period,
    company: study.company,
    role: study.role,
    subtitle: study.subtitle,
    heroImage: study.heroImage,
    heroCaption: study.heroCaption,
    leadParagraph1: study.leadParagraph1,
    midImage: study.midImage,
    midCaption: study.midCaption,
    leadParagraph2: study.leadParagraph2,
    bulletPoints: study.bulletPoints,
    endImage: study.endImage,
    endCaption: study.endCaption,
    prevId: study.prev?.id,
    prevLabel: study.prev?.label,
    nextId: study.next?.id,
    nextLabel: study.next?.label,
  };
}

function mapRemoteCaseStudies(remoteStudies: any[]): Record<string, CaseStudy> {
  return remoteStudies.reduce((acc: Record<string, CaseStudy>, item: any) => {
    acc[item.id] = {
      id: item.id,
      period: item.period,
      company: item.company,
      role: item.role,
      subtitle: item.subtitle,
      heroImage: item.heroImage,
      heroCaption: item.heroCaption,
      leadParagraph1: item.leadParagraph1,
      midImage: item.midImage,
      midCaption: item.midCaption,
      leadParagraph2: item.leadParagraph2,
      bulletPoints: Array.isArray(item.bulletPoints) ? item.bulletPoints : [],
      endImage: item.endImage,
      endCaption: item.endCaption,
      prev: item.prevId && item.prevLabel ? { id: item.prevId, label: item.prevLabel } : undefined,
      next: item.nextId && item.nextLabel ? { id: item.nextId, label: item.nextLabel } : undefined,
    };
    return acc;
  }, {});
}

function mapRemoteNowItems(remoteNowItems: any[]): NowItem[] {
  return remoteNowItems.map((item) => ({
    k: item.k ?? item.key ?? '',
    v: item.v ?? item.value ?? '',
  }));
}

function mapRemoteGitAccounts(remoteAccounts: any[]): GitAccount[] {
  return remoteAccounts.map((account) => ({
    ...account,
    totalContributions: Number(account.totalContributions) || 0,
    currentStreak: Number(account.currentStreak) || 0,
    longestStreak: Number(account.longestStreak) || 0,
    pullRequests: Number(account.pullRequests) || 0,
    reposCount: Number(account.reposCount) || 0,
    seed: Number(account.seed) || 1,
    languages: Array.isArray(account.languages) ? account.languages : [],
    recentCommits: Array.isArray(account.recentCommits) ? account.recentCommits : [],
  }));
}

interface PortfolioContextType {
  data: PortfolioData;
  isLoading: boolean;
  isDatabaseLoaded: boolean;
  lastSaved: Date | null;
  updateProfile: (patch: Partial<ProfileData>) => void;
  updateWorkProjects: (projects: WorkProject[]) => void;
  addWorkProject: (project: WorkProject) => void;
  editWorkProject: (id: string, updated: Partial<WorkProject>) => void;
  deleteWorkProject: (id: string) => void;
  updateLabNotes: (notes: LabNote[]) => void;
  addLabNote: (note: LabNote) => void;
  editLabNote: (id: string, updated: Partial<LabNote>) => void;
  deleteLabNote: (index: number) => void;
  updateTalksWriting: (items: TalkWriting[]) => void;
  addTalkWriting: (item: TalkWriting) => void;
  editTalkWriting: (index: number, item: TalkWriting) => void;
  deleteTalkWriting: (index: number) => void;
  updateCareerList: (items: CareerItem[]) => void;
  updateExperienceSlides: (slides: ExperienceSlide[]) => void;
  updateCaseStudy: (id: string, study: CaseStudy) => void;
  updateContact: (patch: Partial<ContactData>) => void;
  updateNowItems: (items: NowItem[]) => void;
  updateGitAccounts: (accounts: GitAccount[]) => void;
  editGitAccount: (id: string, updated: Partial<GitAccount>) => void;
  resetToDefaults: () => void;
  importData: (imported: PortfolioData) => boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

function loadInitialData(): PortfolioData {
  try {
    if (typeof window === 'undefined') return INITIAL_PORTFOLIO_DATA;
    if (localStorage.getItem('kenji_portfolio_cms_data_v1')) {
      localStorage.removeItem('kenji_portfolio_cms_data_v1');
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const initialNotes = INITIAL_PORTFOLIO_DATA.labNotes;

      // Migrate notes to ensure all blog fields exist
      const rawNotes = Array.isArray(parsed.labNotes) ? parsed.labNotes : initialNotes;
      const enrichedNotes: LabNote[] = rawNotes.map((note: any, idx: number) => {
        const fallback = initialNotes[idx] || initialNotes[0];
        return {
          id: note.id || fallback.id || `lab-note-${idx + 1}`,
          slug: note.slug || note.id || fallback.slug || `lab-note-${idx + 1}`,
          title: note.title || fallback.title || note.caption || `Lab Note #${idx + 1}`,
          date: note.date || fallback.date || 'Recent',
          readTime: note.readTime || fallback.readTime || '4 min read',
          category: note.category || fallback.category || 'Engineering',
          tags: Array.isArray(note.tags) && note.tags.length > 0 ? note.tags : fallback.tags,
          caption: note.caption || fallback.caption || '',
          img: note.img || fallback.img || '',
          alt: note.alt || fallback.alt || '',
          summary: note.summary || fallback.summary || note.caption || '',
          content: Array.isArray(note.content) && note.content.length > 0 ? note.content : fallback.content,
          codeSnippet: note.codeSnippet || fallback.codeSnippet,
          keyTakeaways: Array.isArray(note.keyTakeaways) ? note.keyTakeaways : fallback.keyTakeaways,
        };
      });

      const loadedGitAccounts =
        Array.isArray(parsed.gitAccounts) && parsed.gitAccounts.length > 0
          ? parsed.gitAccounts
          : DEFAULT_GIT_ACCOUNTS;

      return {
        ...INITIAL_PORTFOLIO_DATA,
        ...parsed,
        gitAccounts: loadedGitAccounts,
        labNotes: enrichedNotes,
        profile: { ...INITIAL_PORTFOLIO_DATA.profile, ...(parsed.profile || {}) },
        contact: { ...INITIAL_PORTFOLIO_DATA.contact, ...(parsed.contact || {}) },
      };
    }
  } catch (err) {
    console.error('Failed to load portfolio data from storage:', err);
  }
  return {
    ...INITIAL_PORTFOLIO_DATA,
    gitAccounts: DEFAULT_GIT_ACCOUNTS,
  } as PortfolioData;
}

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(loadInitialData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDatabaseLoaded, setIsDatabaseLoaded] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setIsDatabaseLoaded(false);
    void fetch(API_BASE)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`Portfolio API ${response.status}`))))
      .then((remote) => {
        if (remote) {
          setData((current) => ({
            ...current,
            ...(remote.profile ? { profile: mapRemoteProfile(remote.profile) } : {}),
            ...(remote.contact ? { contact: remote.contact } : {}),
            ...(Array.isArray(remote.workProjects) && remote.workProjects.length > 0 ? { workProjects: mapRemoteWorkProjects(remote.workProjects) } : {}),
            ...(Array.isArray(remote.labNotes) && remote.labNotes.length > 0 ? { labNotes: mapRemoteLabNotes(remote.labNotes) } : {}),
            ...(Array.isArray(remote.talksWriting) && remote.talksWriting.length > 0 ? { talksWriting: mapRemoteTalksWriting(remote.talksWriting) } : {}),
            ...(Array.isArray(remote.careerList) && remote.careerList.length > 0 ? { careerList: remote.careerList } : {}),
            ...(Array.isArray(remote.experienceSlides) && remote.experienceSlides.length > 0 ? { experienceSlides: mapRemoteExperienceSlides(remote.experienceSlides) } : {}),
            ...(Array.isArray(remote.caseStudies) && remote.caseStudies.length > 0
              ? { caseStudies: mapRemoteCaseStudies(remote.caseStudies) }
              : {}),
            ...(Array.isArray(remote.nowItems) && remote.nowItems.length > 0 ? { nowItems: mapRemoteNowItems(remote.nowItems) } : {}),
            ...(Array.isArray(remote.gitAccounts) && remote.gitAccounts.length > 0 ? { gitAccounts: mapRemoteGitAccounts(remote.gitAccounts) } : {}),
          }));
        }
      })
      .catch((error) => console.warn('Portfolio API belum tersedia, memakai data lokal:', error))
      .finally(() => {
        setIsLoading(false);
        setIsDatabaseLoaded(true);
      });
  }, []);

  const save = (newData: PortfolioData) => {
    setData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setLastSaved(new Date());
    } catch (err) {
      console.error('Failed to persist portfolio data:', err);
    }
  };

  const updateProfile = (patch: Partial<ProfileData>) => {
    const updated = {
      ...data,
      profile: { ...data.profile, ...patch },
    };
    save(updated);
    void apiRequest('/profile', 'PUT', profilePayload(updated.profile)).catch((error) => console.error('Gagal menyimpan profile ke TiDB:', error));
  };

  const updateWorkProjects = (projects: WorkProject[]) => {
    save({ ...data, workProjects: projects });
    syncCollection('workProjects', projects);
  };

  const addWorkProject = (project: WorkProject) => {
    save({ ...data, workProjects: [project, ...data.workProjects] });
    void apiRequest('/workProjects', 'POST', workProjectPayload(project)).catch((error) => console.error('Gagal membuat project di TiDB:', error));
  };

  const editWorkProject = (id: string, updated: Partial<WorkProject>) => {
    const next = data.workProjects.map((p) => (p.id === id ? { ...p, ...updated } : p));
    save({ ...data, workProjects: next });
    const project = next.find((p) => p.id === id);
    if (project) {
      void apiRequest(`/workProjects/${encodeURIComponent(id)}`, 'PUT', workProjectPayload(project))
        .catch((error) => console.error('Gagal mengubah project di TiDB:', error));
    }
  };

  const deleteWorkProject = (id: string) => {
    const next = data.workProjects.filter((p) => p.id !== id);
    save({ ...data, workProjects: next });
    void apiRequest(`/workProjects/${encodeURIComponent(id)}`, 'DELETE').catch((error) => console.error('Gagal menghapus project di TiDB:', error));
  };

  const updateLabNotes = (notes: LabNote[]) => {
    save({ ...data, labNotes: notes });
    syncCollection('labNotes', notes);
  };

  const addLabNote = (note: LabNote) => {
    save({ ...data, labNotes: [note, ...data.labNotes] });
    void apiRequest('/labNotes', 'POST', labNotePayload(note)).catch((error) => console.error('Gagal membuat lab note di TiDB:', error));
  };

  const editLabNote = (id: string, updated: Partial<LabNote>) => {
    const next = data.labNotes.map((n) => (n.id === id ? { ...n, ...updated } : n));
    save({ ...data, labNotes: next });
    const note = next.find((n) => n.id === id);
    if (note) {
      void apiRequest(`/labNotes/${encodeURIComponent(id)}`, 'PUT', labNotePayload(note))
        .catch((error) => console.error('Gagal mengubah lab note di TiDB:', error));
    }
  };

  const deleteLabNote = (index: number) => {
    const next = data.labNotes.filter((_, i) => i !== index);
    save({ ...data, labNotes: next });
    const removed = data.labNotes[index];
    if (removed) void apiRequest(`/labNotes/${encodeURIComponent(removed.id)}`, 'DELETE').catch((error) => console.error('Gagal menghapus lab note di TiDB:', error));
  };

  const updateTalksWriting = (items: TalkWriting[]) => {
    save({ ...data, talksWriting: items });
    syncCollection('talksWriting', items.map(talkWritingPayload));
  };

  const addTalkWriting = (item: TalkWriting) => {
    const id = `talk-${Date.now()}`;
    const itemWithId = { id, ...item };
    save({ ...data, talksWriting: [itemWithId, ...data.talksWriting] });
    void apiRequest('/talksWriting', 'POST', talkWritingPayload(itemWithId, 0)).catch((error) => console.error('Gagal membuat tulisan di TiDB:', error));
  };

  const editTalkWriting = (index: number, item: TalkWriting) => {
    const next = [...data.talksWriting];
    next[index] = { ...item, id: item.id || data.talksWriting[index]?.id || `talk-${index + 1}` };
    save({ ...data, talksWriting: next });
    const id = next[index].id || `talk-${index + 1}`;
    void apiRequest(`/talksWriting/${encodeURIComponent(id)}`, 'PUT', talkWritingPayload(next[index], index)).catch((error) => console.error('Gagal mengubah tulisan di TiDB:', error));
  };

  const deleteTalkWriting = (index: number) => {
    const next = data.talksWriting.filter((_, i) => i !== index);
    save({ ...data, talksWriting: next });
    const id = data.talksWriting[index]?.id || `talk-${index + 1}`;
    void apiRequest(`/talksWriting/${encodeURIComponent(id)}`, 'DELETE').catch((error) => console.error('Gagal menghapus tulisan di TiDB:', error));
  };

  const updateCareerList = (items: CareerItem[]) => {
    save({ ...data, careerList: items });
    syncCollection('careerList', items);
  };

  const updateExperienceSlides = (slides: ExperienceSlide[]) => {
    save({ ...data, experienceSlides: slides });
    syncCollection('experienceSlides', slides);
  };

  const updateCaseStudy = (id: string, study: CaseStudy) => {
    save({
      ...data,
      caseStudies: {
        ...data.caseStudies,
        [id]: study,
      },
    });
    void apiRequest(`/caseStudies/${encodeURIComponent(id)}`, 'PUT', caseStudyPayload(study)).catch((error) => console.error('Gagal menyimpan case study ke TiDB:', error));
  };

  const updateContact = (patch: Partial<ContactData>) => {
    save({
      ...data,
      contact: { ...data.contact, ...patch },
    });
    void apiRequest('/contact', 'PUT', { ...data.contact, ...patch }).catch((error) => console.error('Gagal menyimpan contact ke TiDB:', error));
  };

  const updateNowItems = (items: NowItem[]) => {
    save({ ...data, nowItems: items });
    syncCollection('nowItems', items.map((item, index) => ({ id: `now-${index + 1}`, key: item.k, value: item.v })));
  };

  const updateGitAccounts = (accounts: GitAccount[]) => {
    save({ ...data, gitAccounts: accounts });
    syncCollection('gitAccounts', accounts);
  };

  const editGitAccount = (id: string, updated: Partial<GitAccount>) => {
    const current =
      data.gitAccounts && data.gitAccounts.length > 0
        ? data.gitAccounts
        : DEFAULT_GIT_ACCOUNTS;
    const next = current.map((a) => (a.id === id ? { ...a, ...updated } : a));
    save({ ...data, gitAccounts: next });
    const account = next.find((item) => item.id === id);
    if (account) {
      void apiRequest(`/gitAccounts/${encodeURIComponent(id)}`, 'PUT', account)
        .catch((error) => console.error('Gagal menyimpan akun Git ke TiDB:', error));
    }
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData({
      ...INITIAL_PORTFOLIO_DATA,
      gitAccounts: DEFAULT_GIT_ACCOUNTS,
    } as PortfolioData);
    setLastSaved(new Date());
  };

  const importData = (imported: PortfolioData): boolean => {
    try {
      if (!imported || typeof imported !== 'object') return false;
      if (!imported.profile || !imported.workProjects) return false;
      save({
        ...imported,
        gitAccounts:
          Array.isArray(imported.gitAccounts) && imported.gitAccounts.length > 0
            ? imported.gitAccounts
            : DEFAULT_GIT_ACCOUNTS,
      });
      return true;
    } catch {
      return false;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isLoading,
        isDatabaseLoaded,
        lastSaved,
        updateProfile,
        updateWorkProjects,
        addWorkProject,
        editWorkProject,
        deleteWorkProject,
        updateLabNotes,
        addLabNote,
        editLabNote,
        deleteLabNote,
        updateTalksWriting,
        addTalkWriting,
        editTalkWriting,
        deleteTalkWriting,
        updateCareerList,
        updateExperienceSlides,
        updateCaseStudy,
        updateContact,
        updateNowItems,
        updateGitAccounts,
        editGitAccount,
        resetToDefaults,
        importData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
