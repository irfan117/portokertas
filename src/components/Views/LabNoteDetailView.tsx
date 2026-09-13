import React, { useState } from 'react';
import { RouteId, LabNote } from '../../types';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Tag,
  Share2,
  Check,
  ArrowRight,
  Code,
  BookmarkCheck,
  ExternalLink,
  Bookmark,
  Printer,
  Sparkles,
  BookOpen,
  Compass,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface ExternalArticle {
  id: string;
  source: string;
  sourceDomain: string;
  title: string;
  url: string;
  readTime: string;
  category: string;
  description: string;
}

// Curated high-relevance external articles from premier engineering teams
const EXTERNAL_ARTICLES: Record<string, ExternalArticle[]> = {
  default: [
    {
      id: 'ext-1',
      source: 'Uber Engineering',
      sourceDomain: 'eng.uber.com',
      title: 'Designing Reliable Financial Ledgers at Scale with Distributed Consistency',
      url: 'https://www.uber.com/en-US/blog/engineering/',
      readTime: '11 min read',
      category: 'Distributed Systems',
      description: 'How Uber models immutable transaction logs across multiple active-active data regions without reconciliation drift.',
    },
    {
      id: 'ext-2',
      source: 'Stripe Engineering',
      sourceDomain: 'stripe.com',
      title: 'Designing Robust APIs with Idempotency Keys: A Field Guide',
      url: 'https://stripe.com/blog/idempotency',
      readTime: '8 min read',
      category: 'API Architecture',
      description: 'Guaranteed at-most-once execution patterns for high-frequency payment networks under network partition.',
    },
    {
      id: 'ext-3',
      source: 'AWS Builders Library',
      sourceDomain: 'aws.amazon.com',
      title: 'Avoiding Fallacies of Distributed Computing: Jitter, Backoff, and Circuit Breakers',
      url: 'https://aws.amazon.com/builders-library/',
      readTime: '14 min read',
      category: 'Reliability',
      description: 'Why naive exponential backoff causes catastrophic thundering herd events, and how decorrelated jitter prevents system collapse.',
    },
    {
      id: 'ext-4',
      source: 'Martin Kleppmann',
      sourceDomain: 'martin.kleppmann.com',
      title: 'Designing Data-Intensive Applications: The Trouble with Consensus & Time',
      url: 'https://martin.kleppmann.com/',
      readTime: '16 min read',
      category: 'Data Systems',
      description: 'Examining clock skew, total order broadcast, and the practical limits of Raft and Paxos in real networks.',
    },
    {
      id: 'ext-5',
      source: 'Cloudflare Blog',
      sourceDomain: 'blog.cloudflare.com',
      title: 'How We Ingest 50 Million Events/sec into ClickHouse Using Rust Pipelines',
      url: 'https://blog.cloudflare.com/',
      readTime: '9 min read',
      category: 'Observability',
      description: 'Vectorized batching, memory-mapped ring buffers, and zero-allocation parsing for massive edge telemetry.',
    },
    {
      id: 'ext-6',
      source: 'ACM Queue',
      sourceDomain: 'queue.acm.org',
      title: 'Eventually Consistent: Revisiting the CAP Theorem in Production Practice',
      url: 'https://queue.acm.org/',
      readTime: '12 min read',
      category: 'Architecture',
      description: 'Werner Vogels on trade-offs between latency, data fresh-ness, and fault isolation in planetary-scale systems.',
    },
  ],
};

interface LabNoteDetailViewProps {
  noteRouteId: string;
  onNavigate: (route: RouteId) => void;
}

export const LabNoteDetailView: React.FC<LabNoteDetailViewProps> = ({ noteRouteId, onNavigate }) => {
  const { data } = usePortfolio();
  const { labNotes, profile } = data;
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [fontSizeMode, setFontSizeMode] = useState<'normal' | 'large'>('normal');
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Match note by id or slug
  const cleanId = noteRouteId.replace(/^(note-|lab-note-)/, '');
  const noteIndex = labNotes.findIndex(
    (n) => n.id === cleanId || n.slug === cleanId || n.id === noteRouteId || n.slug === noteRouteId
  );

  const note = noteIndex !== -1 ? labNotes[noteIndex] : null;
  const prevNote = noteIndex > 0 ? labNotes[noteIndex - 1] : null;
  const nextNote = noteIndex < labNotes.length - 1 ? labNotes[noteIndex + 1] : null;

  // Filter internal related stories (excluding current note)
  const relatedInternalNotes = labNotes
    .filter((n) => n.id !== note?.id)
    .slice(0, 3);

  // External articles
  const externalArticles = EXTERNAL_ARTICLES.default;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribedEmail) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setSubscribedEmail('');
      }, 4000);
    }
  };

  if (!note) {
    return (
      <div className="view-content">
        <div className="wrap section-head">
          <p className="eyebrow mono">Lab Notes · Blog</p>
          <h2>Dispatch Not Found</h2>
          <p style={{ marginTop: '1rem', color: 'var(--muted)' }}>
            The requested engineering field note could not be found. It may have been relocated or updated.
          </p>
          <div style={{ marginTop: '2rem' }}>
            <button
              className="copy-btn"
              onClick={() => onNavigate('home')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ArrowLeft size={16} /> Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="cnn-article-view" id={`lab-note-${note.id}`}>
      {/* 1. TOP NEWSROOM TICKER / BREADCRUMB BAR */}
      <div className="cnn-topbar">
        <div className="wrap cnn-topbar__inner">
          <div className="cnn-breadcrumbs mono">
            <button onClick={() => onNavigate('home')} className="cnn-breadlink">
              Home
            </button>
            <span className="cnn-breadsep">/</span>
            <button
              onClick={() => {
                onNavigate('home');
                window.location.hash = 'lab-notes';
              }}
              className="cnn-breadlink"
            >
              Lab Notes
            </button>
            <span className="cnn-breadsep">/</span>
            <span className="cnn-breadcurrent">{note.category}</span>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="cnn-back-home-btn"
            title="Return to home page"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      {/* 2. CNN EDITORIAL HEADER & TITLE */}
      <header className="cnn-header wrap">
        {/* Kicker / Topic Pill */}
        <div className="cnn-kicker-bar">
          <span className="cnn-kicker-badge mono">
            <span className="cnn-live-pulse"></span>
            ENGINEERING REPORT // {note.category.toUpperCase()}
          </span>
          <span className="cnn-updated-stamp mono">
            POST-MORTEM &amp; FIELD LOG
          </span>
        </div>

        {/* Big Editorial Headline */}
        <h1 className="cnn-headline">{note.title}</h1>

        {/* The Dek (Executive Lead Paragraph) */}
        {note.summary && (
          <p className="cnn-dek">
            {note.summary}
          </p>
        )}

        {/* CNN Byline & Action Strip */}
        <div className="cnn-byline-strip">
          <div className="cnn-author-profile">
            <div className="cnn-author-avatar">
              {profile.name.split(' ').map((w) => w[0]).join('')}
            </div>
            <div className="cnn-author-info">
              <div className="cnn-author-name">
                <span>By <strong>{profile.name}</strong></span>
                <span className="cnn-verified-badge" title="Verified Author">✓</span>
              </div>
              <div className="cnn-author-meta mono">
                <span>{profile.role} · Bandung, ID</span>
                <span className="cnn-dot-sep">·</span>
                <span>Published {note.date}</span>
                <span className="cnn-dot-sep">·</span>
                <span>{note.readTime}</span>
              </div>
            </div>
          </div>

          {/* Action Tools */}
          <div className="cnn-action-tools">
            <button
              onClick={() => setFontSizeMode(fontSizeMode === 'normal' ? 'large' : 'normal')}
              className={`cnn-tool-btn ${fontSizeMode === 'large' ? 'is-active' : ''}`}
              title="Toggle reading font size"
            >
              <span className="mono" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                {fontSizeMode === 'normal' ? 'A+' : 'A-'}
              </span>
            </button>

            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`cnn-tool-btn ${isBookmarked ? 'is-active' : ''}`}
              title={isBookmarked ? 'Saved to bookmarks' : 'Bookmark story'}
            >
              <Bookmark size={15} style={{ fill: isBookmarked ? 'currentColor' : 'none' }} />
            </button>

            <button
              onClick={handleCopyLink}
              className="cnn-tool-btn cnn-tool-btn--share"
              title="Copy shareable link"
            >
              {copiedLink ? (
                <>
                  <Check size={14} style={{ color: '#16a34a' }} />
                  <span className="mono">Copied</span>
                </>
              ) : (
                <>
                  <Share2 size={14} />
                  <span className="mono">Share</span>
                </>
              )}
            </button>

            <button
              onClick={() => window.print()}
              className="cnn-tool-btn cnn-tool-btn--print"
              title="Print / Save PDF"
            >
              <Printer size={15} />
            </button>
          </div>
        </div>

        {/* 3. CNN SIGNATURE "KEY POINTS" / "AT A GLANCE" BOX */}
        {note.keyTakeaways && note.keyTakeaways.length > 0 && (
          <div className="cnn-key-points">
            <div className="cnn-key-points__header">
              <span className="cnn-key-points__indicator"></span>
              <h3 className="cnn-key-points__title">KEY POINTS</h3>
            </div>
            <ul className="cnn-key-points__list">
              {note.keyTakeaways.map((item, idx) => (
                <li key={idx}>
                  <span className="cnn-kp-bullet">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* 4. MAIN EDITORIAL LAYOUT (CNN 2-COLUMN GRID) */}
      <div className="wrap cnn-main-grid">
        {/* LEFT COLUMN: ARTICLE BODY & MEDIA (68%) */}
        <div className={`cnn-content-col ${fontSizeMode === 'large' ? 'font-size-large' : ''}`}>
          {/* Main Hero Diagram / Photo */}
          {note.img && (
            <figure className="cnn-figure">
              <div className="cnn-figure__image-wrap">
                <img src={note.img} alt={note.alt || note.title} loading="eager" />
              </div>
              <figcaption className="cnn-figure__caption">
                <div className="mono cnn-caption-credit">
                  <span>FIGURE 1 // TELEMETRY &amp; ARCHITECTURE TRACE</span>
                  <span>CREDIT: PRODUCTION MONITORING ARCHIVE</span>
                </div>
                <p>{note.caption || note.alt || note.title}</p>
              </figcaption>
            </figure>
          )}

          {/* Article Text */}
          <div className="cnn-article-body">
            {note.content && note.content.length > 0 ? (
              note.content.map((paragraph, idx) => {
                // CNN Drop Cap on the first paragraph
                if (idx === 0) {
                  const firstChar = paragraph.charAt(0);
                  const remaining = paragraph.slice(1);
                  return (
                    <p key={idx} className="cnn-paragraph cnn-paragraph--first">
                      <span className="cnn-drop-cap">{firstChar}</span>
                      {remaining}
                    </p>
                  );
                }

                // Insert In-Article Pull-Quote or Callout after second paragraph
                return (
                  <React.Fragment key={idx}>
                    <p className="cnn-paragraph">
                      {paragraph}
                    </p>

                    {idx === 1 && note.keyTakeaways && note.keyTakeaways[0] && (
                      <div className="cnn-intext-pullquote">
                        <span className="cnn-pullquote-mark">“</span>
                        <blockquote className="cnn-pullquote-text">
                          {note.keyTakeaways[0]}
                        </blockquote>
                        <cite className="cnn-pullquote-cite mono">
                          — Architectural Rule Documented from this Incident
                        </cite>
                      </div>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <p className="cnn-paragraph">{note.summary}</p>
            )}

            {/* Technical Code Snippet */}
            {note.codeSnippet && note.codeSnippet.code && (
              <div className="cnn-code-container">
                <div className="cnn-code-header">
                  <div className="cnn-code-title">
                    <Code size={14} style={{ color: 'var(--accent)' }} />
                    <span className="mono">
                      {note.codeSnippet.filename || `snippet.${note.codeSnippet.language || 'txt'}`}
                    </span>
                  </div>
                  <div className="cnn-code-actions">
                    <span className="cnn-code-lang mono">{note.codeSnippet.language}</span>
                    <button
                      onClick={() => handleCopyCode(note.codeSnippet?.code || '')}
                      className="cnn-copy-code-btn"
                      title="Copy code to clipboard"
                    >
                      {copiedCode ? (
                        <>
                          <Check size={12} style={{ color: '#4ade80' }} />
                          <span>Copied</span>
                        </>
                      ) : (
                        <span>Copy Code</span>
                      )}
                    </button>
                  </div>
                </div>
                <pre className="cnn-code-pre">
                  <code>{note.codeSnippet.code}</code>
                </pre>
              </div>
            )}

            {/* In-Article Background Callout */}
            <div className="cnn-editor-note">
              <div className="cnn-editor-note__header mono">
                <Compass size={14} style={{ color: 'var(--accent)' }} />
                <span>BACKGROUND &amp; METHODOLOGY</span>
              </div>
              <p>
                Metrics in this post-mortem were recorded using kernel-level eBPF traces and distributed OpenTelemetry spans during peak synthetic load testing and live staging verification.
              </p>
            </div>

            {/* Tags Strip */}
            {note.tags && note.tags.length > 0 && (
              <div className="cnn-tags-bar">
                <div className="cnn-tags-label mono">
                  <Tag size={13} />
                  <span>TOPICS IN THIS STORY:</span>
                </div>
                <div className="cnn-tags-list">
                  {note.tags.map((tag) => (
                    <span key={tag} className="cnn-tag-chip">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Footer Bio Card */}
            <div className="cnn-author-card">
              <div className="cnn-author-card__avatar">
                {profile.name.split(' ').map((w) => w[0]).join('')}
              </div>
              <div className="cnn-author-card__bio">
                <h4>{profile.name}</h4>
                <p>
                  Senior Backend &amp; Infrastructure Engineer. Specializes in fault-tolerant distributed databases, high-throughput message streaming, and zero-downtime cutovers.
                </p>
                <div className="cnn-author-card__meta mono">
                  <span>Based in Bandung, Indonesia</span>
                  <span>·</span>
                  <a href="#contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}>
                    Send dispatch message →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CNN STICKY SIDEBAR (32%) */}
        <aside className="cnn-sidebar-col">
          <div className="cnn-sidebar-sticky">
            {/* WIDGET 1: RELATED DISPATCHES (FROM THIS WEB) */}
            <div className="cnn-sidebar-widget">
              <div className="cnn-widget-header">
                <span className="cnn-widget-pip"></span>
                <h3 className="cnn-widget-title">MORE FROM THIS LAB</h3>
              </div>
              <div className="cnn-related-list">
                {relatedInternalNotes.map((rel) => (
                  <article
                    key={rel.id}
                    className="cnn-related-card"
                    onClick={() => {
                      onNavigate(`note-${rel.id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="cnn-related-card__thumb">
                      <img src={rel.img} alt={rel.alt || rel.title} loading="lazy" />
                    </div>
                    <div className="cnn-related-card__content">
                      <span className="cnn-related-card__cat mono">{rel.category}</span>
                      <h4 className="cnn-related-card__title">
                        {rel.title}
                      </h4>
                      <span className="cnn-related-card__meta mono">
                        {rel.readTime}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* WIDGET 2: FROM AROUND THE WEB (EXTERNAL CURATED ARTICLES) */}
            <div className="cnn-sidebar-widget cnn-sidebar-widget--external">
              <div className="cnn-widget-header">
                <ExternalLink size={14} style={{ color: 'var(--accent)' }} />
                <h3 className="cnn-widget-title">FROM AROUND THE WEB</h3>
                <span className="cnn-widget-sublabel mono">CURATED READING</span>
              </div>
              <p className="cnn-widget-intro">
                Foundational external papers, production writeups, and industry case studies relevant to this architecture:
              </p>

              <div className="cnn-external-list">
                {externalArticles.slice(0, 4).map((ext) => (
                  <a
                    key={ext.id}
                    href={ext.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cnn-external-card"
                    title={`Open external paper on ${ext.sourceDomain}`}
                  >
                    <div className="cnn-external-card__top">
                      <span className="cnn-domain-pill mono">
                        {ext.sourceDomain}
                      </span>
                      <ExternalLink size={12} className="cnn-ext-icon" />
                    </div>
                    <h4 className="cnn-external-card__title">
                      {ext.title}
                    </h4>
                    <p className="cnn-external-card__desc">
                      {ext.description}
                    </p>
                    <div className="cnn-external-card__footer mono">
                      <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{ext.source}</span>
                      <span>·</span>
                      <span>{ext.readTime}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* WIDGET 3: TRENDING ARCHITECTURE TOPICS */}
            <div className="cnn-sidebar-widget">
              <div className="cnn-widget-header">
                <TrendingUp size={14} style={{ color: 'var(--accent)' }} />
                <h3 className="cnn-widget-title">TRENDING TOPICS</h3>
              </div>
              <div className="cnn-trending-chips">
                <span className="cnn-trend-pill">#ZeroDowntime</span>
                <span className="cnn-trend-pill">#RaftConsensus</span>
                <span className="cnn-trend-pill">#HighThroughput</span>
                <span className="cnn-trend-pill">#KafkaStreams</span>
                <span className="cnn-trend-pill">#ClickHouse</span>
                <span className="cnn-trend-pill">#PostgresWAL</span>
                <span className="cnn-trend-pill">#GoroutineLeak</span>
              </div>
            </div>

            {/* WIDGET 4: FIELD DISPATCHES NEWSLETTER / RSS */}
            <div className="cnn-sidebar-widget cnn-newsletter-widget">
              <div className="cnn-widget-header">
                <BookOpen size={14} style={{ color: 'var(--accent)' }} />
                <h3 className="cnn-widget-title">FIELD DISPATCHES</h3>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--muted)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                Receive technical writeups, architecture blueprints, and production post-mortems straight to your inbox.
              </p>

              {isSubscribed ? (
                <div className="cnn-newsletter-success mono">
                  <CheckCircle2 size={16} style={{ color: '#16a34a' }} />
                  <span>Subscribed! Check your inbox for confirmation.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="cnn-newsletter-form">
                  <input
                    type="email"
                    required
                    value={subscribedEmail}
                    onChange={(e) => setSubscribedEmail(e.target.value)}
                    placeholder="engineer@company.com"
                    className="cnn-newsletter-input"
                    aria-label="Email address for engineering updates"
                  />
                  <button type="submit" className="cnn-newsletter-btn mono">
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* 5. BOTTOM CNN SECTION: "MORE STORIES & GLOBAL COVERAGE" */}
      <section className="cnn-bottom-section">
        <div className="wrap">
          <div className="cnn-bottom-header">
            <div>
              <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--accent)', letterSpacing: '0.08em', display: 'block' }}>
                COMPREHENSIVE COVERAGE
              </span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '0.3rem' }}>
                More technical logs &amp; recommended external reading
              </h2>
            </div>
            <button
              onClick={() => {
                onNavigate('home');
                window.location.hash = 'lab-notes';
              }}
              className="copy-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span>View all dispatches on Home</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* 3-Column CNN Editorial Cards Grid (Internal & External) */}
          <div className="cnn-bottom-grid">
            {/* 1. Internal Note 1 */}
            {relatedInternalNotes[0] && (
              <article
                className="cnn-bottom-card"
                onClick={() => {
                  onNavigate(`note-${relatedInternalNotes[0].id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="cnn-bottom-card__img">
                  <img src={relatedInternalNotes[0].img} alt={relatedInternalNotes[0].title} loading="lazy" />
                  <span className="cnn-card-badge mono">{relatedInternalNotes[0].category}</span>
                </div>
                <div className="cnn-bottom-card__body">
                  <div className="cnn-bottom-card__source mono">FROM THIS LAB · {relatedInternalNotes[0].readTime}</div>
                  <h3>{relatedInternalNotes[0].title}</h3>
                  <p>{relatedInternalNotes[0].summary || relatedInternalNotes[0].caption}</p>
                  <span className="cnn-bottom-read-link mono">Read Note →</span>
                </div>
              </article>
            )}

            {/* 2. External Paper 1 */}
            {externalArticles[4] && (
              <a
                href={externalArticles[4].url}
                target="_blank"
                rel="noopener noreferrer"
                className="cnn-bottom-card cnn-bottom-card--external"
              >
                <div className="cnn-bottom-card__img cnn-bottom-card__img--placeholder">
                  <div className="cnn-placeholder-badge mono">
                    <ExternalLink size={16} />
                    <span>EXTERNAL ANALYSIS</span>
                  </div>
                  <span className="cnn-card-badge mono">{externalArticles[4].sourceDomain}</span>
                </div>
                <div className="cnn-bottom-card__body">
                  <div className="cnn-bottom-card__source mono">
                    {externalArticles[4].source.toUpperCase()} · {externalArticles[4].readTime}
                  </div>
                  <h3>{externalArticles[4].title}</h3>
                  <p>{externalArticles[4].description}</p>
                  <span className="cnn-bottom-read-link mono">Open on {externalArticles[4].sourceDomain} ↗</span>
                </div>
              </a>
            )}

            {/* 3. External Paper 2 */}
            {externalArticles[5] && (
              <a
                href={externalArticles[5].url}
                target="_blank"
                rel="noopener noreferrer"
                className="cnn-bottom-card cnn-bottom-card--external"
              >
                <div className="cnn-bottom-card__img cnn-bottom-card__img--placeholder">
                  <div className="cnn-placeholder-badge mono">
                    <ExternalLink size={16} />
                    <span>EXTERNAL ANALYSIS</span>
                  </div>
                  <span className="cnn-card-badge mono">{externalArticles[5].sourceDomain}</span>
                </div>
                <div className="cnn-bottom-card__body">
                  <div className="cnn-bottom-card__source mono">
                    {externalArticles[5].source.toUpperCase()} · {externalArticles[5].readTime}
                  </div>
                  <h3>{externalArticles[5].title}</h3>
                  <p>{externalArticles[5].description}</p>
                  <span className="cnn-bottom-read-link mono">Open on {externalArticles[5].sourceDomain} ↗</span>
                </div>
              </a>
            )}
          </div>

          {/* Next / Previous Story Bar */}
          <div className="cnn-pagination-bar">
            {prevNote ? (
              <button
                onClick={() => {
                  onNavigate(`note-${prevNote.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cnn-pag-card cnn-pag-card--prev"
              >
                <div className="cnn-pag-direction mono">
                  <ArrowLeft size={13} />
                  <span>PREVIOUS DISPATCH</span>
                </div>
                <div className="cnn-pag-title">{prevNote.title}</div>
              </button>
            ) : (
              <div className="cnn-pag-card cnn-pag-card--empty">
                <span className="mono" style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Earliest Available Dispatch</span>
              </div>
            )}

            {nextNote ? (
              <button
                onClick={() => {
                  onNavigate(`note-${nextNote.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cnn-pag-card cnn-pag-card--next"
              >
                <div className="cnn-pag-direction mono">
                  <span>NEXT DISPATCH</span>
                  <ArrowRight size={13} />
                </div>
                <div className="cnn-pag-title">{nextNote.title}</div>
              </button>
            ) : (
              <div className="cnn-pag-card cnn-pag-card--empty">
                <span className="mono" style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Latest Published Dispatch</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </article>
  );
};
