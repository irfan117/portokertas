import React, { useEffect } from 'react';
import { RouteId } from '../../types';
import { useParallax } from '../../hooks/useParallax';
import { usePortfolio } from '../../context/PortfolioContext';
import { ExperienceGallerySection } from './ExperienceGallerySection';
import { HomeLabNotesSection } from './HomeLabNotesSection';
import { GitAccountsBar } from '../Home/GitAccountsBar';

interface HomeViewProps {
  onNavigate: (route: RouteId) => void;
  initialScrollTo?: 'lab-notes';
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, initialScrollTo }) => {
  useParallax();
  const { data } = usePortfolio();
  const { profile } = data;

  useEffect(() => {
    if (initialScrollTo === 'lab-notes') {
      const el = document.getElementById('lab-notes-section');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      }
    }
  }, [initialScrollTo]);

  return (
    <div className="view-content">
      {/* HERO */}
      <div className="hero wrap">
        <p className="hero__eyebrow mono">{profile.role} · {profile.location}</p>
        <h1 className="hero__title">{profile.heroTitle}</h1>
        <p className="hero__lead">{profile.heroLead}</p>
        <div className="hero__actions">
          <a
            href="#work"
            className="btn btn--primary"
            data-route="work"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('work');
            }}
          >
            See selected work
          </a>
          <a
            href="#contact"
            className="btn btn--ghost"
            data-route="contact"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('contact');
            }}
          >
            Get in touch
          </a>
        </div>
        <div className="hero__meta">
          {profile.heroMeta.map((meta, idx) => (
            <div key={idx}>
              <p>{meta.label}</p>
              <p>{meta.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MULTI-ACCOUNT GIT BAR SECTION */}
      <GitAccountsBar />

      {/* SPLIT PARALLAX (REVERSED) */}
      <div className="split-parallax split-parallax--reverse">
        <div className="split-content">
          <h3>{profile.splitParallax.title}</h3>
          <p>{profile.splitParallax.desc}</p>
          <p style={{ marginTop: '1rem' }}>
            <a
              href="#work"
              className="btn btn--ghost"
              data-route="work"
              style={{ borderColor: 'rgba(252,252,250,0.3)', color: 'var(--white)' }}
              onClick={(e) => {
                e.preventDefault();
                onNavigate('work');
              }}
            >
              See the rest of the work →
            </a>
          </p>
        </div>
        <div className="split-media">
          <img
            data-parallax=""
            src={profile.splitParallax.img}
            alt="Work and engineering in progress"
          />
        </div>
      </div>

      {/* QUOTE SECTION WITH PARALLAX DEPTH (SEAMLESS TRANSITION, NO GAPS) */}
      <div
        className="quote-bg"
        data-parallax=""
        data-parallax-speed="0.08"
        data-parallax-dir="bg"
        style={{
          backgroundImage: `url('${profile.homeQuote.bgImage}')`,
        }}
      >
        <div className="quote-overlay">
          <blockquote
            data-parallax=""
            data-parallax-speed="-0.04"
          >
            "{profile.homeQuote.text}"
            <cite>{profile.homeQuote.cite}</cite>
          </blockquote>
        </div>
      </div>

      {/* EXPERIENCE FIELD DOCUMENTATION & GALLERY (ELEMENTOR MASONRY AUTO-LOOP) */}
      <ExperienceGallerySection onNavigate={onNavigate} />

      {/* LAB NOTES & FIELD DISPATCHES SECTION ON HOME */}
      <HomeLabNotesSection onNavigate={onNavigate} />

      {/* HOME CTA */}
      <div className="wrap home-cta">
        <h3>Want the longer version, with real numbers?</h3>
        <div className="btn-row">
          <a
            href="#experience"
            className="btn btn--ghost"
            data-route="experience"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('experience');
            }}
          >
            View experience
          </a>
          <a
            href="#contact"
            className="btn btn--primary"
            data-route="contact"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('contact');
            }}
          >
            Say hello
          </a>
        </div>
      </div>
    </div>
  );
};

