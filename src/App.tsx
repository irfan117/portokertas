import React, { useState, useEffect } from 'react';
import { RouteId } from './types';
import { PortfolioProvider } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { SocialPanel } from './components/SocialPanel';
import { Footer } from './components/Footer';
import { HomeView } from './components/Views/HomeView';
import { WorkView } from './components/Views/WorkView';
import { ProjectDetailView } from './components/Views/ProjectDetailView';
import { AboutView } from './components/Views/AboutView';
import { ExperienceView } from './components/Views/ExperienceView';
import { CaseStudyView } from './components/Views/CaseStudyView';
import { ContactView } from './components/Views/ContactView';
import { LabNoteDetailView } from './components/Views/LabNoteDetailView';
import { AdminPanel } from './components/Admin/AdminPanel';
import { AdminLogin } from './components/Admin/AdminLogin';
import { getApiBase } from './lib/apiBase';

const VALID_ROUTES: RouteId[] = [
  'home',
  'work',
  'lab-notes',
  'about',
  'experience',
  'contact',
  'admin',
  'exp-1',
  'exp-2',
  'exp-3',
  'exp-4',
];

function getValidRouteFromHash(): RouteId {
  const hash = (window.location.hash || '').replace('#', '').trim();
  if (VALID_ROUTES.includes(hash)) return hash;
  if (hash.startsWith('note-') || hash.startsWith('lab-note-')) {
    return hash;
  }
  if (hash.startsWith('project:')) {
    return hash;
  }
  return 'home';
}

function MainContent() {
  const [currentRoute, setCurrentRoute] = useState<RouteId>(getValidRouteFromHash);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    fetch(`${getApiBase()}/auth/me`, { credentials: 'include' })
      .then((response) => setAdminAuthenticated(response.ok))
      .catch(() => setAdminAuthenticated(false))
      .finally(() => setAuthChecked(true));
  }, []);

  useEffect(() => {
    const handleAdminShortcut = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        navigateTo('admin');
      }
    };

    window.addEventListener('keydown', handleAdminShortcut);
    return () => window.removeEventListener('keydown', handleAdminShortcut);
  });

  const navigateTo = (route: RouteId) => {
    setCurrentRoute(route);
    if (window.location.hash.replace('#', '') !== route) {
      window.location.hash = route;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const nextRoute = getValidRouteFromHash();
      setCurrentRoute(nextRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentRoute === 'admin') {
    if (!authChecked) return <div className="admin-app-root" style={{ padding: '3rem' }}>Memeriksa sesi admin...</div>;
    if (!adminAuthenticated) return <AdminLogin onAuthenticated={() => setAdminAuthenticated(true)} />;
    return (
      <div className="admin-app-root">
        <AdminPanel onNavigate={navigateTo} />
      </div>
    );
  }

  return (
    <>
      <Navbar currentRoute={currentRoute} onNavigate={navigateTo} />

      <main id="main">
        {(currentRoute === 'home' || currentRoute === 'lab-notes') && (
          <section className="view active page-enter" id="view-home">
            <HomeView
              onNavigate={navigateTo}
              initialScrollTo={currentRoute === 'lab-notes' ? 'lab-notes' : undefined}
            />
          </section>
        )}

        {currentRoute === 'work' && (
          <section className="view active page-enter" id="view-work">
            <WorkView onNavigate={navigateTo} />
          </section>
        )}

        {currentRoute.startsWith('project:') && (
          <section className="view active page-enter" id="view-project-detail">
            <ProjectDetailView projectRouteId={currentRoute} onNavigate={navigateTo} />
          </section>
        )}

        {(currentRoute.startsWith('note-') || currentRoute.startsWith('lab-note-')) && (
          <section className="view active page-enter" id="view-lab-note-detail">
            <LabNoteDetailView noteRouteId={currentRoute} onNavigate={navigateTo} />
          </section>
        )}

        {currentRoute === 'about' && (
          <section className="view active page-enter" id="view-about">
            <AboutView />
          </section>
        )}

        {currentRoute === 'experience' && (
          <section className="view active page-enter" id="view-experience">
            <ExperienceView onNavigate={navigateTo} />
          </section>
        )}

        {(currentRoute === 'exp-1' ||
          currentRoute === 'exp-2' ||
          currentRoute === 'exp-3' ||
          currentRoute === 'exp-4') && (
          <section className="view active page-enter" id={`view-${currentRoute}`}>
            <CaseStudyView routeId={currentRoute} onNavigate={navigateTo} />
          </section>
        )}

        {currentRoute === 'contact' && (
          <section className="view active page-enter" id="view-contact">
            <ContactView />
          </section>
        )}
      </main>

      <Footer onNavigate={navigateTo} />
      <SocialPanel />
    </>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <MainContent />
    </PortfolioProvider>
  );
}
