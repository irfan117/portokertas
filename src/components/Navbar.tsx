import React, { useState } from 'react';
import { RouteId } from '../types';
import { usePortfolio } from '../context/PortfolioContext';

interface NavbarProps {
  currentRoute: RouteId;
  onNavigate: (route: RouteId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data } = usePortfolio();
  const { profile } = data;

  // Map sub-routes like exp-1..exp-4 to 'experience', and note-* or lab-notes to 'home'
  const activeTopRoute = currentRoute.startsWith('exp-')
    ? 'experience'
    : currentRoute.startsWith('project:')
    ? 'work'
    : currentRoute.startsWith('note-') || currentRoute.startsWith('lab-note-') || currentRoute === 'lab-notes'
    ? 'home'
    : currentRoute;

  const handleLinkClick = (e: React.MouseEvent, route: RouteId) => {
    e.preventDefault();
    setMenuOpen(false);
    document.body.classList.remove('menu-open');
    onNavigate(route);
  };

  const toggleMenu = () => {
    const nextState = !menuOpen;
    setMenuOpen(nextState);
    if (nextState) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  };

  return (
    <>
      <header className="nav">
        <div className="nav__inner">
          <a
            href="#home"
            className="nav__logo"
            data-route="home"
            onClick={(e) => handleLinkClick(e, 'home')}
          >
            {profile.name}
          </a>
          <nav className="nav__links" aria-label="Primary">
            <a
              href="#home"
              className="nav__link"
              data-route="home"
              aria-current={activeTopRoute === 'home' ? 'page' : undefined}
              onClick={(e) => handleLinkClick(e, 'home')}
            >
              Home
            </a>
            <a
              href="#work"
              className="nav__link"
              data-route="work"
              aria-current={activeTopRoute === 'work' ? 'page' : undefined}
              onClick={(e) => handleLinkClick(e, 'work')}
            >
              Work
            </a>
            <a
              href="#about"
              className="nav__link"
              data-route="about"
              aria-current={activeTopRoute === 'about' ? 'page' : undefined}
              onClick={(e) => handleLinkClick(e, 'about')}
            >
              About
            </a>
            <a
              href="#experience"
              className="nav__link"
              data-route="experience"
              aria-current={activeTopRoute === 'experience' ? 'page' : undefined}
              onClick={(e) => handleLinkClick(e, 'experience')}
            >
              Experience
            </a>
            <a
              href="#contact"
              className="nav__link"
              data-route="contact"
              aria-current={activeTopRoute === 'contact' ? 'page' : undefined}
              onClick={(e) => handleLinkClick(e, 'contact')}
            >
              Contact
            </a>
          </nav>
          <button
            className="nav__toggle"
            id="navToggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <div className="mobile-menu" id="mobileMenu">
        <a href="#home" data-route="home" onClick={(e) => handleLinkClick(e, 'home')}>
          Home
        </a>
        <a href="#work" data-route="work" onClick={(e) => handleLinkClick(e, 'work')}>
          Work
        </a>
        <a href="#about" data-route="about" onClick={(e) => handleLinkClick(e, 'about')}>
          About
        </a>
        <a href="#experience" data-route="experience" onClick={(e) => handleLinkClick(e, 'experience')}>
          Experience
        </a>
        <a href="#contact" data-route="contact" onClick={(e) => handleLinkClick(e, 'contact')}>
          Contact
        </a>
      </div>
    </>
  );
};
