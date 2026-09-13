import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { GitAccount, GitCommitItem } from '../../../types';
import { DEFAULT_GIT_ACCOUNTS } from '../../Home/GitAccountsBar';
import {
  GitBranch,
  RefreshCw,
  GitCommit,
  GitPullRequest,
  Flame,
  FolderGit2,
  Plus,
  Trash2,
} from 'lucide-react';

interface GitRadarTabProps {
  showToast: (message: string) => void;
}

export const GitRadarTab: React.FC<GitRadarTabProps> = ({ showToast }) => {
  const { data, updateGitAccounts, editGitAccount } = usePortfolio();

  const gitAccounts = useMemo(() => {
    return data.gitAccounts && data.gitAccounts.length > 0
      ? data.gitAccounts
      : DEFAULT_GIT_ACCOUNTS;
  }, [data.gitAccounts]);

  const [selectedGitId, setSelectedGitId] = useState<string>('all');

  const currentGitAccount = useMemo(() => {
    return gitAccounts.find((a) => a.id === selectedGitId) || gitAccounts[0];
  }, [gitAccounts, selectedGitId]);

  // Form states for adding new commit telemetry item
  const [newCommitMsg, setNewCommitMsg] = useState('');
  const [newCommitRepo, setNewCommitRepo] = useState('hyper-consensus');
  const [newCommitTime, setNewCommitTime] = useState('12m ago');
  const [newCommitBranch, setNewCommitBranch] = useState('main');
  const [newCommitHash, setNewCommitHash] = useState('e94f1b8');

  const handleUpdateCurrentAccount = (updates: Partial<GitAccount>) => {
    if (!currentGitAccount) return;
    editGitAccount(currentGitAccount.id, updates);
    showToast(`Updated Git account: ${currentGitAccount.name}`);
  };

  const handleAddCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommitMsg.trim() || !currentGitAccount) return;

    const newCommit: GitCommitItem = {
      hash: newCommitHash || Math.random().toString(16).slice(2, 9),
      repo: newCommitRepo || 'core-engine',
      msg: newCommitMsg.trim(),
      timeAgo: newCommitTime || 'just now',
      branch: newCommitBranch || 'main',
    };

    const nextCommits = [newCommit, ...(currentGitAccount.recentCommits || [])];
    editGitAccount(currentGitAccount.id, {
      recentCommits: nextCommits,
      totalContributions: currentGitAccount.totalContributions + 1,
    });

    setNewCommitMsg('');
    showToast('Commit recorded to Git telemetry feed');
  };

  const handleDeleteCommit = (commitHash: string) => {
    if (!currentGitAccount) return;
    const nextCommits = (currentGitAccount.recentCommits || []).filter((c) => c.hash !== commitHash);
    editGitAccount(currentGitAccount.id, { recentCommits: nextCommits });
    showToast('Commit telemetry removed');
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div className="admin-flex-between" style={{ marginBottom: '1.2rem' }}>
          <div>
            <h2 className="admin-card-title">Git Telemetry Radar &amp; Multi-Account Hub</h2>
            <p className="admin-card-desc">
              Configure multi-account commit telemetry, contribution graphs, streaks, and
              active repositories.
            </p>
          </div>
          <button
            className="admin-action-btn"
            onClick={() => {
              updateGitAccounts(DEFAULT_GIT_ACCOUNTS);
              showToast('Git accounts reset to defaults');
            }}
          >
            <RefreshCw size={12} />
            <span>Reset Radar</span>
          </button>
        </div>

        {/* Account Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.6rem',
            flexWrap: 'wrap',
            padding: '0.5rem',
            background: 'var(--paper-dim)',
            borderRadius: '4px',
            marginBottom: '2rem',
          }}
        >
          {gitAccounts.map((acc) => (
            <button
              key={acc.id}
              className="btn btn--ghost"
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.84rem',
                background: selectedGitId === acc.id ? 'var(--white)' : 'transparent',
                borderColor: selectedGitId === acc.id ? 'var(--ink)' : 'transparent',
                color: selectedGitId === acc.id ? 'var(--ink)' : 'var(--muted)',
                fontWeight: selectedGitId === acc.id ? 600 : 500,
              }}
              onClick={() => setSelectedGitId(acc.id)}
            >
              <span className="mono">{acc.badge}</span>
              <span style={{ marginLeft: '0.4rem' }}>{acc.name}</span>
            </button>
          ))}
        </div>

        {/* Account Details Form */}
        {currentGitAccount && (
          <div>
            <div className="admin-grid-2">
              <div className="admin-field">
                <label>Account Display Name</label>
                <input
                  type="text"
                  value={currentGitAccount.name}
                  onChange={(e) => handleUpdateCurrentAccount({ name: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Handle / Username (with @)</label>
                <input
                  type="text"
                  value={currentGitAccount.handle}
                  onChange={(e) => handleUpdateCurrentAccount({ handle: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-field">
              <label>Git Profile URL</label>
              <input
                type="url"
                value={currentGitAccount.url}
                placeholder="https://github.com/username"
                onChange={(e) => handleUpdateCurrentAccount({ url: e.target.value })}
              />
            </div>

            <div className="admin-grid-3">
              <div className="admin-field">
                <label>Badge Tag</label>
                <input
                  type="text"
                  value={currentGitAccount.badge}
                  onChange={(e) => handleUpdateCurrentAccount({ badge: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Account Role Tagline</label>
                <input
                  type="text"
                  value={currentGitAccount.role}
                  onChange={(e) => handleUpdateCurrentAccount({ role: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Public Repositories</label>
                <input
                  type="number"
                  value={currentGitAccount.reposCount}
                  onChange={(e) =>
                    handleUpdateCurrentAccount({
                      reposCount: parseInt(e.target.value, 10) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="admin-grid-3">
              <div className="admin-field">
                <label>Total Contributions (Yearly)</label>
                <input
                  type="number"
                  value={currentGitAccount.totalContributions}
                  onChange={(e) =>
                    handleUpdateCurrentAccount({
                      totalContributions: parseInt(e.target.value, 10) || 0,
                    })
                  }
                />
              </div>
              <div className="admin-field">
                <label>Active Consecutive Streak (Days)</label>
                <input
                  type="number"
                  value={currentGitAccount.currentStreak}
                  onChange={(e) =>
                    handleUpdateCurrentAccount({
                      currentStreak: parseInt(e.target.value, 10) || 0,
                    })
                  }
                />
              </div>
              <div className="admin-field">
                <label>Pull Requests Merged</label>
                <input
                  type="number"
                  value={currentGitAccount.pullRequests}
                  onChange={(e) =>
                    handleUpdateCurrentAccount({
                      pullRequests: parseInt(e.target.value, 10) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="admin-field">
              <label>Top Primary Focus Stack</label>
              <input
                type="text"
                value={currentGitAccount.languages?.[0]?.name || 'Go'}
                onChange={(e) => {
                  const langs = [...(currentGitAccount.languages || [])];
                  if (langs.length > 0) {
                    langs[0] = { ...langs[0], name: e.target.value };
                  } else {
                    langs.push({ name: e.target.value, pct: 60, color: '#00ADD8' });
                  }
                  handleUpdateCurrentAccount({ languages: langs });
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Record Live Commit Telemetry */}
      {currentGitAccount && (
        <div className="admin-card">
          <h2 className="admin-card-title">+ Record Live Commit to "{currentGitAccount.name}"</h2>
          <form onSubmit={handleAddCommit} className="admin-form">
            <div className="admin-field">
              <label>Commit Message *</label>
              <input
                type="text"
                placeholder="e.g. feat(raft): optimize peer heartbeat intervals for low-latency WAN"
                value={newCommitMsg}
                onChange={(e) => setNewCommitMsg(e.target.value)}
              />
            </div>

            <div className="admin-grid-4">
              <div className="admin-field">
                <label>Repository Name</label>
                <input
                  type="text"
                  placeholder="hyper-consensus"
                  value={newCommitRepo}
                  onChange={(e) => setNewCommitRepo(e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label>Commit Hash</label>
                <input
                  type="text"
                  placeholder="e94f1b8"
                  value={newCommitHash}
                  onChange={(e) => setNewCommitHash(e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label>Branch</label>
                <input
                  type="text"
                  placeholder="main"
                  value={newCommitBranch}
                  onChange={(e) => setNewCommitBranch(e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label>Timestamp</label>
                <input
                  type="text"
                  placeholder="12m ago"
                  value={newCommitTime}
                  onChange={(e) => setNewCommitTime(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn--primary"
              style={{ alignSelf: 'flex-start' }}
              disabled={!newCommitMsg.trim()}
            >
              <Plus size={14} />
              <span>Log Commit to Telemetry</span>
            </button>
          </form>
        </div>
      )}

      {/* Recent Commit History for Selected Account */}
      {currentGitAccount && (
        <div className="admin-card">
          <h2 className="admin-card-title">
            Recorded Telemetry Commits (
            {currentGitAccount.recentCommits ? currentGitAccount.recentCommits.length : 0})
          </h2>
          <div className="admin-items-list">
            {(currentGitAccount.recentCommits || []).map((commit) => (
              <div key={commit.hash} className="admin-item-row compact">
                <div className="admin-item-info">
                  <div className="admin-item-header">
                    <span className="mono" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                      {commit.hash}
                    </span>
                    <span className="admin-tag-pill">{commit.repo}</span>
                    <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                      [{commit.branch}]
                    </span>
                    <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                      {commit.timeAgo}
                    </span>
                  </div>
                  <p className="admin-item-desc" style={{ marginTop: '0.2rem' }}>
                    {commit.msg}
                  </p>
                </div>
                <div className="admin-item-actions">
                  <button
                    className="admin-action-btn danger"
                    onClick={() => handleDeleteCommit(commit.hash)}
                  >
                    <Trash2 size={12} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
