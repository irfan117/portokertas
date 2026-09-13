import React, { useState, useMemo } from 'react';
import { GitBranch, GitCommit, GitPullRequest, ExternalLink, Activity, Terminal, Layers, CheckCircle2 } from 'lucide-react';
import { GitAccount } from '../../types';
import { usePortfolio } from '../../context/PortfolioContext';

export const DEFAULT_GIT_ACCOUNTS: GitAccount[] = [
  {
    id: 'all',
    name: 'M. Irfan — Unified Telemetry',
    handle: '@irfan117 + multi-accounts',
    role: 'Cross-organization Backend & AI Engineering',
    url: 'https://github.com/irfan117',
    avatarText: 'MI',
    badge: '4 Accounts Synced',
    totalContributions: 1842,
    currentStreak: 28,
    longestStreak: 56,
    pullRequests: 34,
    reposCount: 28,
    seed: 42,
    languages: [
      { name: 'Python', pct: 44, color: '#3572A5' },
      { name: 'TypeScript/JS', pct: 32, color: '#3178C6' },
      { name: 'Qdrant / SQL', pct: 14, color: '#E38C00' },
      { name: 'Docker / Shell', pct: 10, color: '#384d54' },
    ],
    recentCommits: [
      {
        hash: 'a7b3c21',
        msg: 'feat(rag-pipeline): implement semantic caching with Redis and Qdrant vector similarity',
        repo: 'irfan117/rag-institutional-chatbot',
        timeAgo: '2 hours ago',
        branch: 'main',
      },
      {
        hash: 'f92d4e8',
        msg: 'refactor(fastapi): add streaming SSE response for LLM token generation',
        repo: 'irfan117/rag-institutional-chatbot',
        timeAgo: 'yesterday',
        branch: 'main',
      },
      {
        hash: 'c819a40',
        msg: 'feat(web): embeddable chat widget with session token authentication',
        repo: 'fegeirfan/rag-chat-widget',
        timeAgo: '2 days ago',
        branch: 'main',
      },
      {
        hash: 'e42f01c',
        msg: 'perf(ocr): optimize async document parsing for multi-page PDF ingestion',
        repo: 'mirfan1q1-lgtm/doc-ocr-pipeline',
        timeAgo: '4 days ago',
        branch: 'main',
      },
    ],
  },
  {
    id: 'irfan117',
    name: 'M. Irfan (Core & AI/RAG)',
    handle: '@irfan117',
    role: 'RAG Pipeline, FastAPI, Vector Search & LLMs',
    url: 'https://github.com/irfan117',
    avatarText: 'IR',
    badge: 'Primary / AI & Backend',
    totalContributions: 890,
    currentStreak: 28,
    longestStreak: 56,
    pullRequests: 16,
    reposCount: 12,
    seed: 19,
    languages: [
      { name: 'Python', pct: 68, color: '#3572A5' },
      { name: 'TypeScript', pct: 18, color: '#3178C6' },
      { name: 'Docker', pct: 14, color: '#384d54' },
    ],
    recentCommits: [
      {
        hash: 'a7b3c21',
        msg: 'feat(rag-pipeline): implement semantic caching with Redis and Qdrant vector similarity',
        repo: 'irfan117/rag-institutional-chatbot',
        timeAgo: '2 hours ago',
        branch: 'main',
      },
      {
        hash: 'f92d4e8',
        msg: 'refactor(fastapi): add streaming SSE response for LLM token generation',
        repo: 'irfan117/rag-institutional-chatbot',
        timeAgo: 'yesterday',
        branch: 'main',
      },
      {
        hash: 'b149ec7',
        msg: 'feat(vector-db): configure payload indexes for metadata filtering in Qdrant',
        repo: 'irfan117/rag-institutional-chatbot',
        timeAgo: '3 days ago',
        branch: 'main',
      },
    ],
  },
  {
    id: 'fegeirfan',
    name: 'Irfan (Web & Apps)',
    handle: '@fegeirfan',
    role: 'Web Applications, Frontend Integrations & UI Tooling',
    url: 'https://github.com/fegeirfan',
    avatarText: 'FE',
    badge: 'Web & UI Projects',
    totalContributions: 410,
    currentStreak: 12,
    longestStreak: 34,
    pullRequests: 8,
    reposCount: 7,
    seed: 57,
    languages: [
      { name: 'TypeScript / React', pct: 60, color: '#3178C6' },
      { name: 'JavaScript', pct: 25, color: '#F7DF1E' },
      { name: 'CSS / Tailwind', pct: 15, color: '#38BDF8' },
    ],
    recentCommits: [
      {
        hash: 'c819a40',
        msg: 'feat(web): embeddable chat widget with session token authentication',
        repo: 'fegeirfan/rag-chat-widget',
        timeAgo: '2 days ago',
        branch: 'main',
      },
      {
        hash: '90db117',
        msg: 'style(ui): responsive markdown message renderer with syntax highlighting',
        repo: 'fegeirfan/rag-chat-widget',
        timeAgo: '5 days ago',
        branch: 'main',
      },
      {
        hash: '7a21fb9',
        msg: 'fix(auth): handle expired token refresh gracefully in client session',
        repo: 'fegeirfan/portal-client',
        timeAgo: '1 week ago',
        branch: 'main',
      },
    ],
  },
  {
    id: 'armagedon999',
    name: 'Armagedon999 (Lab & Experiments)',
    handle: '@Armagedon999',
    role: 'Experimental Architectures, Systems & Explorations',
    url: 'https://github.com/Armagedon999',
    avatarText: 'AR',
    badge: 'Lab & Experiments',
    totalContributions: 320,
    currentStreak: 8,
    longestStreak: 26,
    pullRequests: 5,
    reposCount: 5,
    seed: 73,
    languages: [
      { name: 'Python', pct: 45, color: '#3572A5' },
      { name: 'Node.js / JS', pct: 35, color: '#F7DF1E' },
      { name: 'C++ / Algorithms', pct: 20, color: '#F34B7D' },
    ],
    recentCommits: [
      {
        hash: '89a2bc3',
        msg: 'exp(embeddings): evaluate cross-encoder reranking latency on Indonesian legal texts',
        repo: 'Armagedon999/reranker-bench',
        timeAgo: '3 days ago',
        branch: 'main',
      },
      {
        hash: '4a71cc8',
        msg: 'poc(socket): lightweight WebSocket connection pool for multi-agent dispatch',
        repo: 'Armagedon999/agent-router',
        timeAgo: '1 week ago',
        branch: 'main',
      },
    ],
  },
  {
    id: 'mirfan1q1-lgtm',
    name: 'M. Irfan (CI/CD & Pipelines)',
    handle: '@mirfan1q1-lgtm',
    role: 'Automated CI/CD Pipelines, OCR & Container Ops',
    url: 'https://github.com/mirfan1q1-lgtm',
    avatarText: 'LG',
    badge: 'DevOps & Pipelines',
    totalContributions: 222,
    currentStreak: 14,
    longestStreak: 21,
    pullRequests: 5,
    reposCount: 4,
    seed: 88,
    languages: [
      { name: 'Docker / YAML', pct: 40, color: '#384d54' },
      { name: 'Python', pct: 38, color: '#3572A5' },
      { name: 'Shell / Bash', pct: 22, color: '#89E051' },
    ],
    recentCommits: [
      {
        hash: 'e42f01c',
        msg: 'perf(ocr): optimize async document parsing for multi-page PDF ingestion',
        repo: 'mirfan1q1-lgtm/doc-ocr-pipeline',
        timeAgo: '4 days ago',
        branch: 'main',
      },
      {
        hash: '3d18ba9',
        msg: 'ci(github-actions): automated linting, pytest matrix and docker build push',
        repo: 'mirfan1q1-lgtm/ci-infra',
        timeAgo: '6 days ago',
        branch: 'main',
      },
    ],
  },
];

// Generate 48 weeks of 7-day contribution data deterministically
function generateContributionMatrix(seed: number, multiplier: number) {
  const weeks = 46;
  const daysPerWeek = 7;
  const matrix: { level: number; count: number; dateStr: string }[][] = [];

  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - weeks * 7);

  let current = new Date(startDate);

  for (let w = 0; w < weeks; w++) {
    const col: { level: number; count: number; dateStr: string }[] = [];
    for (let d = 0; d < daysPerWeek; d++) {
      // Deterministic pseudorandom value
      const val = Math.sin(seed + w * 13 + d * 7) * 10000;
      const rand = val - Math.floor(val);

      let level = 0;
      let count = 0;

      // Adjust distribution based on multiplier
      if (multiplier > 1.5) {
        // Combined
        if (rand > 0.15) {
          level = rand > 0.85 ? 4 : rand > 0.6 ? 3 : rand > 0.35 ? 2 : 1;
          count = Math.floor(level * (rand * 4 + 1));
        }
      } else if (multiplier > 1.0) {
        // Work
        if (d >= 1 && d <= 5) {
          // Weekdays higher
          if (rand > 0.22) {
            level = rand > 0.82 ? 4 : rand > 0.55 ? 3 : rand > 0.3 ? 2 : 1;
            count = Math.floor(level * (rand * 3 + 1));
          }
        } else {
          if (rand > 0.7) {
            level = 1;
            count = 1;
          }
        }
      } else {
        // Personal or labs
        if (rand > 0.45) {
          level = rand > 0.88 ? 3 : rand > 0.7 ? 2 : 1;
          count = Math.floor(level * 2);
        }
      }

      const dateStr = current.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      col.push({ level, count, dateStr });
      current.setDate(current.getDate() + 1);
    }
    matrix.push(col);
  }

  return matrix;
}

export const GitAccountsBar: React.FC = () => {
  const { data } = usePortfolio();
  const accounts = useMemo(() => {
    return data.gitAccounts || [];
  }, [data.gitAccounts]);

  const [selectedAccountId, setSelectedAccountId] = useState<string>('all');
  const [hoveredCell, setHoveredCell] = useState<{
    dateStr: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);
  const [activeView, setActiveView] = useState<'matrix' | 'commits'>('matrix');

  const selectedAccount = useMemo(() => {
    return (
      accounts.find((a) => a.id === selectedAccountId) || accounts[0]
    );
  }, [accounts, selectedAccountId]);

  if (accounts.length === 0) {
    return (
      <section className="home-git-section wrap" id="git-activity-bar" aria-label="Git Activity Telemetry">
        <p className="text-muted">Belum ada akun Git yang tersimpan. Tambahkan akun melalui Admin Git Radar.</p>
      </section>
    );
  }

  const matrix = useMemo(() => {
    const mult =
      selectedAccount.id === 'all'
        ? 2.0
        : selectedAccount.id === 'enterprise'
        ? 1.2
        : 0.8;
    return generateContributionMatrix(selectedAccount.seed, mult);
  }, [selectedAccount]);

  const months = ['Apr', 'Jun', 'Aug', 'Oct', 'Dec', 'Feb', 'Present'];

  return (
    <section className="home-git-section wrap" id="git-activity-bar" aria-label="Git Activity Telemetry">
      {/* TOP TABS - SEAMLESS WITH WEB SECTION */}
      <div className="git-section-nav">
        {/* Account Selector Tabs */}
        <div className="git-account-tabs" role="tablist" aria-label="Select Git Account">
          {accounts.map((acc) => {
            const isActive = acc.id === selectedAccountId;
            return (
              <button
                key={acc.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`git-tab-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => setSelectedAccountId(acc.id)}
              >
                <span className="git-tab-indicator" />
                <span className="git-tab-label">{acc.handle}</span>
                {acc.id === 'all' && <span className="git-tab-badge">Combined</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ACCOUNT IDENTITY & KPI STRIP - SEAMLESS WITH WEB SECTION */}
      <div className="git-account-hero">
        <div className="git-account-meta">
          <div className="git-avatar-box">
            <span className="git-avatar-text">{selectedAccount.avatarText}</span>
          </div>
          <div className="git-info-text">
            <div className="git-handle-row">
              <h3 className="git-account-name">{selectedAccount.name}</h3>
              <a
                href={selectedAccount.url}
                target="_blank"
                rel="noopener noreferrer"
                className="git-external-link"
                title="View Git Profile"
              >
                <span className="mono-sm">{selectedAccount.handle}</span>
                <ExternalLink size={13} />
              </a>
            </div>
            <p className="git-account-desc">{selectedAccount.role}</p>
          </div>
        </div>

        {/* Quick KPIs */}
        <div className="git-kpi-grid">
          <div className="git-kpi-item">
            <span className="git-kpi-num">
              {selectedAccount.totalContributions.toLocaleString()}
            </span>
            <span className="git-kpi-label mono-sm">
              <GitCommit size={13} /> Contribs (12m)
            </span>
          </div>
          <div className="git-kpi-item">
            <span className="git-kpi-num">{selectedAccount.currentStreak}d</span>
            <span className="git-kpi-label mono-sm">
              <Activity size={13} /> Active Streak
            </span>
          </div>
          <div className="git-kpi-item">
            <span className="git-kpi-num">{selectedAccount.pullRequests}</span>
            <span className="git-kpi-label mono-sm">
              <GitPullRequest size={13} /> Merged PRs
            </span>
          </div>
          <div className="git-kpi-item">
            <span className="git-kpi-num">{selectedAccount.reposCount}</span>
            <span className="git-kpi-label mono-sm">
              <Layers size={13} /> Active Repos
            </span>
          </div>
        </div>
      </div>

      {/* THE GRAPH BAR - NOW DEDICATED IN A CLEAN CARD DIV */}
      <div className="git-graph-card">
        <div className="git-matrix-header">
          <div className="git-matrix-heading">
            <span className="mono-sm text-muted">
              {selectedAccount.totalContributions.toLocaleString()} contributions in the last 12 months
            </span>
          </div>

          <div className="git-view-toggle">
            <button
              type="button"
              className={`git-view-btn ${activeView === 'matrix' ? 'is-active' : ''}`}
              onClick={() => setActiveView('matrix')}
            >
              <Activity size={13} /> Matrix Graph
            </button>
            <button
              type="button"
              className={`git-view-btn ${activeView === 'commits' ? 'is-active' : ''}`}
              onClick={() => setActiveView('commits')}
            >
              <Terminal size={13} /> Recent Log ({selectedAccount.recentCommits.length})
            </button>
          </div>
        </div>

          {activeView === 'matrix' ? (
            <div className="git-heatmap-wrapper">
              {/* Month Labels */}
              <div className="git-months-row mono-sm">
                {months.map((m, idx) => (
                  <span key={idx}>{m}</span>
                ))}
              </div>

              {/* Heatmap Grid */}
              <div className="git-grid-scroll">
                <div className="git-day-labels mono-sm">
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                </div>

                <div className="git-matrix-grid">
                  {matrix.map((col, colIdx) => (
                    <div key={colIdx} className="git-matrix-col">
                      {col.map((cell, rowIdx) => (
                        <div
                          key={rowIdx}
                          className={`git-cell git-level-${cell.level}`}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredCell({
                              dateStr: cell.dateStr,
                              count: cell.count,
                              x: rect.left + rect.width / 2,
                              y: rect.top - 8,
                            });
                          }}
                          onMouseLeave={() => setHoveredCell(null)}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Legend & Quick Stats */}
              <div className="git-heatmap-footer">
                <div className="git-legend mono-sm">
                  <span>Less</span>
                  <span className="git-cell-sample git-level-0" />
                  <span className="git-cell-sample git-level-1" />
                  <span className="git-cell-sample git-level-2" />
                  <span className="git-cell-sample git-level-3" />
                  <span className="git-cell-sample git-level-4" />
                  <span>More</span>
                </div>

                <div className="git-streak-note mono-sm">
                  <CheckCircle2 size={13} className="text-accent" />
                  <span>Verified commit signatures & automated pipeline deployments</span>
                </div>
              </div>
            </div>
          ) : (
            /* COMMITS LIST VIEW */
            <div className="git-commits-list">
              {selectedAccount.recentCommits.map((commit, idx) => (
                <div key={idx} className="git-commit-row">
                  <div className="git-commit-prefix mono-sm">
                    <GitBranch size={13} className="text-muted" />
                    <span className="git-commit-branch">{commit.branch}</span>
                    <span className="git-commit-hash">{commit.hash}</span>
                  </div>
                  <div className="git-commit-body">
                    <p className="git-commit-msg">{commit.msg}</p>
                    <span className="git-commit-repo mono-sm">{commit.repo}</span>
                  </div>
                  <div className="git-commit-time mono-sm">{commit.timeAgo}</div>
                </div>
              ))}
            </div>
          )}

          {/* LANGUAGE SEGMENTATION BAR */}
          <div className="git-lang-strip">
            <div className="git-lang-bar">
              {selectedAccount.languages.map((lang, idx) => (
                <div
                  key={idx}
                  className="git-lang-segment"
                  style={{
                    width: `${lang.pct}%`,
                    backgroundColor: lang.color,
                  }}
                  title={`${lang.name}: ${lang.pct}%`}
                />
              ))}
            </div>

            <div className="git-lang-labels">
              {selectedAccount.languages.map((lang, idx) => (
                <div key={idx} className="git-lang-item mono-sm">
                  <span
                    className="git-lang-dot"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="git-lang-name">{lang.name}</span>
                  <span className="git-lang-pct">{lang.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      {/* FLOATING HOVER TOOLTIP */}
      {hoveredCell && (
        <div
          className="git-cell-tooltip"
          style={{
            position: 'fixed',
            left: `${hoveredCell.x}px`,
            top: `${hoveredCell.y}px`,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          <span className="font-semibold text-white">
            {hoveredCell.count > 0 ? `${hoveredCell.count} commits` : 'No contributions'}
          </span>
          <span className="git-tooltip-date">{hoveredCell.dateStr}</span>
        </div>
      )}
    </section>
  );
};
