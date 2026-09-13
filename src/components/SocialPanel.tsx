import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const SocialPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = usePortfolio();
  const { contact, nowItems } = data;

  const togglePanel = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      document.body.classList.add('social-open');
    } else {
      document.body.classList.remove('social-open');
    }
  };

  const closePanel = () => {
    setIsOpen(false);
    document.body.classList.remove('social-open');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePanel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        className="social-toggle"
        id="socialToggle"
        aria-label="Open social links and contact"
        aria-expanded={isOpen}
        aria-controls="socialPanel"
        onClick={togglePanel}
      >
        <span className="social-toggle__icon">
          <span></span>
          <span></span>
        </span>
      </button>

      <div
        className="social-overlay"
        id="socialOverlay"
        onClick={closePanel}
      />

      <aside
        className="social-panel"
        id="socialPanel"
        aria-hidden={!isOpen}
      >
        <div className="social-panel__grid">
          <div>
            <p className="social-panel__label">Social</p>
            <ul className="social-panel__social">
              {contact.github && (
                <li>
                  <a href={contact.github} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </li>
              )}
              {contact.linkedin && (
                <li>
                  <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </li>
              )}
              {contact.xTwitter && (
                <li>
                  <a href={contact.xTwitter} target="_blank" rel="noopener noreferrer">
                    X / Twitter
                  </a>
                </li>
              )}
            </ul>
          </div>
          <div>
            <p className="social-panel__label">Now</p>
            <ul className="social-panel__now">
              {nowItems.map((item, idx) => (
                <li key={idx}>
                  <span className="k">{item.k}</span>
                  <span className="v">{item.v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="social-panel__contact">
          <p className="social-panel__label">Get in touch</p>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>
      </aside>
    </>
  );
};

