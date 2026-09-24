import React, { useEffect, useMemo, useState } from 'react';
import { Activity, ExternalLink, GitBranch, GitCommit, GitPullRequest, Layers, Terminal } from 'lucide-react';
import { GitAccount } from '../../types';
import { usePortfolio } from '../../context/PortfolioContext';

/* ── helpers ── */
function usernameFromAccount(account: GitAccount): string {
  const urlMatch = account.url?.match(/github\.com\/([^/?#]+)/i)?.[1];
  const handle = (urlMatch || account.handle || account.id).replace('@', '').trim();
  return handle;
}

function makeStub(username: string, index = 0): GitAccount {
  return {
    id: username.toLowerCase(),
    name: username,
    handle: `@${username}`,
    role: 'GitHub public activity',
    url: `https://github.com/${username}`,
    avatarText: username.slice(0, 2).toUpperCase(),
    badge: index === 0 ? 'Primary GitHub' : 'Connected GitHub',
    totalContributions: 0,
    currentStreak: 0,
    longestStreak: 0,
    pullRequests: 0,
    reposCount: 0,
    seed: 1,
    languages: [],
    recentCommits: [],
    contributionMatrix: [],
  };
}

export const DEFAULT_GIT_ACCOUNTS: GitAccount[] = [
  makeStub('irfan117', 0),
  makeStub('fegeirfan', 1),
  makeStub('Armagedon999', 2),
  makeStub('mirfan1q1-lgtm', 3),
];

/* ── Contribution heatmap cell component ── */
function HeatmapCell({
  cell,
  onHover,
  onLeave,
}: {
  cell: { level: number; count: number; dateStr: string };
  onHover: (info: { dateStr: string; count: number; x: number; y: number }) => void;
  onLeave: () => void;
}) {
  return (
    <div
      className={`git-cell git-level-${cell.level}`}
      onMouseEnter={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        onHover({ dateStr: cell.dateStr, count: cell.count, x: rect.left + rect.width / 2, y: rect.top - 8 });
      }}
      onMouseLeave={onLeave}
    />
  );
}

/* ── Main component ── */
export const GitAccountsBar: React.FC = () => {
  const { data } = usePortfolio();

  // Build source account list from DB (or defaults if DB empty)
  const sourceAccounts = useMemo<GitAccount[]>(() => {
    const dbAccounts = data.gitAccounts?.filter((a) => a.id !== 'all');
    return dbAccounts && dbAccounts.length > 0 ? dbAccounts : DEFAULT_GIT_ACCOUNTS;
  }, [data.gitAccounts]);

  // Stub list shown immediately (while live data loads)
  // PENTING: gunakan account.id asli dari DB (bukan username dari URL) agar key tidak duplikat
  const stubs = useMemo<GitAccount[]>(
    () =>
      sourceAccounts.map((account, index) => {
        const username = usernameFromAccount(account);
        return {
          ...makeStub(username, index),
          id: account.id, // preserve original DB id to avoid duplicate React keys
        };
      }),
    [sourceAccounts],
  );

  const [accounts, setAccounts] = useState<GitAccount[]>(stubs);
  const [selectedId, setSelectedId] = useState<string>(stubs[0]?.id || '');
  const [activeView, setActiveView] = useState<'matrix' | 'commits'>('matrix');
  const [hoveredCell, setHoveredCell] = useState<{ dateStr: string; count: number; x: number; y: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset stubs when source changes
  useEffect(() => {
    setAccounts(stubs);
    setSelectedId((cur) => (stubs.some((a) => a.id === cur) ? cur : stubs[0]?.id || ''));
  }, [stubs]);

  // Fetch live stats from our API (which calls GitHub)
  useEffect(() => {
    if (stubs.length === 0) return;
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    // Send the raw account list with handles/URLs so the API can resolve usernames
    fetch('/api/github/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accounts: sourceAccounts }),
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub stats API error ${res.status}`);
        return res.json();
      })
      .then((payload) => {
        if (Array.isArray(payload.accounts) && payload.accounts.length > 0) {
          setAccounts(payload.accounts);
          setSelectedId((cur) =>
            payload.accounts.some((a: GitAccount) => a.id === cur) ? cur : payload.accounts[0].id,
          );
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError('Gagal memuat statistik GitHub. Pastikan GITHUB_TOKEN sudah diset di Vercel env vars.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stubs]);

  const selected = useMemo(
    () => accounts.find((a) => a.id === selectedId) || accounts[0],
    [accounts, selectedId],
  );

  // Month labels derived from actual matrix if available
  const matrix = selected?.contributionMatrix || [];
  const hasMatrix = matrix.length > 0;

  // Build dynamic month labels from matrix data
  const monthLabels = useMemo(() => {
    if (!hasMatrix) return ['Apr', 'Jun', 'Aug', 'Oct', 'Dec', 'Feb', 'Present'];
    const seen = new Set<string>();
    const labels: string[] = [];
    for (const col of matrix) {
      for (const cell of col) {
        if (cell.dateStr) {
          const d = new Date(cell.dateStr);
          const label = d.toLocaleDateString('en-US', { month: 'short' });
          if (!seen.has(label)) { seen.add(label); labels.push(label); }
        }
      }
    }
    return labels.length > 0 ? [...labels.slice(0, 6), 'Present'] : ['Apr', 'Jun', 'Aug', 'Oct', 'Dec', 'Feb', 'Present'];
  }, [matrix, hasMatrix]);

  if (accounts.length === 0 || !selected) {
    return (
      <section className="home-git-section wrap" id="git-activity-bar" aria-label="GitHub activity">
        <p className="mono-sm" style={{ color: 'var(--muted)' }}>
          Belum ada akun GitHub. Tambahkan username GitHub melalui panel admin → Git Radar.
        </p>
      </section>
    );
  }

  const hasCommits = Boolean(selected.recentCommits?.length);
  const hasLanguages = Boolean(selected.languages?.length);

  return (
    <section className="home-git-section wrap" id="git-activity-bar" aria-label="GitHub activity">
      {/* ── Account tabs ── */}
      <div className="git-section-nav">
        <div className="git-account-tabs" role="tablist" aria-label="Select GitHub account">
          {accounts.map((account) => (
            <button
              key={account.id}
              type="button"
              role="tab"
              aria-selected={account.id === selectedId}
              className={`git-tab-btn ${account.id === selectedId ? 'is-active' : ''}`}
              onClick={() => setSelectedId(account.id)}
            >
              <span className="git-tab-label">{account.handle}</span>
              {account.id === 'all' && <span className="git-tab-badge">Combined</span>}
            </button>
          ))}
        </div>
        {isLoading && (
          <span className="mono-sm" style={{ color: 'var(--muted)', fontSize: '0.72rem' }}>
            ⟳ Mengambil data GitHub...
          </span>
        )}
      </div>

      {/* ── Account hero / KPIs ── */}
      <div className="git-account-hero">
        <div className="git-account-meta">
          <div className="git-avatar-box">
            {selected.avatarUrl ? (
              <img
                src={selected.avatarUrl}
                alt={selected.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
              />
            ) : (
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>
                {selected.avatarText}
              </span>
            )}
          </div>
          <div className="git-info-text">
            <div className="git-handle-row">
              <h3 className="git-account-name">{selected.name}</h3>
              <a href={selected.url} target="_blank" rel="noopener noreferrer" className="git-external-link" title="View GitHub Profile">
                <span className="mono-sm">{selected.handle}</span>
                <ExternalLink size={13} />
              </a>
            </div>
            <p className="git-account-desc">{selected.role}</p>
          </div>
        </div>

        <div className="git-kpi-grid">
          <div className="git-kpi-item">
            <span className="git-kpi-num">
              {isLoading ? '—' : selected.totalContributions.toLocaleString()}
            </span>
            <span className="git-kpi-label mono-sm"><GitCommit size={13} /> Contributions</span>
          </div>
          <div className="git-kpi-item">
            <span className="git-kpi-num">
              {isLoading ? '—' : (selected.followers ?? 0).toLocaleString()}
            </span>
            <span className="git-kpi-label mono-sm"><Activity size={13} /> Followers</span>
          </div>
          <div className="git-kpi-item">
            <span className="git-kpi-num">
              {isLoading ? '—' : selected.pullRequests}
            </span>
            <span className="git-kpi-label mono-sm"><GitPullRequest size={13} /> Pull Requests</span>
          </div>
          <div className="git-kpi-item">
            <span className="git-kpi-num">
              {isLoading ? '—' : selected.reposCount}
            </span>
            <span className="git-kpi-label mono-sm"><Layers size={13} /> Public Repos</span>
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mono-sm" style={{ color: 'var(--muted)', padding: '0.5rem 0', fontSize: '0.75rem' }}>
          ⚠ {error}
        </div>
      )}

      {/* ── Graph card ── */}
      <div className="git-graph-card">
        <div className="git-matrix-header">
          <div className="git-matrix-heading">
            <span className="mono-sm text-muted">
              {selected.source === 'github-graphql'
                ? `${selected.totalContributions.toLocaleString()} contributions in the last 12 months`
                : selected.source === 'github-rest-public'
                  ? 'Public event data (add GITHUB_TOKEN for full calendar)'
                  : 'Loading contribution data...'}
            </span>
          </div>

          <div className="git-view-toggle">
            <button
              type="button"
              className={`git-view-btn ${activeView === 'matrix' ? 'is-active' : ''}`}
              onClick={() => setActiveView('matrix')}
            >
              <Activity size={13} /> Activity
            </button>
            <button
              type="button"
              className={`git-view-btn ${activeView === 'commits' ? 'is-active' : ''}`}
              onClick={() => setActiveView('commits')}
            >
              <Terminal size={13} /> Recent Log ({selected.recentCommits?.length ?? 0})
            </button>
          </div>
        </div>

        {activeView === 'matrix' ? (
          <div className="git-heatmap-wrapper">
            <div className="git-months-row mono-sm">
              {monthLabels.map((m) => <span key={m}>{m}</span>)}
            </div>
            <div className="git-grid-scroll">
              <div className="git-day-labels mono-sm">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>
              <div className="git-matrix-grid">
                {isLoading ? (
                  // Skeleton: 52 kolom × 7 baris placeholder
                  Array.from({ length: 52 }).map((_, colIdx) => (
                    <div key={colIdx} className="git-matrix-col">
                      {Array.from({ length: 7 }).map((_, rowIdx) => (
                        <div
                          key={rowIdx}
                          className="git-cell git-level-0"
                          style={{ opacity: 0.4, animation: 'gitSkeletonPulse 1.5s ease-in-out infinite', animationDelay: `${(colIdx * 7 + rowIdx) * 5}ms` }}
                        />
                      ))}
                    </div>
                  ))
                ) : hasMatrix ? (
                  matrix.map((col, colIdx) => (
                    <div key={colIdx} className="git-matrix-col">
                      {col.map((cell, rowIdx) => (
                        <HeatmapCell
                          key={`${colIdx}-${rowIdx}`}
                          cell={cell}
                          onHover={setHoveredCell}
                          onLeave={() => setHoveredCell(null)}
                        />
                      ))}
                    </div>
                  ))
                ) : (
                  <p className="mono-sm" style={{ color: 'var(--muted)', padding: '1rem 0' }}>
                    Activity graph akan tampil setelah statistik GitHub berhasil dimuat.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="git-commits-list">
            {hasCommits ? (
              selected.recentCommits.map((commit) => (
                <div key={`${commit.repo}-${commit.hash}`} className="git-commit-row">
                  <div className="git-commit-prefix mono-sm">
                    <GitBranch size={13} style={{ color: 'var(--muted)' }} />
                    <span className="git-commit-branch">{commit.branch}</span>
                    <span className="git-commit-hash">{commit.hash}</span>
                  </div>
                  <div className="git-commit-body">
                    <p className="git-commit-msg">{commit.msg}</p>
                    <span className="git-commit-repo mono-sm">{commit.repo}</span>
                  </div>
                  <div className="git-commit-time mono-sm">{commit.timeAgo}</div>
                </div>
              ))
            ) : (
              <p className="mono-sm" style={{ color: 'var(--muted)' }}>
                {isLoading ? 'Mengambil commit terbaru...' : 'Belum ada commit publik tersedia.'}
              </p>
            )}
          </div>
        )}

        {/* ── Language bar ── */}
        {hasLanguages && (
          <div className="git-lang-strip">
            <div className="git-lang-bar">
              {selected.languages.map((lang) => (
                <div
                  key={lang.name}
                  className="git-lang-segment"
                  style={{ width: `${lang.pct}%`, backgroundColor: lang.color }}
                  title={`${lang.name}: ${lang.pct}%`}
                />
              ))}
            </div>
            <div className="git-lang-labels">
              {selected.languages.map((lang) => (
                <div key={lang.name} className="git-lang-item mono-sm">
                  <span className="git-lang-dot" style={{ backgroundColor: lang.color }} />
                  <span className="git-lang-name">{lang.name}</span>
                  <span className="git-lang-pct">{lang.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Tooltip ── */}
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
          <span style={{ fontWeight: 600, color: '#fff' }}>
            {hoveredCell.count > 0 ? `${hoveredCell.count} contributions` : 'No contributions'}
          </span>
          <span className="git-tooltip-date">{hoveredCell.dateStr}</span>
        </div>
      )}
    </section>
  );
};
