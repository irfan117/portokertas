import React from 'react';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { RouteId } from '../../types';
import { usePortfolio } from '../../context/PortfolioContext';
import { getProjectGallery } from '../../lib/projectImages';

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

  // Ambil galeri gambar asli dari database tanpa duplikasi dan tanpa placeholder dummy
  const gallery = getProjectGallery(project);
  const heroImage = gallery[0];
  const extraImages = gallery.slice(1);

  return (
    <article className="wrap project-detail">
      <button className="case__back project-detail__back" onClick={() => onNavigate('work')}>
        <ArrowLeft size={15} />
        Back to Work
      </button>

      <p className="case__meta">{project.period || 'Project documentation'}</p>
      <h1 className="case__title">{project.title}</h1>

      {/* ── Gambar hero di atas deskripsi ── */}
      {heroImage && (
        <figure className="case-figure case-figure--hero project-detail__figure" style={{ marginTop: '2rem' }}>
          <img
            src={heroImage}
            alt={project.alt || project.title}
            loading="lazy"
          />
          {project.alt && <figcaption>{project.alt}</figcaption>}
        </figure>
      )}

      {/* ── Deskripsi project ── */}
      <p className="case__org">{project.desc}</p>

      {/* ── Action buttons ── */}
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
          {/* Gambar galeri tambahan (semua kecuali hero) */}
          {extraImages.map((image, index) => (
            <figure
              key={`${image}-${index}`}
              className="case-figure project-detail__figure"
            >
              <img
                src={image}
                alt={`${project.title} screenshot ${index + 2}`}
                loading="lazy"
              />
              <figcaption>{project.title} — gallery {index + 2}</figcaption>
            </figure>
          ))}

          {/* Jika tidak ada gambar sama sekali */}
          {gallery.length === 0 && (
            <p className="case__lead" style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
              Belum ada gambar untuk project ini.
            </p>
          )}
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
