import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const ContactView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const { data } = usePortfolio();
  const { contact } = data;
  const email = contact.email;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(email);
      } else {
        const input = document.createElement('input');
        input.value = email;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <div className="view-content">
      <div className="wrap contact">
        <h2>{contact.heading}</h2>
        <div style={{ marginTop: '2.5rem' }}>
          <div className="contact__email">
            <a href={`mailto:${email}`}>{email}</a>
            <button
              className="copy-btn"
              id="copyEmail"
              aria-label="Copy email address"
              onClick={handleCopy}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="socials">
          {contact.github && (
            <a href={contact.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          )}
          {contact.linkedin && (
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          )}
          {contact.xTwitter && (
            <a href={contact.xTwitter} target="_blank" rel="noopener noreferrer">
              X / Twitter
            </a>
          )}
        </div>

        {contact.pgpNote && (
          <p style={{ marginTop: '3rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
            {contact.pgpNote}
          </p>
        )}
      </div>
    </div>
  );
};

