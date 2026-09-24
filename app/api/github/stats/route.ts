import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GITHUB_API = 'https://api.github.com';
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Python: '#3572A5',
  HTML: '#E34C26',
  CSS: '#563D7C',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Shell: '#89E051',
  Dockerfile: '#384D54',
  PHP: '#4F5D95',
  Java: '#B07219',
};

interface GitHubUserInput {
  id?: string;
  name?: string;
  handle?: string;
  url?: string;
  role?: string;
  badge?: string;
}

interface ContributionDay {
  level: number;
  count: number;
  dateStr: string;
}

function githubHeaders() {
  return {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-github-stats',
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
  };
}

function usernameFromAccount(account: GitHubUserInput) {
  const handle = account.handle?.replace('@', '').trim();
  if (handle && !handle.includes('+') && handle !== 'all') return handle;
  const urlMatch = account.url?.match(/github\.com\/([^/?#]+)/i)?.[1];
  if (urlMatch) return urlMatch;
  return account.id && account.id !== 'all' ? account.id : '';
}

function contributionLevel(count: number) {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function timeAgo(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

async function githubFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${GITHUB_API}${path}`, {
    headers: githubHeaders(),
    next: { revalidate: 900 },
  });

  if (!response.ok) {
    throw new Error(`GitHub API ${path} gagal (${response.status})`);
  }

  return response.json() as Promise<T>;
}

async function fetchContributionCalendar(username: string) {
  if (!process.env.GITHUB_TOKEN) return null;

  const to = new Date();
  const from = new Date(to);
  from.setFullYear(to.getFullYear() - 1);

  const query = `
    query($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
          totalPullRequestContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...githubHeaders(),
    },
    body: JSON.stringify({ query, variables: { login: username, from: from.toISOString(), to: to.toISOString() } }),
    next: { revalidate: 900 },
  });

  if (!response.ok) return null;
  const body = await response.json();
  return body?.data?.user?.contributionsCollection ?? null;
}

async function buildAccountStats(account: GitHubUserInput) {
  const username = usernameFromAccount(account);
  if (!username) return null;

  const [user, repos, events, contributions] = await Promise.all([
    githubFetch<any>(`/users/${encodeURIComponent(username)}`),
    githubFetch<any[]>(`/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`),
    githubFetch<any[]>(`/users/${encodeURIComponent(username)}/events/public?per_page=100`).catch(() => []),
    fetchContributionCalendar(username),
  ]);

  const languageCounts = new Map<string, number>();
  repos.forEach((repo) => {
    if (repo.language) languageCounts.set(repo.language, (languageCounts.get(repo.language) || 0) + 1);
  });
  const totalLanguageRepos = Array.from(languageCounts.values()).reduce((sum, value) => sum + value, 0) || 1;
  const languages = Array.from(languageCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, count]) => ({
      name,
      pct: Math.max(1, Math.round((count / totalLanguageRepos) * 100)),
      color: LANGUAGE_COLORS[name] || '#64748B',
    }));

  const pushEvents = events.filter((event) => event.type === 'PushEvent');
  const recentCommits = pushEvents
    .flatMap((event) =>
      (event.payload?.commits || []).slice(0, 3).map((commit: any) => ({
        hash: String(commit.sha || '').slice(0, 7),
        msg: commit.message || 'Commit',
        repo: event.repo?.name || `${username}/repository`,
        timeAgo: timeAgo(event.created_at),
        branch: String(event.payload?.ref || 'refs/heads/main').replace('refs/heads/', ''),
      })),
    )
    .slice(0, 8);

  const fallbackWeeks: ContributionDay[][] = [];
  const days = new Map<string, number>();
  pushEvents.forEach((event) => {
    const day = String(event.created_at).slice(0, 10);
    const count = Array.isArray(event.payload?.commits) ? event.payload.commits.length : 1;
    days.set(day, (days.get(day) || 0) + count);
  });
  const start = new Date();
  start.setDate(start.getDate() - 46 * 7);
  for (let week = 0; week < 46; week += 1) {
    const col: ContributionDay[] = [];
    for (let day = 0; day < 7; day += 1) {
      const current = new Date(start);
      current.setDate(start.getDate() + week * 7 + day);
      const key = current.toISOString().slice(0, 10);
      const count = days.get(key) || 0;
      col.push({ count, level: contributionLevel(count), dateStr: formatDate(key) });
    }
    fallbackWeeks.push(col);
  }

  const calendarWeeks: ContributionDay[][] | undefined = contributions?.contributionCalendar?.weeks?.map((week: any) =>
    week.contributionDays.map((day: any) => ({
      count: day.contributionCount,
      level: contributionLevel(day.contributionCount),
      dateStr: formatDate(day.date),
    })),
  );

  return {
    id: username.toLowerCase(),
    name: account.name || user.name || username,
    handle: `@${username}`,
    role: account.role || user.bio || 'GitHub public activity',
    url: user.html_url,
    avatarUrl: user.avatar_url,
    avatarText: username.slice(0, 2).toUpperCase(),
    badge: account.badge || `${user.public_repos} public repos`,
    totalContributions: contributions?.contributionCalendar?.totalContributions ?? pushEvents.reduce((sum, event) => sum + (event.payload?.commits?.length || 1), 0),
    currentStreak: 0,
    longestStreak: 0,
    pullRequests: contributions?.totalPullRequestContributions ?? 0,
    reposCount: user.public_repos,
    followers: user.followers,
    seed: username.length * 13,
    languages,
    recentCommits,
    contributionMatrix: calendarWeeks || fallbackWeeks,
    isLive: true,
    source: contributions ? 'github-graphql' : 'github-rest-public',
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const accounts = Array.isArray(body.accounts) ? body.accounts : [];
    const uniqueAccounts = accounts
      .filter((account: GitHubUserInput) => usernameFromAccount(account))
      .filter((account: GitHubUserInput, index: number, all: GitHubUserInput[]) => {
        const username = usernameFromAccount(account).toLowerCase();
        return all.findIndex((item) => usernameFromAccount(item).toLowerCase() === username) === index;
      })
      .slice(0, 8);

    const liveAccounts = (await Promise.all(uniqueAccounts.map(buildAccountStats))).filter(Boolean);
    const combined = liveAccounts.length > 1
      ? {
          id: 'all',
          name: 'Combined GitHub Activity',
          handle: liveAccounts.map((account: any) => account.handle).join(' + '),
          role: 'Real public GitHub activity from connected accounts',
          url: liveAccounts[0]?.url || 'https://github.com',
          avatarText: 'GH',
          badge: `${liveAccounts.length} live accounts`,
          totalContributions: liveAccounts.reduce((sum: number, account: any) => sum + account.totalContributions, 0),
          currentStreak: 0,
          longestStreak: 0,
          pullRequests: liveAccounts.reduce((sum: number, account: any) => sum + account.pullRequests, 0),
          reposCount: liveAccounts.reduce((sum: number, account: any) => sum + account.reposCount, 0),
          followers: liveAccounts.reduce((sum: number, account: any) => sum + (account.followers || 0), 0),
          seed: 99,
          languages: liveAccounts.flatMap((account: any) => account.languages).slice(0, 4),
          recentCommits: liveAccounts.flatMap((account: any) => account.recentCommits).slice(0, 10),
          contributionMatrix: liveAccounts[0]?.contributionMatrix || [],
          isLive: true,
          source: liveAccounts.some((account: any) => account.source === 'github-graphql') ? 'github-graphql' : 'github-rest-public',
        }
      : null;

    return NextResponse.json({
      accounts: combined ? [combined, ...liveAccounts] : liveAccounts,
      tokenEnabled: Boolean(process.env.GITHUB_TOKEN),
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal mengambil statistik GitHub.' },
      { status: 500 },
    );
  }
}
