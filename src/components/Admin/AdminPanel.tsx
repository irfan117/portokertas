import React, { useState } from 'react';
import { RouteId } from '../../types';
import { usePortfolio } from '../../context/PortfolioContext';
import { AdminTab } from './types';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';

// Modular Tabs
import { OverviewTab } from './tabs/OverviewTab';
import { ProfileHeroTab } from './tabs/ProfileHeroTab';
import { GitRadarTab } from './tabs/GitRadarTab';
import { WorkProjectsTab } from './tabs/WorkProjectsTab';
import { LabNotesTab } from './tabs/LabNotesTab';
import { TalksWritingTab } from './tabs/TalksWritingTab';
import { ExperienceTab } from './tabs/ExperienceTab';
import { AboutTab } from './tabs/AboutTab';
import { ContactTab } from './tabs/ContactTab';
import { BackupTab } from './tabs/BackupTab';

interface AdminPanelProps {
  onNavigate: (route: RouteId) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigate }) => {
  const { data, lastSaved } = usePortfolio();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleNavSelect = (tab: AdminTab) => {
    setActiveTab(tab);
    setIsMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="admin-layout">
      {/* Mobile Backdrop */}
      {isMobileNavOpen && (
        <div
          className="admin-backdrop"
          onClick={() => setIsMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Floating Save/Action Toast */}
      {toastMessage && (
        <div className="admin-toast">
          <span>✓ {toastMessage}</span>
        </div>
      )}

      {/* Modular Fixed Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={handleNavSelect}
        isMobileNavOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
        onNavigateSite={() => onNavigate('home')}
        counts={{
          work: data.workProjects.length,
          labNotes: data.labNotes.length,
          talks: data.talksWriting.length,
        }}
        lastSaved={lastSaved}
      />

      {/* Main Viewport & Content Canvas */}
      <div className="admin-main-viewport">
        {/* Topbar Header */}
        <AdminTopbar
          activeTab={activeTab}
          isMobileNavOpen={isMobileNavOpen}
          onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
          onNavigateSite={() => onNavigate('home')}
        />

        {/* Scrollable Tab Canvas */}
        <main className="admin-main-scroll">
          {activeTab === 'overview' && (
            <OverviewTab onNavigateTab={handleNavSelect} />
          )}

          {activeTab === 'profile' && (
            <ProfileHeroTab showToast={showToast} />
          )}

          {activeTab === 'git' && (
            <GitRadarTab showToast={showToast} />
          )}

          {activeTab === 'work' && (
            <WorkProjectsTab showToast={showToast} />
          )}

          {activeTab === 'lab-notes' && (
            <LabNotesTab
              showToast={showToast}
              onNavigateSite={onNavigate}
            />
          )}

          {activeTab === 'talks' && (
            <TalksWritingTab showToast={showToast} />
          )}

          {activeTab === 'experience' && (
            <ExperienceTab showToast={showToast} />
          )}

          {activeTab === 'about' && (
            <AboutTab showToast={showToast} />
          )}

          {activeTab === 'contact' && (
            <ContactTab showToast={showToast} />
          )}

          {activeTab === 'backup' && (
            <BackupTab showToast={showToast} />
          )}
        </main>
      </div>
    </div>
  );
};
