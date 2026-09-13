'use client';

import React from 'react';
import { RouteId } from '../../types';
import { usePortfolio } from '../../context/PortfolioContext';
import { ArrowUpRight, BookOpen, Calendar, Clock } from 'lucide-react';

interface HomeLabNotesSectionProps {
  onNavigate: (route: RouteId) => void;
}

/* ── Skeleton shown while fetching ── */
export const HomeLabNotesSkeleton: React.FC = () => (
  <section id="lab-notes-section" className="ln-section">
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* header skeleton */}
      <div className="ln-header ln-skeleton">
        <div className="ln-skel-block" style={{ height: '6rem', width: '20rem', marginBottom: '1rem' }} />
        <div className="ln-skel-block" style={{ height: '1rem', width: '12rem' }} />
      </div>

      {/* entry skeletons */}
      <div className="ln-list">
        {[1, 2].map((i) => (
          <div key={i} className="ln-entry ln-skeleton">
            <div className="ln-entry-grid">
              <div className="ln-skel-block ln-num" style={{ height: '6rem', width: '5rem' }} />
              <div className="ln-content" style={{ gap: '1rem' }}>
                <div className="ln-skel-block" style={{ height: '0.75rem', width: '10rem' }} />
                <div className="ln-skel-block" style={{ height: '2.5rem', width: '75%' }} />
                <div className="ln-skel-block" style={{ height: '5rem', width: '100%' }} />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div className="ln-skel-block" style={{ height: '2rem', width: '6rem', borderRadius: '999px' }} />
                  <div className="ln-skel-block" style={{ height: '2rem', width: '6rem', borderRadius: '999px' }} />
                </div>
              </div>
              <div className="ln-visual" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ── Main Component ── */
export const HomeLabNotesSection: React.FC<HomeLabNotesSectionProps> = ({ onNavigate }) => {
  const { data, isLoading, isDatabaseLoaded } = usePortfolio();
  const { labNotes } = data;

  // Jangan tampilkan data dummy sebelum fetch selesai
  if (isLoading || !isDatabaseLoaded) {
    return <HomeLabNotesSkeleton />;
  }

  const featuredNotes = (labNotes || []).slice(0, 4);

  const handleOpenNote = (noteIdOrSlug: string) => {
    onNavigate(`lab-note-${noteIdOrSlug}`);
  };

  return (
    <section id="lab-notes-section" className="ln-section">
      <div id="lab-notes" style={{ position: 'absolute', top: '-80px' }} />
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* ── Header ── */}
        <div className="ln-header">
          <div>
            <h2 className="ln-heading">
              Lab <br />
              <span className="ln-heading-accent">notes</span>
            </h2>
            <div className="ln-subline">
              <span className="ln-rule" />
              <p className="ln-subline-text">Handpicked selection &amp; Post-Mortems</p>
              <span className="ln-rule" />
            </div>
          </div>
        </div>

        {/* ── Notes list ── */}
        {featuredNotes.length === 0 ? (
          <div className="ln-empty">Belum ada lab notes yang dipublikasikan.</div>
        ) : (
          <div className="ln-list">
            {featuredNotes.map((note, index) => {
              const noteTarget = note.slug || note.id;
              const numberLabel = String(index + 1).padStart(2, '0');

              return (
                <article key={note.id || index} className="ln-entry">
                  <div className="ln-entry-grid">

                    {/* Large ghost number */}
                    <span className="ln-num">{numberLabel}</span>

                    {/* Text content */}
                    <div className="ln-content">
                      <p className="ln-category">
                        <span className="ln-dot" />
                        <span>{note.category}{note.readTime ? ` | ${note.readTime}` : ''}</span>
                      </p>

                      <h3
                        className="ln-title"
                        onClick={() => handleOpenNote(noteTarget)}
                      >
                        {note.title}
                      </h3>

                      <p className="ln-summary">{note.summary}</p>

                      {note.keyTakeaways && note.keyTakeaways.length > 0 && (
                        <div className="ln-takeaways">
                          <p className="ln-takeaways-label">Main Portions</p>
                          <p className="ln-takeaways-text">
                            {note.keyTakeaways.slice(0, 3).join(' | ')}
                          </p>
                        </div>
                      )}

                      {note.tags && note.tags.length > 0 && (
                        <div className="ln-tags">
                          {note.tags.map((tag) => (
                            <span key={tag} className="ln-tag">{tag}</span>
                          ))}
                        </div>
                      )}

                      <div className="ln-actions">
                        <button
                          type="button"
                          className="ln-read-btn"
                          onClick={() => handleOpenNote(noteTarget)}
                          title={`Read full post-mortem: ${note.title}`}
                        >
                          <BookOpen size={14} />
                          <span>Read Dispatch</span>
                          <ArrowUpRight size={13} style={{ opacity: 0.6 }} />
                        </button>

                        {note.date && (
                          <span className="ln-meta">
                            <Calendar size={13} style={{ opacity: 0.7 }} />
                            <span>{note.date}</span>
                          </span>
                        )}

                        {note.readTime && (
                          <span className="ln-meta">
                            <Clock size={13} style={{ opacity: 0.7 }} />
                            <span>{note.readTime}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Visual / image column */}
                    <div
                      className="ln-visual"
                      onClick={() => handleOpenNote(noteTarget)}
                    >
                      {note.img ? (
                        <img
                          src={note.img}
                          alt={note.alt || note.caption || note.title || 'Lab Note'}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          background: 'rgba(22,23,26,0.03)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <BookOpen size={40} style={{ color: 'var(--muted)', opacity: 0.3 }} />
                        </div>
                      )}

                      <div className="ln-visual-overlay" />

                      <div className="ln-visual-badge">
                        <p className="ln-visual-badge-label">Field Dispatch Preview</p>
                      </div>

                      <button
                        type="button"
                        className="ln-circle-btn"
                        onClick={(e) => { e.stopPropagation(); handleOpenNote(noteTarget); }}
                        title={`Open ${note.title}`}
                      >
                        <ArrowUpRight size={28} />
                      </button>
                    </div>
                  </div>

                  {/* Hairline divider between entries */}
                  {index < featuredNotes.length - 1 && (
                    <div className="ln-divider" />
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* ── View all CTA ── */}
        <div className="ln-cta">
          <button
            type="button"
            className="ln-cta-btn"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              onNavigate('lab-notes');
            }}
            title="Browse all lab notes & post-mortems archive"
          >
            <span>View all Lab Notes</span>
            <ArrowUpRight size={18} />
            <div className="ln-cta-btn-bg" />
          </button>
        </div>
      </div>
    </section>
  );
};
