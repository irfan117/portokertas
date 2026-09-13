import React from 'react';
import { RouteId } from '../types';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface FooterProps {
  onNavigate?: (route: RouteId) => void;
}

interface QuickLinkItem {
  name: string;
  route: RouteId;
  hash: string;
}

const QUICK_LINKS: QuickLinkItem[] = [
  { name: 'Home', route: 'home', hash: '#home' },
  { name: 'About Me', route: 'about', hash: '#about' },
  { name: 'Works', route: 'work', hash: '#work' },
  { name: 'Experience', route: 'experience', hash: '#experience' },
  { name: 'Lab Notes', route: 'lab-notes', hash: '#lab-notes' },
  { name: 'Contact', route: 'contact', hash: '#contact' },
];

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();
  const { data } = usePortfolio();
  const { profile, contact } = data;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, route: RouteId, hash: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.hash = hash;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer
      className="framer-soKIl framer-R6rCf framer-OkZLF framer-N1dSz framer-ZHE11 framer-788ly6 framer-v-788ly6 framer-desktop-footer"
      data-framer-name="Desktop"
      style={{
        backgroundColor: 'var(--token-e44374f3-0aa3-4326-a0ec-25df52a31057, rgb(17, 17, 17))',
        width: '100%',
        opacity: 1,
      }}
    >
      <div className="framer-1got5e6 framer-footer-container" data-framer-name="Container" style={{ opacity: 1 }}>
        <div className="framer-footer-top">
          {/* Main Headline */}
          <div
            className="framer-1umwttr framer-footer-headline-wrap"
            data-framer-component-type="RichTextContainer"
          >
            <h2 className="framer-text framer-footer-headline" dir="auto">
              <span>Scaling Systems</span>
              <br className="framer-text" />
              <span>for Resilient Growth.</span>
            </h2>
            <p className="framer-footer-subtext">
              Engineering high-throughput engines, distributed backends, and fault-tolerant architecture built to survive real traffic.
            </p>
          </div>

          {/* Columns */}
          <div className="framer-19u2gmr framer-footer-columns" data-framer-name="Columns" style={{ opacity: 1 }}>
            {/* Quick links column */}
            <div className="framer-kularx" data-framer-name="Quick Links" style={{ opacity: 1 }}>
              <h4 className="framer-footer-col-title" dir="auto">
                /Quick links
              </h4>
              <div className="framer-1b8b481 framer-footer-links-grid" data-framer-name="Links" style={{ opacity: 1 }}>
                {QUICK_LINKS.map((link) => (
                  <a
                    key={link.route}
                    className="framer-W6IRo framer-17htvoe framer-v-17htvoe framer-1x4c6pk framer-pill-link"
                    data-framer-name="Primary"
                    href={link.hash}
                    tabIndex={0}
                    onClick={(e) => handleLinkClick(e, link.route, link.hash)}
                    title={`Navigate to ${link.name}`}
                  >
                    <span className="rolling-text-box">
                      <span className="rolling-text-track">
                        <span className="rolling-text-item">{link.name}</span>
                        <span className="rolling-text-item" aria-hidden="true">{link.name}</span>
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact column */}
            <div className="framer-1ac7wjl" data-framer-name="Contact" style={{ opacity: 1 }}>
              <h4 className="framer-footer-col-title" dir="auto">
                /Contact
              </h4>
              <div className="framer-dd8dt3 framer-footer-contact-details" data-framer-name="Links" style={{ opacity: 1 }}>
                <div>
                  <a
                    className="framer-footer-email-link"
                    href={`mailto:${contact.email || 'm.irfan1q1@gmail.com'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{contact.email || 'm.irfan1q1@gmail.com'}</span>
                    <ArrowUpRight size={15} />
                  </a>
                </div>

                <div className="framer-footer-meta-item mono">
                  <span>Bandung, ID · UTC+7</span>
                </div>

                <div className="framer-footer-meta-item">
                  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#4ade80', marginRight: 4 }}></span>
                  <span style={{ fontSize: '0.82rem' }}>Available for Backend &amp; AI Projects</span>
                </div>

                <div className="framer-footer-socials">
                  {contact.github && (
                    <a href={contact.github} target="_blank" rel="noopener noreferrer">
                      GitHub ↗
                    </a>
                  )}
                  {contact.linkedin && (
                    <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                      LinkedIn ↗
                    </a>
                  )}
                  {contact.xTwitter && (
                    <a href={contact.xTwitter} target="_blank" rel="noopener noreferrer">
                      X / Twitter ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar with Copyright */}
        <div className="framer-footer-bottom-bar">
          <p>
            &copy; {currentYear} {profile.name}
          </p>
          <p className="mono">Built with TypeScript, React &amp; Tailwind</p>
        </div>
      </div>

      {/* Giant Framer Watermark Typography: "ORB" (with ambient glow & scroll reveal animation) */}
      <motion.div
        className="framer-footer-watermark-wrap"
        aria-hidden="true"
        initial={{ opacity: 0, y: 75, scale: 0.94 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{
          duration: 1.1,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div className="framer-footer-ambient-orb" />
        <svg
          className="framer-3vb2n7 framer-footer-watermark-svg"
          data-framer-component-type="RichTextContainer"
          viewBox="0 0 1200 270"
          preserveAspectRatio="xMidYMax slice"
          style={{
            willChange: 'transform, opacity',
          }}
        >
          <text
            x="50%"
            y="296"
            textAnchor="middle"
            className="framer-footer-watermark-text"
          >
            ORB
          </text>
        </svg>
      </motion.div>
    </footer>
  );
};
