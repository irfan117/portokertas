import React, { useState, useEffect, useRef } from 'react';
import { RouteId } from '../../types';
import { usePortfolio } from '../../context/PortfolioContext';

interface ExperienceViewProps {
  onNavigate: (route: RouteId) => void;
}

export const ExperienceView: React.FC<ExperienceViewProps> = ({ onNavigate }) => {
  const { data } = usePortfolio();
  const { experienceSlides, careerList, caseStudies } = data;

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPaused || experienceSlides.length === 0) return;

    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % experienceSlides.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, experienceSlides.length]);

  const handleSlideChange = (index: number) => {
    setActiveSlide(index);
  };

  return (
    <div className="view-content">
      <div className="wrap section-head">
        <h2>Experience</h2>
        <p>A rough timeline of where I've worked and what I was mostly responsible for.</p>
      </div>

      <div
        className="wrap highlights"
        id="highlights"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="highlights__carousel">
          <div className="highlights__track">
            {experienceSlides.map((slide, idx) => (
              <div
                key={idx}
                className={`highlights__slide ${activeSlide === idx ? 'is-active' : ''}`}
              >
                <a
                  href={`#${slide.id}`}
                  data-route={slide.id}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(slide.id as RouteId);
                  }}
                >
                  <img src={slide.img} alt={slide.alt} />
                  <div className="highlights__caption">
                    <h4>{slide.captionTitle}</h4>
                    <p>{slide.captionSub}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>

          <div className="highlights__dots" id="hlDots">
            {experienceSlides.map((_, idx) => (
              <button
                key={idx}
                className={activeSlide === idx ? 'is-active' : ''}
                aria-label={`Show slide ${idx + 1}`}
                onClick={() => handleSlideChange(idx)}
              />
            ))}
          </div>
        </div>

        <div className="highlights__list">
          <ul className="highlights__tabs">
            <li className="is-active">Career history</li>
          </ul>
          <ul className="highlights__items" id="hlList">
            {careerList.map((item, idx) => (
              <li
                key={item.id}
                onMouseEnter={() => handleSlideChange(idx)}
              >
                <a
                  href={`#${item.id}`}
                  data-route={item.id}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.id as RouteId);
                  }}
                >
                  <span className="highlights__item-title">{item.title}</span>
                  <span className="highlights__item-date">{item.date}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="wrap timeline">
        {careerList.map((item) => {
          const study = caseStudies[item.id];
          return (
            <div className="timeline__item" key={item.id} id={`role-${item.id}`}>
              <div className="timeline__date">{item.date}</div>
              <div>
                <div className="timeline__role">{study ? study.role : item.title}</div>
                <div className="timeline__org">{study ? `${study.company} · ${study.subtitle}` : item.title}</div>
                <p className="timeline__desc">
                  {study ? study.leadParagraph1 : 'Detailed case study available below.'}
                </p>
                <p style={{ marginTop: '0.8rem' }}>
                  <a
                    href={`#${item.id}`}
                    data-route={item.id}
                    className="highlights__more"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.id as RouteId);
                    }}
                  >
                    Read case study →
                  </a>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

