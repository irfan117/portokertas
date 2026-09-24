import React, { useMemo, useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { GitAccount } from '../../../types';
import { DEFAULT_GIT_ACCOUNTS } from '../../Home/GitAccountsBar';
import { Github, RefreshCw, Save } from 'lucide-react';

interface GitRadarTabProps {
  showToast: (message: string) => void;
}

function usernameFromText(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  const urlMatch = trimmed.match(/github\.com\/([^/?#]+)/i)?.[1];
  return (urlMatch || trimmed).replace('@', '').trim();
}

function accountFromUsername(username: string, index: number): GitAccount {
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
    seed: username.length * 13,
    languages: [],
    recentCommits: [],
  };
}

export const GitRadarTab: React.FC<GitRadarTabProps> = ({ showToast }) => {
  const { data, updateGitAccounts } = usePortfolio();
  const gitAccounts = useMemo(
    () => (data.gitAccounts && data.gitAccounts.length > 0 ? data.gitAccounts : DEFAULT_GIT_ACCOUNTS),
    [data.gitAccounts],
  );

  const accountUsernames = useMemo(
    () =>
      gitAccounts
        .filter((account) => account.id !== 'all')
        .map((account) => usernameFromText(account.handle || account.url || account.id))
        .filter(Boolean),
    [gitAccounts],
  );

  const [accountsInput, setAccountsInput] = useState(accountUsernames.join('\n'));

  const saveAccounts = () => {
    const usernames = Array.from(
      new Set(
        accountsInput
          .split(/\n|,/)
          .map(usernameFromText)
          .filter(Boolean)
          .map((username) => username.replace(/[^A-Za-z0-9-]/g, '')),
      ),
    );

    if (usernames.length === 0) {
      alert('Masukkan minimal satu username GitHub.');
      return;
    }

    updateGitAccounts(usernames.map(accountFromUsername));
    showToast('Daftar akun GitHub disimpan. Statistik publik akan diambil otomatis.');
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div className="admin-flex-between" style={{ marginBottom: '1.2rem' }}>
          <div>
            <h2 className="admin-card-title">GitHub Accounts</h2>
            <p className="admin-card-desc">
              Masukkan username GitHub asli. Statistik, repo, bahasa, dan commit terbaru akan diambil otomatis dari GitHub.
            </p>
          </div>
          <button
            className="admin-action-btn"
            onClick={() => {
              updateGitAccounts(DEFAULT_GIT_ACCOUNTS.filter((account) => account.id !== 'all'));
              setAccountsInput(
                DEFAULT_GIT_ACCOUNTS.filter((account) => account.id !== 'all')
                  .map((account) => usernameFromText(account.handle || account.url || account.id))
                  .join('\n'),
              );
              showToast('Daftar akun GitHub dikembalikan ke default');
            }}
          >
            <RefreshCw size={12} />
            <span>Reset</span>
          </button>
        </div>

        <div className="admin-field">
          <label>GitHub usernames / URLs</label>
          <textarea
            rows={8}
            value={accountsInput}
            placeholder={'irfan117\nfegeirfan\nhttps://github.com/mirfan1q1-lgtm'}
            onChange={(e) => setAccountsInput(e.target.value)}
          />
        </div>

        <button type="button" className="btn btn--primary" onClick={saveAccounts}>
          <Save size={14} />
          <span>Save GitHub Accounts</span>
        </button>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">Connected Accounts ({accountUsernames.length})</h2>
        <div className="admin-items-list">
          {accountUsernames.map((username) => (
            <div key={username} className="admin-item-row compact">
              <div className="admin-item-info">
                <div className="admin-item-header">
                  <Github size={16} />
                  <h4>@{username}</h4>
                  <span className="admin-tag-pill">Live GitHub</span>
                </div>
                <p className="admin-item-desc">https://github.com/{username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
