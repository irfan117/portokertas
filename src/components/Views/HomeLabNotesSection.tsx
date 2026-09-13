import React from 'react';
import { RouteId } from '../../types';
import { usePortfolio } from '../../context/PortfolioContext';
import { ArrowUpRight, BookOpen, Clock, Calendar } from 'lucide-react';

interface HomeLabNotesSectionProps {
  onNavigate: (route: RouteId) => void;
}

export const HomeLabNotesSkeleton: React.FC = () => {
  return (
    <section
      id="lab-notes-section"
      className="py-16 md:py-24 bg-[var(--paper)] border-t border-b border-[var(--line)] transition-colors"
    >
      <div className="max-w-[var(--maxw)] mx-auto px-4 sm:px-6 md:px-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16 gap-3">
          <div className="h-3 w-44 bg-[var(--line)]/60 rounded-full mb-1" />
          <div className="h-10 md:h-12 w-56 sm:w-72 bg-[var(--line)]/50 rounded-lg" />
          <div className="h-4 w-72 sm:w-96 bg-[var(--line)]/30 rounded-full mt-2" />
        </div>

        {/* Note Cards Skeleton */}
        <div className="flex flex-col gap-12 md:gap-16">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center p-4 sm:p-6 rounded-2xl bg-[var(--white)] border border-[var(--line)]/60"
            >
              <div className="lg:col-span-1 hidden lg:flex justify-center">
                <div className="h-10 w-8 bg-[var(--line)]/30 rounded" />
              </div>
              <div className="lg:col-span-6 flex flex-col justify-center gap-3">
                <div className="h-3.5 w-32 bg-[var(--line)]/50 rounded-full" />
                <div className="h-7 w-4/5 bg-[var(--line)]/60 rounded-md" />
                <div className="h-14 w-full bg-[var(--line)]/30 rounded-md" />
                <div className="h-8 w-44 bg-[var(--line)]/40 rounded-full mt-2" />
              </div>
              <div className="lg:col-span-5 aspect-[16/10] bg-[var(--line)]/30 rounded-xl" />
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

  // Prevent momentary visibility of dummy data:
  // Do NOT render the UI with dummy notes while database fetch is in progress.
  if (isLoading || !isDatabaseLoaded) {
    return <HomeLabNotesSkeleton />;
  }

  // Display top 4 featured engineering lab notes / dispatches
  const featuredNotes = (labNotes || []).slice(0, 4);

  const handleOpenNote = (noteIdOrSlug: string) => {
    onNavigate(`lab-note-${noteIdOrSlug}`);
  };

  return (
    <section
      id="lab-notes-section"
      className="py-16 md:py-24 bg-[var(--paper)] border-t border-b border-[var(--line)] transition-colors"
    >
      <div id="lab-notes" className="sr-only" />
      <div className="max-w-[var(--maxw)] mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16 gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--line)] bg-[var(--white)] text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--accent)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            <span>Field Dispatches &amp; Post-Mortems</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--ink)] font-['Space_Grotesk']">
            Lab{' '}
            <span className="font-serif lowercase tracking-normal italic font-normal text-[var(--accent)]">
              notes
            </span>
          </h2>

          <p className="text-[var(--muted)] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Technical write-ups, architecture decisions, and operational post-mortems from production systems.
          </p>
        </div>

        {/* Notes Entries List */}
        {featuredNotes.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-[var(--line)] bg-[var(--white)] text-[var(--muted)] text-sm font-mono">
            Belum ada lab notes yang dipublikasikan.
          </div>
        ) : (
          <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
            {featuredNotes.map((note, index) => {
              const noteTarget = note.slug || note.id;
              const numberLabel = String(index + 1).padStart(2, '0');

              return (
                <article
                  key={note.id || index}
                  className="group relative bg-[var(--white)] border border-[var(--line)] rounded-2xl p-5 sm:p-7 md:p-8 hover:border-[var(--ink)]/40 hover:shadow-lg hover:shadow-black/[0.04] transition-all duration-300"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                    {/* Subtle Number Index (Desktop) */}
                    <div className="lg:col-span-1 hidden lg:flex flex-col items-center justify-center select-none">
                      <span className="text-3xl xl:text-4xl font-bold text-[var(--ink)]/15 group-hover:text-[var(--accent)]/40 font-['Space_Grotesk'] transition-colors duration-300">
                        {numberLabel}
                      </span>
                    </div>

                    {/* Note Details Column */}
                    <div className="lg:col-span-6 flex flex-col justify-center">
                      {/* Category Pill */}
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="text-[var(--accent)] font-medium font-mono text-[11px] uppercase tracking-[0.2em] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full" />
                          <span>{note.category}</span>
                        </span>
                        <span className="text-[var(--muted)] text-xs">·</span>
                        <span className="text-[var(--muted)] font-mono text-xs">{note.readTime}</span>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => handleOpenNote(noteTarget)}
                        className="text-xl sm:text-2xl font-bold mb-3 text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors duration-200 leading-snug font-['Space_Grotesk'] cursor-pointer"
                      >
                        {note.title}
                      </h3>

                      {/* Summary Excerpt */}
                      <p className="text-[var(--muted)] text-sm sm:text-[15px] leading-relaxed mb-4 line-clamp-3 font-normal">
                        {note.summary}
                      </p>

                      {/* Key Takeaways Callout */}
                      {note.keyTakeaways && note.keyTakeaways.length > 0 && (
                        <div className="mb-4 p-3 rounded-lg bg-[var(--paper-dim)]/60 border-l-2 border-[var(--accent)]">
                          <p className="text-[10px] font-mono font-medium uppercase tracking-[0.16em] text-[var(--accent)] mb-1">
                            Key Takeaway
                          </p>
                          <p className="text-xs sm:text-sm font-medium text-[var(--ink)]/90 leading-relaxed">
                            {note.keyTakeaways.slice(0, 2).join(' · ')}
                          </p>
                        </div>
                      )}

                      {/* Tech & Topic Badges */}
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {note.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 border border-[var(--line)] rounded-full text-[10px] font-medium font-mono text-[var(--muted)] uppercase tracking-wider bg-[var(--paper)]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action Link & Meta */}
                      <div className="flex items-center gap-3 sm:gap-4 flex-wrap pt-2 border-t border-[var(--line)]/60">
                        <button
                          type="button"
                          onClick={() => handleOpenNote(noteTarget)}
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--line)] text-xs font-mono uppercase tracking-wider text-[var(--ink)] hover:text-[var(--white)] hover:bg-[var(--ink)] hover:border-[var(--ink)] transition-all duration-200 cursor-pointer"
                          title={`Read dispatch: ${note.title}`}
                        >
                          <BookOpen size={13} />
                          <span>Read Dispatch</span>
                          <ArrowUpRight size={13} className="opacity-70" />
                        </button>

                        <span className="text-xs font-mono text-[var(--muted)] flex items-center gap-1">
                          <Calendar size={12} className="opacity-70" />
                          <span>{note.date}</span>
                        </span>

                        <span className="text-xs font-mono text-[var(--muted)] flex items-center gap-1">
                          <Clock size={12} className="opacity-70" />
                          <span>{note.readTime}</span>
                        </span>
                      </div>
                    </div>

                    {/* Visual Media Column */}
                    <div className="lg:col-span-5 relative aspect-[16/10] overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--paper-dim)] shadow-sm group/img cursor-pointer">
                      <div
                        className="w-full h-full relative overflow-hidden"
                        onClick={() => handleOpenNote(noteTarget)}
                      >
                        <img
                          alt={note.alt || note.caption || note.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/img:scale-105"
                          src={note.img}
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            if (target.parentElement) {
                              target.parentElement.classList.add(
                                'flex',
                                'items-center',
                                'justify-center',
                                'p-6',
                                'bg-[var(--paper-dim)]'
                              );
                            }
                          }}
                        />

                        {/* Subtle Vignette Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-30 group-hover/img:opacity-60 transition-opacity duration-300 pointer-events-none" />

                        {/* Dispatch Badge */}
                        <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-[var(--white)]/95 backdrop-blur-sm rounded-md border border-[var(--line)] text-[9px] font-mono font-medium uppercase tracking-[0.2em] text-[var(--accent)] shadow-sm pointer-events-none">
                          DISPATCH
                        </div>

                        {/* Hover Quick-Open Button */}
                        <div
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[var(--ink)] text-[var(--white)] flex items-center justify-center scale-0 group-hover/img:scale-100 transition-all duration-300 shadow-xl z-20 group-hover/img:bg-[var(--accent)]"
                          title={`Open ${note.title}`}
                        >
                          <ArrowUpRight size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* View All Lab Notes CTA */}
        <div className="mt-12 md:mt-16 flex justify-center">
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              onNavigate('lab-notes');
            }}
            className="group inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 bg-[var(--ink)] text-[var(--white)] rounded-full text-xs font-mono font-medium uppercase tracking-[0.25em] hover:bg-[var(--accent)] transition-colors duration-200 shadow-md shadow-black/5 cursor-pointer"
            title="Browse all lab notes & post-mortems archive"
          >
            <span>View all Lab Notes</span>
            <ArrowUpRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>
    </section>
  );
};
