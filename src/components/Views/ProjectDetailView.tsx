import React from 'react';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { RouteId } from '../../types';
import { usePortfolio } from '../../context/PortfolioContext';

interface ProjectDetailViewProps {
  projectRouteId: RouteId;
  onNavigate: (route: RouteId) => void;
}

function getProjectIdFromRoute(routeId: RouteId) {
  const rawId = String(routeId).replace(/^project:/, '');
  try {
    return decodeURIComponent(rawId);
  } catch {
    return rawId;
  }
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ projectRouteId, onNavigate }) => {
  const { data } = usePortfolio();
  const projectId = getProjectIdFromRoute(projectRouteId);
  const project = data.workProjects.find((item) => item.id === projectId);

  if (!project) {
    return (
      <div className="wrap project-detail">
        <button className="case__back project-detail__back" onClick={() => onNavigate('work')}>
          <ArrowLeft size={15} />
          Back to Work
        </button>
        <p>Project not found.</p>
      </div>
    );
  }

  const gallery = Array.from(new Set([project.img, ...(project.images || [])].filter(Boolean)));

  return (
    <article className="wrap project-detail">
      <button className="case__back project-detail__back" onClick={() => onNavigate('work')}>
        <ArrowLeft size={15} />
        Back to Work
      </button>

      <p className="case__meta">{project.period || 'Project documentation'}</p>
      <h1 className="case__title">{project.title}</h1>
      <p className="case__org">{project.desc}</p>

      <div className="project-detail__actions">
        {project.github && (
          <a className="btn btn--ghost" href={project.github} target="_blank" rel="noopener noreferrer">
            <Github size={16} />
            <span>GitHub</span>
          </a>
        )}
        {project.demoUrl && (
          <a className="btn btn--primary" href={project.demoUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} />
            <span>Open Live</span>
          </a>
        )}
      </div>

      <div className="project-detail__layout">
        <div className="project-detail__main">
          {gallery.map((image, index) => (
            <figure key={`${image}-${index}`} className="case-figure project-detail__figure">
              <img src={image} alt={index === 0 ? project.alt || project.title : `${project.title} screenshot ${index + 1}`} />
              <figcaption>{index === 0 ? project.alt || project.title : `${project.title} gallery ${index + 1}`}</figcaption>
            </figure>
          ))}
        </div>

        <aside className="case-sidebar project-detail__sidebar">
          <h4>PROJECT INFO</h4>
          <div className="project-detail__chips">
            {project.tags.map((tag) => (
              <span key={tag} className="chip">{tag}</span>
            ))}
          </div>
          {project.highlights && project.highlights.length > 0 && (
            <>
              <h4>DETAILS</h4>
              <ul className="project-detail__list">
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </>
          )}
        </aside>
      </div>
    </article>
  );
};
