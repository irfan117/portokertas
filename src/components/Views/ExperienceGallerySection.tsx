import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CaseStudy, RouteId } from '../../types';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ExternalLink,
  ZoomIn
} from 'lucide-react';

interface ExperienceDocItem {
  id: string;
  img: string;
  thumbnail: string;
  title: string;
  caption: string;
  roleCompany: string;
  year: string;
  caseStudyId?: string;
  width: number;
  height: number;
  aspectRatioClass?: string;
}

interface ExperienceGallerySectionProps {
  onNavigate: (route: RouteId) => void;
}

export const ExperienceGallerySection: React.FC<ExperienceGallerySectionProps> = ({ onNavigate }) => {
  const { data } = usePortfolio();
  const { caseStudies, experienceSlides } = data;

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Compile all authentic documentation photos from Experience & Case Studies
  const galleryItems: ExperienceDocItem[] = useMemo(() => {
    const items: ExperienceDocItem[] = [];
    const seenUrls = new Set<string>();

    const addItem = (item: ExperienceDocItem) => {
      if (!seenUrls.has(item.img)) {
        seenUrls.add(item.img);
        items.push(item);
      }
    };

    // 1. Items from Case Studies
    (Object.entries(caseStudies) as [string, CaseStudy][]).forEach(([id, cs]) => {
      if (cs.endImage) {
        addItem({
          id: `cs-${id}-end`,
          img: cs.endImage,
          thumbnail: cs.endImage,
          title: cs.endCaption || cs.subtitle,
          caption: cs.endCaption || `${cs.role} · ${cs.company}`,
          roleCompany: `${cs.role} · ${cs.company}`,
          year: cs.period.split('·')[0].trim() || '2025',
          caseStudyId: id,
          width: 1200,
          height: 800,
          aspectRatioClass: 'aspect-portrait',
        });
      }
      if (cs.midImage) {
        addItem({
          id: `cs-${id}-mid`,
          img: cs.midImage,
          thumbnail: cs.midImage,
          title: cs.midCaption || cs.subtitle,
          caption: cs.midCaption || `${cs.role} · ${cs.company}`,
          roleCompany: `${cs.role} · ${cs.company}`,
          year: cs.period.split('·')[0].trim() || '2025',
          caseStudyId: id,
          width: 1200,
          height: 800,
          aspectRatioClass: 'aspect-landscape',
        });
      }
      if (cs.heroImage) {
        addItem({
          id: `cs-${id}-hero`,
          img: cs.heroImage,
          thumbnail: cs.heroImage,
          title: cs.heroCaption || cs.role,
          caption: cs.heroCaption || cs.subtitle,
          roleCompany: `${cs.role} · ${cs.company}`,
          year: cs.period.split('·')[0].trim() || '2025',
          caseStudyId: id,
          width: 800,
          height: 1200,
          aspectRatioClass: 'aspect-tall',
        });
      }
    });

    // Include any additional slides from experienceSlides
    experienceSlides.forEach((slide, idx) => {
      if (!seenUrls.has(slide.img)) {
        addItem({
          id: `slide-${idx}`,
          img: slide.img,
          thumbnail: slide.img,
          title: slide.captionTitle,
          caption: slide.captionSub,
          roleCompany: slide.roleTitle,
          year: slide.date,
          caseStudyId: slide.id,
          width: 1200,
          height: 800,
          aspectRatioClass: idx % 2 === 0 ? 'aspect-tall' : 'aspect-portrait',
        });
      }
    });

    return items;
  }, [caseStudies, experienceSlides]);

  // Distribute items into 5 vertical columns that adapt to screen size:
  // Mobile: 2 columns visible
  // Tablet: 3 columns visible
  // Desktop: 4 columns visible
  // Wide Desktop: 5 columns visible
  const columns = useMemo(() => {
    const rawCols: ExperienceDocItem[][] = [[], [], [], [], []];

    galleryItems.forEach((item, index) => {
      rawCols[index % 5].push(item);
    });

    // Helper to ensure each column has sufficient height for continuous looping
    const buildLoopCol = (items: ExperienceDocItem[]) => {
      if (items.length === 0) return [];
      let base = [...items];
      while (base.length < 6) {
        base = [...base, ...items];
      }
      // Duplicate for seamless 0 -> -50% loop
      return [...base, ...base];
    };

    return rawCols.map((c) => buildLoopCol(c));
  }, [galleryItems]);

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  }, []);

  const nextLightbox = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => ((prev ?? 0) + 1) % galleryItems.length);
    }
  }, [lightboxIndex, galleryItems.length]);

  const prevLightbox = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => ((prev ?? 0) - 1 + galleryItems.length) % galleryItems.length);
    }
  }, [lightboxIndex, galleryItems.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowRight') nextLightbox();
      else if (e.key === 'ArrowLeft') prevLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, closeLightbox, nextLightbox, prevLightbox]);

  const activeItem = lightboxIndex !== null ? galleryItems[lightboxIndex] : null;

  return (
    <section className="elementor-experience-gallery-wrap">
      {/* SECTION HEADER (CLEAN: 3 TOMBOL DIHAPUS) */}
      <div className="wrap section-head" style={{ paddingBottom: '1.2rem' }}>
        <p className="eyebrow" style={{ color: 'var(--accent)', letterSpacing: '0.08em' }}>
          Dokumentasi &amp; Field Gallery
        </p>
        <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginTop: '0.3rem' }}>
          My Experience
        </h2>
        <p style={{ maxWidth: '65ch', marginTop: '0.6rem', color: 'var(--muted)' }}>
          Bebebrapa dokumentasi yang merupakakan tetnang bagaimana saya mendapat pengalaman yang bermanfaat dan menyenangkan   </p>
      </div>

      {/* ELEMENTOR WIDGET CONTAINER */}
      <div
        className="elementor-element elementor-element-61efadb elementor-widget elementor-widget-gallery"
        data-id="61efadb"
        data-element_type="widget"
        data-e-type="widget"
        data-settings='{"gallery_layout":"masonry","columns":2,"gap":{"unit":"px","size":8,"sizes":[]},"columns_mobile":2,"columns_tablet":3,"gap_tablet":{"unit":"px","size":10,"sizes":[]},"gap_mobile":{"unit":"px","size":10,"sizes":[]},"link_to":"file","overlay_background":"yes","content_hover_animation":"fade-in"}'
        data-widget_type="gallery.default"
      >
        <div className="wrap" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
          {/* ==========================================================
             VERTICAL CONTINUOUS AUTO-LOOPING MASONRY STREAMS
             - Column 1: Moves UP (always visible)
             - Column 2: Moves DOWN (always visible)
             - Column 3: Moves UP (visible on tablet and desktop)
             - Column 4: Moves DOWN (visible on desktop)
             - Column 5: Moves UP (visible on wide desktop)
             ========================================================== */}
          <div className="e-vertical-stream-container">
            {/* COLUMN 1 */}
            <div className="e-vcol e-vcol--1">
              <div className="e-vtrack e-vtrack--up" style={{ '--duration': '52s' } as React.CSSProperties}>
                {columns[0].map((item, idx) => {
                  const globalIdx = galleryItems.findIndex((g) => g.id === item.id);
                  return (
                    <a
                      key={`col1-${idx}`}
                      className="e-gallery-item elementor-gallery-item elementor-animated-content pinvite-masuk-sekarang"
                      href={item.img}
                      data-elementor-open-lightbox="yes"
                      data-elementor-lightbox-slideshow="61efadb"
                      data-elementor-lightbox-title={item.title}
                      onClick={(e) => {
                        e.preventDefault();
                        openLightbox(globalIdx >= 0 ? globalIdx : 0);
                      }}
                    >
                      <div
                        className={`e-gallery-image elementor-gallery-item__image ${item.aspectRatioClass || 'aspect-portrait'}`}
                        data-thumbnail={item.thumbnail}
                        data-width={item.width}
                        data-height={item.height}
                        aria-label={item.title}
                        role="img"
                        style={{ backgroundImage: `url("${item.img}")` }}
                      />
                      <div className="elementor-gallery-item__overlay">
                        <div className="e-overlay-content">
                          <span className="e-overlay-tag">{item.roleCompany}</span>
                          <h4 className="e-overlay-title">{item.title}</h4>
                          <span className="e-overlay-zoom">
                            <ZoomIn size={14} /> Perbesar foto
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 2 */}
            <div className="e-vcol e-vcol--2">
              <div className="e-vtrack e-vtrack--down" style={{ '--duration': '46s' } as React.CSSProperties}>
                {columns[1].map((item, idx) => {
                  const globalIdx = galleryItems.findIndex((g) => g.id === item.id);
                  return (
                    <a
                      key={`col2-${idx}`}
                      className="e-gallery-item elementor-gallery-item elementor-animated-content pinvite-masuk-sekarang"
                      href={item.img}
                      data-elementor-open-lightbox="yes"
                      data-elementor-lightbox-slideshow="61efadb"
                      data-elementor-lightbox-title={item.title}
                      onClick={(e) => {
                        e.preventDefault();
                        openLightbox(globalIdx >= 0 ? globalIdx : 0);
                      }}
                    >
                      <div
                        className={`e-gallery-image elementor-gallery-item__image ${item.aspectRatioClass || 'aspect-tall'}`}
                        data-thumbnail={item.thumbnail}
                        data-width={item.width}
                        data-height={item.height}
                        aria-label={item.title}
                        role="img"
                        style={{ backgroundImage: `url("${item.img}")` }}
                      />
                      <div className="elementor-gallery-item__overlay">
                        <div className="e-overlay-content">
                          <span className="e-overlay-tag">{item.roleCompany}</span>
                          <h4 className="e-overlay-title">{item.title}</h4>
                          <span className="e-overlay-zoom">
                            <ZoomIn size={14} /> Perbesar foto
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 3 (Tablet & Desktop) */}
            <div className="e-vcol e-vcol--3">
              <div className="e-vtrack e-vtrack--up" style={{ '--duration': '58s' } as React.CSSProperties}>
                {columns[2].map((item, idx) => {
                  const globalIdx = galleryItems.findIndex((g) => g.id === item.id);
                  return (
                    <a
                      key={`col3-${idx}`}
                      className="e-gallery-item elementor-gallery-item elementor-animated-content pinvite-masuk-sekarang"
                      href={item.img}
                      data-elementor-open-lightbox="yes"
                      data-elementor-lightbox-slideshow="61efadb"
                      data-elementor-lightbox-title={item.title}
                      onClick={(e) => {
                        e.preventDefault();
                        openLightbox(globalIdx >= 0 ? globalIdx : 0);
                      }}
                    >
                      <div
                        className={`e-gallery-image elementor-gallery-item__image ${item.aspectRatioClass || 'aspect-square'}`}
                        data-thumbnail={item.thumbnail}
                        data-width={item.width}
                        data-height={item.height}
                        aria-label={item.title}
                        role="img"
                        style={{ backgroundImage: `url("${item.img}")` }}
                      />
                      <div className="elementor-gallery-item__overlay">
                        <div className="e-overlay-content">
                          <span className="e-overlay-tag">{item.roleCompany}</span>
                          <h4 className="e-overlay-title">{item.title}</h4>
                          <span className="e-overlay-zoom">
                            <ZoomIn size={14} /> Perbesar foto
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 4 (Desktop) */}
            <div className="e-vcol e-vcol--4">
              <div className="e-vtrack e-vtrack--down" style={{ '--duration': '50s' } as React.CSSProperties}>
                {columns[3].map((item, idx) => {
                  const globalIdx = galleryItems.findIndex((g) => g.id === item.id);
                  return (
                    <a
                      key={`col4-${idx}`}
                      className="e-gallery-item elementor-gallery-item elementor-animated-content pinvite-masuk-sekarang"
                      href={item.img}
                      data-elementor-open-lightbox="yes"
                      data-elementor-lightbox-slideshow="61efadb"
                      data-elementor-lightbox-title={item.title}
                      onClick={(e) => {
                        e.preventDefault();
                        openLightbox(globalIdx >= 0 ? globalIdx : 0);
                      }}
                    >
                      <div
                        className={`e-gallery-image elementor-gallery-item__image ${item.aspectRatioClass || 'aspect-portrait'}`}
                        data-thumbnail={item.thumbnail}
                        data-width={item.width}
                        data-height={item.height}
                        aria-label={item.title}
                        role="img"
                        style={{ backgroundImage: `url("${item.img}")` }}
                      />
                      <div className="elementor-gallery-item__overlay">
                        <div className="e-overlay-content">
                          <span className="e-overlay-tag">{item.roleCompany}</span>
                          <h4 className="e-overlay-title">{item.title}</h4>
                          <span className="e-overlay-zoom">
                            <ZoomIn size={14} /> Perbesar foto
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 5 (Wide Desktop) */}
            <div className="e-vcol e-vcol--5">
              <div className="e-vtrack e-vtrack--up" style={{ '--duration': '54s' } as React.CSSProperties}>
                {columns[4].map((item, idx) => {
                  const globalIdx = galleryItems.findIndex((g) => g.id === item.id);
                  return (
                    <a
                      key={`col5-${idx}`}
                      className="e-gallery-item elementor-gallery-item elementor-animated-content pinvite-masuk-sekarang"
                      href={item.img}
                      data-elementor-open-lightbox="yes"
                      data-elementor-lightbox-slideshow="61efadb"
                      data-elementor-lightbox-title={item.title}
                      onClick={(e) => {
                        e.preventDefault();
                        openLightbox(globalIdx >= 0 ? globalIdx : 0);
                      }}
                    >
                      <div
                        className={`e-gallery-image elementor-gallery-item__image ${item.aspectRatioClass || 'aspect-tall'}`}
                        data-thumbnail={item.thumbnail}
                        data-width={item.width}
                        data-height={item.height}
                        aria-label={item.title}
                        role="img"
                        style={{ backgroundImage: `url("${item.img}")` }}
                      />
                      <div className="elementor-gallery-item__overlay">
                        <div className="e-overlay-content">
                          <span className="e-overlay-tag">{item.roleCompany}</span>
                          <h4 className="e-overlay-title">{item.title}</h4>
                          <span className="e-overlay-zoom">
                            <ZoomIn size={14} /> Perbesar foto
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================
         ELEMENTOR-STYLE LIGHTBOX MODAL DIALOG
         ========================================================== */}
      {activeItem && lightboxIndex !== null && (
        <div
          className="elementor-lightbox-dialog"
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          onClick={closeLightbox}
        >
          {/* Backdrop Blur */}
          <div className="elementor-lightbox-backdrop" />

          {/* Dialog Container */}
          <div
            className="elementor-lightbox-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div className="elementor-lightbox-header">
              <div className="elementor-lightbox-counter mono">
                {lightboxIndex + 1} / {galleryItems.length}
              </div>

              <div className="elementor-lightbox-actions">
                {activeItem.caseStudyId && (
                  <button
                    className="elementor-lightbox-btn"
                    onClick={() => {
                      closeLightbox();
                      onNavigate(activeItem.caseStudyId as RouteId);
                    }}
                    title="Buka studi kasus lengkap"
                  >
                    <ExternalLink size={15} />
                    <span>Lihat Case Study</span>
                  </button>
                )}

                <button
                  className="elementor-lightbox-btn"
                  onClick={() => window.open(activeItem.img, '_blank')}
                  title="Lihat ukuran asli"
                >
                  <Maximize2 size={15} />
                </button>

                <button
                  className="elementor-lightbox-btn elementor-lightbox-btn--close"
                  onClick={closeLightbox}
                  title="Tutup (Esc)"
                  aria-label="Close Lightbox"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Main Image Stage */}
            <div className="elementor-lightbox-body">
              {/* Prev Button */}
              <button
                className="elementor-lightbox-nav elementor-lightbox-nav--prev"
                onClick={prevLightbox}
                aria-label="Previous image"
                title="Foto sebelumnya (Left Arrow)"
              >
                <ChevronLeft size={28} />
              </button>

              {/* Image */}
              <div className="elementor-lightbox-image-wrap">
                <img
                  src={activeItem.img}
                  alt={activeItem.title}
                  className="elementor-lightbox-image"
                />
              </div>

              {/* Next Button */}
              <button
                className="elementor-lightbox-nav elementor-lightbox-nav--next"
                onClick={nextLightbox}
                aria-label="Next image"
                title="Foto berikutnya (Right Arrow)"
              >
                <ChevronRight size={28} />
              </button>
            </div>

            {/* Bottom Details Footer */}
            <div className="elementor-lightbox-footer">
              <div className="elementor-lightbox-meta">
                <span className="mono elementor-lightbox-role">
                  {activeItem.roleCompany} · {activeItem.year}
                </span>
                <h3 className="elementor-lightbox-title">{activeItem.title}</h3>
                <p className="elementor-lightbox-caption">{activeItem.caption}</p>
              </div>

              {activeItem.caseStudyId && (
                <button
                  className="copy-btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.84rem',
                    padding: '0.45rem 0.9rem',
                    flexShrink: 0
                  }}
                  onClick={() => {
                    closeLightbox();
                    onNavigate(activeItem.caseStudyId as RouteId);
                  }}
                >
                  Baca Case Study <ExternalLink size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
