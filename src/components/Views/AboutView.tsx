import React from 'react';
import { useParallax } from '../../hooks/useParallax';
import { usePortfolio } from '../../context/PortfolioContext';

export const AboutView: React.FC = () => {
  useParallax();
  const { data } = usePortfolio();
  const { profile } = data;

  return (
    <div className="view-content">
      <div className="wrap section-head">
        <h2>About</h2>
      </div>

      <div className="wrap about-grid">
        <div className="about-bio">
          {profile.aboutBio.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}

          <div className="skills">
            <h4
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.78rem',
                color: 'var(--muted)',
                fontWeight: 400,
                marginBottom: '0.9rem',
              }}
            >
              {profile.toolsHeading}
            </h4>
            <p style={{ fontSize: '1.02rem', lineHeight: 1.75, maxWidth: '56ch' }}>
              {profile.toolsText1}
            </p>
            {profile.toolsText2 && (
              <p
                style={{
                  marginTop: '1.1rem',
                  fontSize: '1.02rem',
                  lineHeight: 1.75,
                  maxWidth: '56ch',
                }}
              >
                {profile.toolsText2}
              </p>
            )}
          </div>
        </div>

        <div className="about-portrait">
          <img
            src={profile.portraitImg}
            alt={`${profile.name} working thoughtfully`}
          />
        </div>
      </div>

      {/* QUOTE SECTION */}
      <div
        className="quote-bg"
        style={{
          backgroundImage: `url('${profile.aboutQuote.bgImage}')`,
        }}
      >
        <div className="quote-overlay">
          <blockquote>
            "{profile.aboutQuote.text}"
            <cite>{profile.aboutQuote.cite}</cite>
          </blockquote>
        </div>
      </div>

      {/* SPLIT PARALLAX */}
      <div className="split-parallax">
        <div className="split-media">
          <img
            data-parallax=""
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80"
            alt="Minimal desk setup with laptop and coffee"
          />
        </div>
        <div className="split-content">
          <h3>{profile.approachHeading}</h3>
          <p>{profile.approachLead}</p>
          <ol>
            {profile.approachSteps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

