import React, { useMemo } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { AdminTab } from '../types';
import { DEFAULT_GIT_ACCOUNTS } from '../../Home/GitAccountsBar';
import {
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  GitBranch,
  Mic2,
  Database,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface OverviewTabProps {
  onNavigateTab: (tab: AdminTab) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigateTab }) => {
  const { data } = usePortfolio();

  const gitAccounts = useMemo(() => {
    return data.gitAccounts && data.gitAccounts.length > 0
      ? data.gitAccounts
      : DEFAULT_GIT_ACCOUNTS;
  }, [data.gitAccounts]);

  const totalCommits = useMemo(() => {
    return gitAccounts.find((a) => a.id === 'all')?.totalContributions || 5012;
  }, [gitAccounts]);

  return (
    <div className="admin-section">
      {/* Overview Header */}
      <div className="admin-header" style={{ marginBottom: 0 }}>
        <div>
          <div className="admin-badge mono">Executive Summary</div>
          <h1 className="admin-title">System Overview &amp; Telemetry</h1>
          <p className="admin-sub">
            Real-time telemetry, portfolio content volume, and quick management shortcuts.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="admin-overview-kpis">
        <div className="admin-kpi-card" onClick={() => onNavigateTab('work')} style={{ cursor: 'pointer' }}>
          <div className="admin-kpi-card__top">
            <span className="mono">FEATURED WORK</span>
            <FolderKanban size={16} />
          </div>
          <div className="admin-kpi-card__num">{data.workProjects.length}</div>
          <div className="admin-kpi-card__label">Engineering Projects</div>
        </div>

        <div className="admin-kpi-card" onClick={() => onNavigateTab('lab-notes')} style={{ cursor: 'pointer' }}>
          <div className="admin-kpi-card__top">
            <span className="mono">LAB NOTES</span>
            <BookOpen size={16} />
          </div>
          <div className="admin-kpi-card__num">{data.labNotes.length}</div>
          <div className="admin-kpi-card__label">Technical Whitepapers</div>
        </div>

        <div className="admin-kpi-card" onClick={() => onNavigateTab('git')} style={{ cursor: 'pointer' }}>
          <div className="admin-kpi-card__top">
            <span className="mono">GIT TELEMETRY</span>
            <GitBranch size={16} />
          </div>
          <div className="admin-kpi-card__num">{totalCommits.toLocaleString()}</div>
          <div className="admin-kpi-card__label">Commits Across Accounts</div>
        </div>

        <div className="admin-kpi-card" onClick={() => onNavigateTab('talks')} style={{ cursor: 'pointer' }}>
          <div className="admin-kpi-card__top">
            <span className="mono">TALKS &amp; ESSAYS</span>
            <Mic2 size={16} />
          </div>
          <div className="admin-kpi-card__num">{data.talksWriting.length}</div>
          <div className="admin-kpi-card__label">Marquee Items</div>
        </div>
      </div>

      {/* Quick Jump Shortcuts */}
      <div className="admin-card">
        <h2 className="admin-card-title">Quick Actions &amp; Navigation Shortcuts</h2>
        <p className="admin-card-desc">
          Click any card below to jump directly to the respective configuration console.
        </p>

        <div className="admin-quick-actions-grid">
          <div
            className="admin-quick-action-card"
            onClick={() => onNavigateTab('git')}
          >
            <div className="admin-qa-icon">
              <GitBranch size={18} />
            </div>
            <div>
              <div className="admin-qa-title">Git Telemetry Radar</div>
              <div className="admin-qa-desc">
                Configure multi-account commit activity, streaks, and repository telemetry.
              </div>
            </div>
          </div>

          <div
            className="admin-quick-action-card"
            onClick={() => onNavigateTab('work')}
          >
            <div className="admin-qa-icon">
              <FolderKanban size={18} />
            </div>
            <div>
              <div className="admin-qa-title">Manage Work Projects</div>
              <div className="admin-qa-desc">
                Add or modify featured engineering cards, screenshots, tags, and live demo links.
              </div>
            </div>
          </div>

          <div
            className="admin-quick-action-card"
            onClick={() => onNavigateTab('lab-notes')}
          >
            <div className="admin-qa-icon">
              <BookOpen size={18} />
            </div>
            <div>
              <div className="admin-qa-title">Publish Lab Note</div>
              <div className="admin-qa-desc">
                Write in-depth engineering breakdowns with code snippets and architecture diagrams.
              </div>
            </div>
          </div>

          <div
            className="admin-quick-action-card"
            onClick={() => onNavigateTab('backup')}
          >
            <div className="admin-qa-icon">
              <Database size={18} />
            </div>
            <div>
              <div className="admin-qa-title">Backup &amp; Export JSON</div>
              <div className="admin-qa-desc">
                Download your customized portfolio configuration as an offline JSON snapshot.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
