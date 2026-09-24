export type RouteId = 
  | 'home'
  | 'work'
  | 'lab-notes'
  | 'about'
  | 'experience'
  | 'exp-1'
  | 'exp-2'
  | 'exp-3'
  | 'exp-4'
  | 'contact'
  | 'admin'
  | (string & {});

export interface CaseStudy {
  id: string;
  period: string;
  company: string;
  role: string;
  subtitle: string;
  heroImage: string;
  heroCaption: string;
  leadParagraph1: string;
  midImage: string;
  midCaption: string;
  leadParagraph2: string;
  bulletPoints: string[];
  endImage: string;
  endCaption: string;
  prev?: { id: RouteId; label: string };
  next?: { id: RouteId; label: string };
}

export interface WorkProject {
  id: string;
  title: string;
  desc: string;
  img: string;
  alt: string;
  tags: string[];
  images?: string[];
  period?: string;
  github?: string;
  demoUrl?: string;
  highlights?: string[];
}

export interface LabNoteCodeSnippet {
  language: string;
  code: string;
  filename?: string;
}

export interface LabNote {
  id: string;
  title: string;
  slug: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  caption: string;
  img: string;
  alt: string;
  summary: string;
  content: string[];
  codeSnippet?: LabNoteCodeSnippet;
  keyTakeaways?: string[];
}

export interface TalkWriting {
  id?: string;
  title: string;
  desc: string;
  tag: string;
}

export interface CareerItem {
  id: string;
  title: string;
  date: string;
}

export interface ExperienceSlide {
  id: string;
  roleTitle: string;
  date: string;
  img: string;
  alt: string;
  captionTitle: string;
  captionSub: string;
}

export interface NowItem {
  k: string;
  v: string;
}

export interface ProfileData {
  name: string;
  role: string;
  location: string;
  heroTitle: string;
  heroLead: string;
  heroMeta: Array<{ label: string; value: string }>;
  heroStats: Array<{ num: string; unit?: string; label: string }>;
  splitParallax: {
    title: string;
    desc: string;
    img: string;
  };
  homeQuote: {
    text: string;
    cite: string;
    bgImage: string;
  };
  aboutQuote: {
    text: string;
    cite: string;
    bgImage: string;
  };
  aboutBio: string[];
  toolsHeading: string;
  toolsText1: string;
  toolsText2: string;
  portraitImg: string;
  approachHeading: string;
  approachLead: string;
  approachSteps: string[];
}

export interface ContactData {
  heading: string;
  email: string;
  github: string;
  linkedin: string;
  xTwitter: string;
  pgpNote: string;
}

export interface GitLanguage {
  name: string;
  pct: number;
  color: string;
}

export interface GitCommitItem {
  hash: string;
  msg: string;
  repo: string;
  timeAgo: string;
  branch: string;
}

export interface GitAccount {
  id: string;
  name: string;
  handle: string;
  role: string;
  url: string;
  avatarUrl?: string;
  avatarText: string;
  badge: string;
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  pullRequests: number;
  reposCount: number;
  seed: number;
  languages: GitLanguage[];
  recentCommits: GitCommitItem[];
  contributionMatrix?: Array<Array<{ level: number; count: number; dateStr: string }>>;
  followers?: number;
  isLive?: boolean;
  source?: string;
}

export interface PortfolioData {
  profile: ProfileData;
  workProjects: WorkProject[];
  labNotes: LabNote[];
  talksWriting: TalkWriting[];
  careerList: CareerItem[];
  experienceSlides: ExperienceSlide[];
  caseStudies: Record<string, CaseStudy>;
  contact: ContactData;
  nowItems: NowItem[];
  gitAccounts?: GitAccount[];
}
