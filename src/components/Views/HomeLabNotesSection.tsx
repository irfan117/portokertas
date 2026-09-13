'use client';

import React from 'react';
import { RouteId } from '../../types';
import { usePortfolio } from '../../context/PortfolioContext';
import { ArrowUpRight, BookOpen, Calendar, Clock } from 'lucide-react';

interface HomeLabNotesSectionProps {
  onNavigate: (route: RouteId) => void;
}

export const HomeLabNotesSkeleton: React.FC = () => {
  return (
    <section
      id="lab-notes-section"
      className="py-24 md:py-32 px-4 md:px-12 bg-white"
    >
      <div className="max-w-[1400px] mx-auto animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col items-center text-center mb-24 gap-6">
          <div className="h-20 w-80 bg-black/[0.04] rounded-2xl mb-4" />
          <div className="h-4 w-48 bg-black/[0.03] rounded-full" />
        </div>

        {/* Entries Skeleton */}
        <div className="flex flex-col gap-[6vw]">
          {[1, 2].map((i) => (
            <div key={i} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-1 hidden lg:block">
                <div className="h-24 w-20 bg-black/[0.02] rounded-xl" />
              </div>
              <div className="lg:col-span-5 flex flex-col justify-center gap-4">
                <div className="h-4 w-40 bg-black/[0.04] rounded-full" />
                <div className="h-10 w-3/4 bg-black/[0.06] rounded-xl" />
                <div className="h-20 w-full bg-black/[0.03] rounded-xl" />
                <div className="h-6 w-48 bg-black/[0.03] rounded-lg mt-2" />
                <div className="flex gap-2 mt-4">
                  <div className="h-8 w-24 bg-black/[0.03] rounded-full" />
                  <div className="h-8 w-24 bg-black/[0.03] rounded-full" />
                </div>
              </div>
              <div className="lg:col-span-6 aspect-video bg-black/[0.03] rounded-[2.5rem]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const HomeLabNotesSection: React.FC<HomeLabNotesSectionProps> = ({ onNavigate }) => {
  const { data, isLoading, isDatabaseLoaded } = usePortfolio();
  const { labNotes } = data;

  // Proteksi: jangan tampilkan data dummy sebelum fetch database selesai
  if (isLoading || !isDatabaseLoaded) {
    return <HomeLabNotesSkeleton />;
  }

  // Ambil 4 lab notes teratas
  const featuredNotes = (labNotes || []).slice(0, 4);

  const handleOpenNote = (noteIdOrSlug: string) => {
    onNavigate(`lab-note-${noteIdOrSlug}`);
  };

  return (
    <section id="lab-notes-section" className="py-24 md:py-32 px-4 md:px-12 bg-white">
      <div id="lab-notes" className="sr-only" />
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-24 gap-6">
          <div>
            <h2 className="text-[10vw] lg:text-[clamp(6rem,8vw,10rem)] font-normal tracking-tighter leading-[0.85] mb-8 text-black font-['Space_Grotesk']">
              Lab <br />
              <span className="text-[var(--accent)] font-serif lowercase tracking-normal italic font-normal">
                notes
              </span>
            </h2>
            <div className="flex items-center justify-center gap-2">
              <span className="h-px w-12 bg-[var(--accent)]/20" />
              <p className="text-gray-600 font-mono text-[9px] uppercase tracking-[0.4em] leading-relaxed">
                Handpicked selection &amp; Post-Mortems
              </p>
              <span className="h-px w-12 bg-[var(--accent)]/20" />
            </div>
          </div>
        </div>

        {/* Notes Entries List */}
        {featuredNotes.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-black/10 bg-black/[0.01] text-gray-400 text-sm font-mono">
            Belum ada lab notes yang dipublikasikan.
          </div>
        ) : (
          <div className="flex flex-col gap-[6vw]">
            {featuredNotes.map((note, index) => {
              const noteTarget = note.slug || note.id;
              const numberLabel = String(index + 1).padStart(2, '0');

              return (
                <article key={note.id || index} className="project-entry group relative">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Subtle Huge Number (Desktop) */}
                    <div className="lg:col-span-1 hidden lg:block select-none">
                      <span className="text-[8vw] font-normal text-black/[0.04] leading-none transition-colors duration-500 group-hover:text-[var(--accent)]/15 font-['Space_Grotesk']">
                        {numberLabel}
                      </span>
                    </div>

                    {/* Note Details Column */}
                    <div className="lg:col-span-5 flex flex-col justify-center">
                      <p className="text-[var(--accent)] font-medium text-[10px] uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                        <span className="w-1 h-1 bg-[var(--accent)] rounded-full" />
                        <span>
                          {note.category} | {note.readTime}
                        </span>
                      </p>

                      <h3
                        onClick={() => handleOpenNote(noteTarget)}
                        className="text-3xl xl:text-5xl font-normal mb-8 group-hover:text-[var(--accent)] transition-colors duration-500 text-black leading-tight cursor-pointer font-['Space_Grotesk']"
                      >
                        {note.title}
                      </h3>

                      <p className="text-gray-500 text-lg leading-relaxed mb-6 max-w-md font-medium">
                        {note.summary}
                      </p>

                      {/* Main Portions / Key Takeaways */}
                      {note.keyTakeaways && note.keyTakeaways.length > 0 && (
                        <div className="mb-8">
                          <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-gray-400 mb-3 underline decoration-[var(--accent)]/20">
                            Main Portions
                          </p>
                          <p className="text-sm font-normal text-black/80 leading-relaxed">
                            {note.keyTakeaways.slice(0, 3).join(' | ')}
                          </p>
                        </div>
                      )}

                      {/* Tech Badges */}
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-10">
                          {note.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-4 py-1.5 border border-black/[0.03] rounded-full text-[9px] font-medium font-mono text-gray-400 uppercase tracking-widest bg-black/[0.01]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action Link & Meta */}
                      <div className="flex items-center gap-4 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleOpenNote(noteTarget)}
                          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[var(--line)] text-xs font-mono uppercase tracking-widest text-[var(--ink)]/80 hover:text-[var(--accent)] hover:border-[var(--accent)]/40 transition-all duration-300 bg-[var(--paper)]/50 cursor-pointer"
                          title={`Read full post-mortem: ${note.title}`}
                        >
                          <BookOpen size={15} />
                          <span>Read Dispatch</span>
                          <ArrowUpRight size={14} className="opacity-60" />
                        </button>

                        <span className="text-xs font-mono text-[var(--muted)] flex items-center gap-1.5">
                          <Calendar size={13} className="opacity-70" />
                          <span>{note.date}</span>
                        </span>

                        <span className="text-xs font-mono text-[var(--muted)] flex items-center gap-1.5">
                          <Clock size={13} className="opacity-70" />
                          <span>{note.readTime}</span>
                        </span>
                      </div>
                    </div>

                    {/* Note Visual Image Column */}
                    <div className="lg:col-span-6 relative aspect-video overflow-hidden rounded-[2.5rem] border border-black/5 shadow-2xl shadow-black/[0.01] group/img bg-white">
                      <div
                        className="w-full h-full bg-black/[0.01] flex items-center justify-center relative backdrop-blur-3xl overflow-hidden cursor-pointer"
                        onClick={() => handleOpenNote(noteTarget)}
                      >
                        <img
                          alt={note.alt || note.caption || note.title || 'Lab Note'}
                          loading="lazy"
                          decoding="async"
                          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover/img:scale-105"
                          src={note.img}
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            if (target.parentElement) {
                              target.parentElement.classList.add(
                                'flex',
                                'items-center',
                                'justify-center',
                                'p-8',
                                'bg-black/[0.02]'
                              );
                            }
                          }}
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent)]/5 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        {/* Project Preview Badge */}
                        <div className="absolute bottom-10 left-10 p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-black/5 translate-y-20 opacity-0 group-hover/img:translate-y-0 group-hover/img:opacity-100 transition-all duration-700 pointer-events-none">
                          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--accent)]">
                            FIELD DISPATCH PREVIEW
                          </p>
                        </div>
                      </div>

                      {/* Interactive Circular Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenNote(noteTarget)}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-black text-white flex items-center justify-center scale-0 group-hover/img:scale-100 transition-transform duration-500 shadow-2xl shadow-black/20 z-20 hover:bg-[var(--accent)] cursor-pointer"
                        title={`Open ${note.title}`}
                      >
                        <ArrowUpRight size={32} />
                      </button>
                    </div>
                  </div>

                  {/* Gradient Hairline Divider */}
                  {index < featuredNotes.length - 1 && (
                    <div className="mt-16 w-full h-px bg-gradient-to-r from-transparent via-black/[0.05] to-transparent" />
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* View All Lab Notes CTA */}
        <div className="mt-32 flex justify-center">
          <div className="magnetic-wrap" style={{ transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onNavigate('lab-notes');
              }}
              className="group relative inline-flex items-center gap-4 px-12 py-6 bg-black text-white rounded-full overflow-hidden transition-all duration-500 hover:bg-black/90 hover:gap-6 shadow-2xl shadow-black/10 cursor-pointer"
              title="Browse all lab notes & post-mortems archive"
            >
              <span className="relative z-10 text-xs font-medium uppercase tracking-[0.3em]">
                View all Lab Notes
              </span>
              <ArrowUpRight size={18} className="relative z-10" />
              <div className="absolute inset-0 bg-[var(--accent)] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
