import { useEffect } from 'react';

export function useParallax() {
  useEffect(() => {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let ticking = false;

    function updateParallax() {
      ticking = false;
      const parallaxEls = document.querySelectorAll<HTMLElement>('[data-parallax]');
      const vh = window.innerHeight;

      parallaxEls.forEach((el) => {
        const speedAttr = el.getAttribute('data-parallax-speed');
        const speed = speedAttr ? parseFloat(speedAttr) : 0.08;
        const dir = el.getAttribute('data-parallax-dir') || 'y';

        // Target container to measure in viewport (never use view-content/body)
        const container =
          (el.closest('.split-media, .split-parallax, .quote-bg') as HTMLElement) ||
          (el.parentElement?.classList.contains('view-content') ? el : el.parentElement) ||
          el;

        const rect = container.getBoundingClientRect();

        // Only compute if section is within or near the viewport
        if (rect.bottom < -80 || rect.top > vh + 80) return;

        // Container center relative to viewport center
        const containerCenter = rect.top + rect.height / 2;
        const viewportCenter = vh / 2;
        const rawOffset = (containerCenter - viewportCenter) * speed;

        // Carefully bound offset so parallax never exceeds bleed or exposes edges
        const maxOffset = Math.min(50, Math.max(25, rect.height * 0.15));
        const offset = Math.max(-maxOffset, Math.min(maxOffset, rawOffset));

        if (dir === 'bg') {
          el.style.backgroundPositionY = `calc(50% + ${offset.toFixed(1)}px)`;
        } else {
          el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        }
      });
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateParallax();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
}
