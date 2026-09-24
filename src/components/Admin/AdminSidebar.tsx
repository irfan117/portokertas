import React from 'react';
import { AdminTab } from './types';
import {
  LayoutDashboard,
  User,
  GitBranch,
  FolderKanban,
  BookOpen,
  Mic2,
  Briefcase,
  FileText,
  Mail,
  Database,
  ArrowLeft,
  CheckCircle2,
  Terminal,
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isMobileNavOpen: boolean;
  onCloseMobile: () => void;
  onNavigateSite: () => void;
  counts: {
    work: number;
    labNotes: number;
    talks: number;
  };
  lastSaved: Date | null;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  isMobileNavOpen,
  onCloseMobile,
  onNavigateSite,
  counts,
  lastSaved,
}) => {
  const handleItemClick = (tab: AdminTab) => {
    onSelectTab(tab);
    onCloseMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside className={`admin-sidebar ${isMobileNavOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <div className="admin-sidebar-header">
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <Terminal size={18} />
          </div>
          <div>
            <div className="admin-brand-title">KENJI · CMS</div>
            <div className="admin-brand-sub mono">Console v2.5</div>
          </div>
        </div>
        <div className="admin-status-pill">
          <span className="admin-status-dot"></span>
          <span>SYSTEM ACTIVE</span>
        </div>
      </div>

      {/* Grouped Sidebar Navigation */}
      <nav className="admin-sidebar-nav">
        {/* GROUP 1: Identity & Telemetry */}
        <div className="admin-nav-group">
          <div className="admin-nav-group-label mono">Identity &amp; Metrics</div>

          <button
            className={`admin-nav-item ${activeTab === 'overview' ? 'is-active' : ''}`}
            onClick={() => handleItemClick('overview')}
          >
            <LayoutDashboard size={16} />
            <span>Overview</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'profile' ? 'is-active' : ''}`}
            onClick={() => handleItemClick('profile')}
          >
            <User size={16} />
            <span>Profile &amp; Hero</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'git' ? 'is-active' : ''}`}
            onClick={() => handleItemClick('git')}
          >
            <GitBranch size={16} />
            <span>GitHub Accounts</span>
            <span className="admin-nav-badge admin-nav-badge--new">NEW</span>
          </button>
        </div>

        {/* GROUP 2: Content & Writing */}
        <div className="admin-nav-group">
          <div className="admin-nav-group-label mono">Content &amp; Editorial</div>

          <button
            className={`admin-nav-item ${activeTab === 'work' ? 'is-active' : ''}`}
            onClick={() => handleItemClick('work')}
          >
            <FolderKanban size={16} />
            <span>Work Projects</span>
            <span className="admin-nav-badge">{counts.work}</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'lab-notes' ? 'is-active' : ''}`}
            onClick={() => handleItemClick('lab-notes')}
          >
            <BookOpen size={16} />
            <span>Lab Notes &amp; Papers</span>
            <span className="admin-nav-badge">{counts.labNotes}</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'talks' ? 'is-active' : ''}`}
            onClick={() => handleItemClick('talks')}
          >
            <Mic2 size={16} />
            <span>Talks &amp; Marquee</span>
            <span className="admin-nav-badge">{counts.talks}</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'experience' ? 'is-active' : ''}`}
            onClick={() => handleItemClick('experience')}
          >
            <Briefcase size={16} />
            <span>Experience &amp; Cases</span>
          </button>
        </div>

        {/* GROUP 3: Settings & System */}
        <div className="admin-nav-group">
          <div className="admin-nav-group-label mono">System &amp; Settings</div>

          <button
            className={`admin-nav-item ${activeTab === 'about' ? 'is-active' : ''}`}
            onClick={() => handleItemClick('about')}
          >
            <FileText size={16} />
            <span>About &amp; Philosophy</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'contact' ? 'is-active' : ''}`}
            onClick={() => handleItemClick('contact')}
          >
            <Mail size={16} />
            <span>Contact &amp; Now Drawer</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'backup' ? 'is-active' : ''}`}
            onClick={() => handleItemClick('backup')}
          >
            <Database size={16} />
            <span>Data &amp; Backup</span>
          </button>
        </div>
      </nav>

      {/* Sidebar Footer with Live Site link and Last Saved Timestamp */}
      <div className="admin-sidebar-footer">
        <button className="admin-back-btn" onClick={onNavigateSite}>
          <ArrowLeft size={14} />
          <span>Back to Live Site</span>
        </button>
        {lastSaved && (
          <div className="admin-footer-status mono">
            <CheckCircle2 size={12} color="var(--accent)" />
            <span>Saved: {lastSaved.toLocaleTimeString()}</span>
          </div>
        )}
      </div>
    </aside>
  );
};
