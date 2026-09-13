import React from 'react';
import { RouteId } from '../../types';
import { usePortfolio } from '../../context/PortfolioContext';
import { ArrowUpRight, BookOpen, Clock, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeLabNotesSectionProps {
  onNavigate: (route: RouteId) => void;
}

export const HomeLabNotesSection: React.FC<HomeLabNotesSectionProps> = ({ onNavigate }) => {
  const { data } = usePortfolio();
  const { labNotes } = data;

  // Display top 4 featured engineering lab notes / dispatches
  const featuredNotes = labNotes.slice(0, 4);

  const handleOpenNote = (noteIdOrSlug: string) => {
    onNavigate(`lab-note-${noteIdOrSlug}`);
  };

  return (
    <section
      id="lab-notes-section"
      className="home-project-gallery py-24 md:py-32 px-4 md:px-12 bg-[var(--white)] border-t border-b border-[var(--line)] transition-colors"
    >
      <div id="lab-notes" className="sr-only" />
      <div className="max-w-[1360px] mx-auto">
        {/* Section Header */}
        <motion.div
          className="flex flex-col items-center text-center mb-20 md:mb-24 gap-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-[clamp(3.5rem,7vw,7.5rem)] font-bold tracking-tighter leading-[0.88] mb-4 text-[var(--ink)] font-['Space_Grotesk']">
            Lab <br />
            <span className="text-[var(--accent)] font-serif lowercase tracking-normal italic font-normal">
              notes
            </span>
          </h2>
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-[var(--accent)]/30" />
            <p className="text-[var(--muted)] font-mono text-[10px] uppercase tracking-[0.35em] leading-relaxed">
              Field Dispatches &amp; Post-Mortems
            </p>
            <span className="h-px w-12 bg-[var(--accent)]/30" />
          </div>
        </motion.div>

        {/* Notes Entries List */}
        <div className="flex flex-col gap-16 md:gap-24">
          {featuredNotes.map((note, index) => {
            const noteTarget = note.slug || note.id;
            const numberLabel = String(index + 1).padStart(2, '0');

            return (
              <motion.article
                key={note.id || index}
                className="project-entry group relative"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Subtle Huge Number (Desktop) */}
                  <div className="lg:col-span-1 hidden lg:block select-none">
                    <span className="text-[6vw] font-bold text-[var(--ink)]/5 leading-none transition-colors duration-500 group-hover:text-[var(--accent)]/15 font-['Space_Grotesk']">
                      {numberLabel}
                    </span>
                  </div>

                  {/* Note Details Column */}
                  <div className="lg:col-span-5 flex flex-col justify-center">
                    {/* Category Pill with Live Pulse */}
                    <p className="text-[var(--accent)] font-medium font-mono text-[10px] uppercase tracking-[0.28em] mb-4 flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-pulse" />
                      <span>
                        {note.category} · {note.readTime}
                      </span>
                    </p>

                    {/* Title */}
                    <h3
                      onClick={() => handleOpenNote(noteTarget)}
                      className="text-2xl md:text-3xl xl:text-4xl font-semibold mb-5 group-hover:text-[var(--accent)] transition-colors duration-300 text-[var(--ink)] leading-snug font-['Space_Grotesk'] cursor-pointer"
                    >
                      {note.title}
                    </h3>

                    {/* Summary Excerpt */}
                    <p className="text-[var(--muted)] text-base md:text-[1.02rem] leading-relaxed mb-6 font-normal">
                      {note.summary}
                    </p>

                    {/* Key Takeaways & Architecture Portions */}
                    {note.keyTakeaways && note.keyTakeaways.length > 0 && (
                      <div className="mb-6">
                        <p className="text-[10px] font-medium font-mono uppercase tracking-[0.2em] text-[var(--muted)] mb-2 underline decoration-[var(--accent)]/30">
                          Key Takeaways
                        </p>
                        <p className="text-sm font-medium text-[var(--ink)]/90 leading-relaxed">
                          {note.keyTakeaways.slice(0, 3).join(' | ')}
                        </p>
                      </div>
                    )}

                    {/* Tech & Topic Badges */}
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-8">
                        {note.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3.5 py-1.5 border border-[var(--line)] rounded-full text-[10px] font-medium font-mono text-[var(--muted)] uppercase tracking-wider bg-[var(--paper)] hover:border-[var(--accent)]/40 transition-colors"
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
                  <div className="lg:col-span-6 relative aspect-video overflow-hidden rounded-[2rem] border border-[var(--line)] shadow-xl shadow-black/[0.03] group/img bg-[var(--paper-dim)]">
                    <div
                      className="w-full h-full relative overflow-hidden cursor-pointer"
                      onClick={() => handleOpenNote(noteTarget)}
                    >
                      <img
                        alt={note.alt || note.caption || note.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
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
                              'bg-[var(--paper-dim)]'
                            );
                          }
                        }}
                      />

                      {/* Subtle Dark/Light Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover/img:opacity-70 transition-opacity duration-500 pointer-events-none" />

                      {/* Caption / Note Preview Badge */}
                      <div className="absolute bottom-5 left-5 px-3.5 py-1.5 bg-[var(--white)]/90 backdrop-blur-md rounded-xl border border-[var(--line)]/80 text-[9px] font-mono font-medium uppercase tracking-[0.25em] text-[var(--accent)] shadow-sm pointer-events-none">
                        FIELD DISPATCH PREVIEW
                      </div>

                      {/* Hover Circular Interactive Button */}
                      <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[var(--ink)] text-[var(--white)] flex items-center justify-center scale-0 group-hover/img:scale-100 transition-all duration-400 shadow-2xl shadow-black/30 z-20 group-hover/img:bg-[var(--accent)]"
                        title={`Open ${note.title}`}
                      >
                        <ArrowUpRight size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gradient Hairline Divider */}
                {index < featuredNotes.length - 1 && (
                  <div className="mt-16 md:mt-24 w-full h-px bg-gradient-to-r from-transparent via-[var(--line)] to-transparent" />
                )}
              </motion.article>
            );
          })}
        </div>

        {/* View All Lab Notes CTA */}
        <div className="mt-24 md:mt-32 flex justify-center">
          <button
            type="button"
            onClick={() => {
              // Smooth scroll to top when switching
              window.scrollTo({ top: 0, behavior: 'smooth' });
              onNavigate('lab-notes');
            }}
            className="group relative inline-flex items-center gap-4 px-10 py-5 bg-[var(--ink)] text-[var(--white)] rounded-full overflow-hidden transition-all duration-300 hover:gap-6 shadow-xl shadow-black/10 cursor-pointer border border-transparent"
            title="Browse all lab notes & post-mortems archive"
          >
            <span className="relative z-10 text-xs font-mono font-medium uppercase tracking-[0.3em]">
              View all Lab Notes
            </span>
            <ArrowUpRight
              size={18}
              className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
            <div className="absolute inset-0 bg-[var(--accent)] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};
