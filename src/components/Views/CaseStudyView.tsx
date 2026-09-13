import React from 'react';
import { RouteId } from '../../types';
import { usePortfolio } from '../../context/PortfolioContext';

interface CaseStudyViewProps {
  routeId: RouteId;
  onNavigate: (route: RouteId) => void;
}

export const CaseStudyView: React.FC<CaseStudyViewProps> = ({ routeId, onNavigate }) => {
  const { data } = usePortfolio();
  const { caseStudies, careerList } = data;
  const caseStudy = caseStudies[routeId];

  if (!caseStudy) {
    return (
      <div className="wrap case">
        <p>Case study not found.</p>
        <a
          href="#experience"
          className="case__back"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('experience');
          }}
        >
          ← Back to Experience
        </a>
      </div>
    );
  }

  return (
    <article className="wrap case">
      <a
        href="#experience"
        className="case__back"
        data-route="experience"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('experience');
        }}
      >
        ← Back to Experience
      </a>

      <p className="case__meta">{caseStudy.period}</p>
      <h1 className="case__title">{caseStudy.role}</h1>
      <p className="case__org">{caseStudy.subtitle}</p>

      <div className="case-layout">
        <div>
          <figure className="case-figure case-figure--hero">
            <img src={caseStudy.heroImage} alt={caseStudy.heroCaption} />
            <figcaption>{caseStudy.heroCaption}</figcaption>
          </figure>

          <p className="case__lead">{caseStudy.leadParagraph1}</p>

          {caseStudy.midImage && (
            <figure className="case-figure">
              <img src={caseStudy.midImage} alt={caseStudy.midCaption} />
              <figcaption>{caseStudy.midCaption}</figcaption>
            </figure>
          )}

          {caseStudy.leadParagraph2 && (
            <p className="case__lead">{caseStudy.leadParagraph2}</p>
          )}

          <ul className="case__list">
            {caseStudy.bulletPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>

          {caseStudy.endImage && (
            <figure className="case-figure">
              <img src={caseStudy.endImage} alt={caseStudy.endCaption} />
              <figcaption>{caseStudy.endCaption}</figcaption>
            </figure>
          )}

          <nav className="case__nav" aria-label="Other roles">
            {caseStudy.prev ? (
              <a
                href={`#${caseStudy.prev.id}`}
                data-route={caseStudy.prev.id}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(caseStudy.prev!.id);
                }}
              >
                <span className="dir">← Previous</span>
                {caseStudy.prev.label}
              </a>
            ) : (
              <span />
            )}

            {caseStudy.next && (
              <a
                href={`#${caseStudy.next.id}`}
                className="to-next"
                data-route={caseStudy.next.id}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(caseStudy.next!.id);
                }}
              >
                <span className="dir">Next →</span>
                {caseStudy.next.label}
              </a>
            )}
          </nav>
        </div>

        <aside className="case-sidebar" aria-label="Career history navigation">
          <h4>ALL ROLES</h4>
          <ul>
            {careerList.map((item) => (
              <li
                key={item.id}
                className={routeId === item.id ? 'is-current' : ''}
              >
                <a
                  href={`#${item.id}`}
                  data-route={item.id}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.id as RouteId);
                  }}
                >
                  <span>{item.title.split(' — ')[0]}</span>
                  <span className="case-sidebar__date">{item.date}</span>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </article>
  );
};

