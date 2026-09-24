import React from 'react';
import { ArrowRight } from 'lucide-react';
import { RouteId, WorkProject } from '../../types';
import { usePortfolio } from '../../context/PortfolioContext';
import { getProjectDisplayImage } from '../../lib/projectImages';

interface WorkViewProps {
  onNavigate?: (route: RouteId) => void;
}

export function projectDetailRoute(id: string): RouteId {
  return `project:${encodeURIComponent(id)}` as RouteId;
}

function getProjectHref(project: WorkProject) {
  return `#${projectDetailRoute(project.id)}`;
}

function ProjectImage({ project, compact = false }: { project: WorkProject; compact?: boolean }) {
  const displayImage = getProjectDisplayImage(project);
  return (
    <div className={compact ? 'proj-preview-inner' : 'proj-card-art proj-card-art-svg'}>
      <img className="artwork" src={displayImage} alt={project.alt || project.title} loading="lazy" />
      <div className="proj-preview-overlay">
        <div className="mono-sm">{project.tags.slice(0, 4).join(' · ') || 'Project documentation'}</div>
      </div>
    </div>
  );
}

function ProjectAnchor({
  project,
  className,
  children,
  onNavigate,
}: {
  project: WorkProject;
  className: string;
  children: React.ReactNode;
  onNavigate?: (route: RouteId) => void;
}) {
  const route = projectDetailRoute(project.id);

  return (
    <a
      href={getProjectHref(project)}
      className={className}
      onClick={(e) => {
        if (!onNavigate) return;
        e.preventDefault();
        onNavigate(route);
      }}
    >
      {children}
    </a>
  );
}

export const WorkView: React.FC<WorkViewProps> = ({ onNavigate }) => {
  const { data } = usePortfolio();
  const projects = data.workProjects;
  const featuredProjects = projects.slice(0, Math.min(3, projects.length));

  const scrollToGrid = (e: React.MouseEvent) => {
    e.preventDefault();
    const gridEl = document.getElementById('grid');
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="view-content">
      <section className="section featured" id="work">
        <div className="section-bleed is-outline">
          <div className="section-bleed-text">FEATURED · WORK</div>
        </div>

        <div className="section-header">
          <div className="section-label">
            <span className="section-num">04</span>
            <span className="section-bar" />
            <span className="section-name">
              <span>Featured Work</span>
            </span>
          </div>
          <a className="section-link" href="#grid" onClick={scrollToGrid}>
            all projects →
          </a>
        </div>

        <div className="featured-list">
          {featuredProjects.length === 0 ? (
            <div className="work-empty">No work projects published yet.</div>
          ) : (
            featuredProjects.map((project, index) => (
              <ProjectAnchor
                key={project.id}
                project={project}
                className="proj-row"
                onNavigate={onNavigate}
              >
                <div className="proj-row-index">{String(index + 1).padStart(2, '0')}</div>
                <div className="proj-row-title">
                  <div className="proj-period mono-sm">{project.period || 'Selected project'}</div>
                  <h3 className="proj-name">{project.title}</h3>
                  <div className="proj-tagline">{project.desc}</div>
                </div>
                <div className="proj-row-preview">
                  <ProjectImage project={project} compact />
                </div>
                <div className="proj-row-arrow">
                  <ArrowRight size={22} />
                </div>
              </ProjectAnchor>
            ))
          )}
        </div>
      </section>

      <section className="section grid-sec" id="grid">
        <div className="section-bleed is-solid">
          <div className="section-bleed-text">MORE · MORE · MORE</div>
        </div>

        <div className="section-header">
          <div className="section-label">
            <span className="section-num">05</span>
            <span className="section-bar" />
            <span className="section-name">
              <span>All Projects</span>
            </span>
          </div>
          <span className="mono-sm muted">{projects.length} total</span>
        </div>

        <div className="proj-grid">
          {projects.map((project) => (
            <div key={project.id} className="proj-card-wrap rv-reveal is-shown">
              <ProjectAnchor project={project} className="proj-card" onNavigate={onNavigate}>
                <ProjectImage project={project} />
                <div className="proj-card-body">
                  <div className="mono-sm muted">{project.period || 'Project detail'}</div>
                  <div className="proj-card-title">{project.title}</div>
                  <div className="proj-card-tag">{project.desc}</div>
                  <div className="proj-card-chips">
                    {project.tags.slice(0, 5).map((tag) => (
                      <span key={tag} className="chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </ProjectAnchor>
            </div>
          ))}
        </div>
      </section>

      <div className="wrap" style={{ paddingBottom: '6rem', paddingTop: '4rem' }}>
        <div className="work-footer-cta">
          <div>
            <h3>Looking for more technical field notes?</h3>
            <p>Check out the engineering post-mortems and whiteboard logs on the home page.</p>
          </div>
          <button
            onClick={() => {
              if (onNavigate) onNavigate('home');
              window.location.hash = 'lab-notes';
            }}
            className="copy-btn"
          >
            <span>View Lab Notes on Home</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
