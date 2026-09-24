import React from 'react';
import { AdminTab } from './types';
import { Menu, X, ExternalLink } from 'lucide-react';

interface AdminTopbarProps {
  activeTab: AdminTab;
  isMobileNavOpen: boolean;
  onToggleMobileNav: () => void;
  onNavigateSite: () => void;
}

const TAB_TITLES: Record<AdminTab, string> = {
  overview: 'Dashboard Overview',
  profile: 'Profile & Hero Headline',
  git: 'GitHub Accounts',
  work: 'Work Projects Management',
  'lab-notes': 'Lab Notes & Whitepapers',
  talks: 'Talks & Writing Marquee',
  experience: 'Career Timeline & Case Studies',
  about: 'About & Philosophy',
  contact: 'Contact & Now Drawer',
  backup: 'Data Backup & Reset',
};

export const AdminTopbar: React.FC<AdminTopbarProps> = ({
  activeTab,
  isMobileNavOpen,
  onToggleMobileNav,
  onNavigateSite,
}) => {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button
          className="admin-mobile-toggle"
          onClick={onToggleMobileNav}
          aria-label="Toggle navigation menu"
        >
          {isMobileNavOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <div className="admin-breadcrumb mono">
          <span>Admin Console</span>
          <span>/</span>
          <span className="admin-breadcrumb-active">{TAB_TITLES[activeTab]}</span>
        </div>
      </div>

      <div className="admin-topbar-actions">
        <button className="admin-site-link" onClick={onNavigateSite}>
          <span>View Site</span>
          <ExternalLink size={12} />
        </button>
      </div>
    </header>
  );
};
