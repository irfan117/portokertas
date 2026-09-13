import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { WorkProject } from '../../../types';
import { Plus, Edit3, Trash2, FolderKanban } from 'lucide-react';
import { uploadImage } from '../../../lib/uploadImage';

interface WorkProjectsTabProps {
  showToast: (message: string) => void;
}

export const WorkProjectsTab: React.FC<WorkProjectsTabProps> = ({ showToast }) => {
  const { data, addWorkProject, editWorkProject, deleteWorkProject } = usePortfolio();

  // New project creation state
  const [newProject, setNewProject] = useState<Partial<WorkProject>>({
    id: '',
    title: '',
    desc: '',
    img: '',
    alt: '',
    tags: [],
    period: '',
    github: '',
    demoUrl: '',
    images: [],
    highlights: [],
  });
  const [newProjectTagsInput, setNewProjectTagsInput] = useState('');
  const [newProjectImagesInput, setNewProjectImagesInput] = useState('');
  const [newProjectHighlightsInput, setNewProjectHighlightsInput] = useState('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const parseCsv = (value: string) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const toCsv = (items?: string[]) => (Array.isArray(items) ? items.join(', ') : '');

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.desc) {
      alert('Please provide at least a title and description.');
      return;
    }

    const tagsArray = parseCsv(newProjectTagsInput);
    const imagesArray = parseCsv(newProjectImagesInput);
    const highlightsArray = newProjectHighlightsInput
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    const generatedId =
      newProject.id?.trim() ||
      newProject.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const projectId = generatedId || `project-${Date.now()}`;
    if (data.workProjects.some((project) => project.id === projectId)) {
      alert('Project ID already exists. Please use a different ID.');
      return;
    }

    const projectToAdd: WorkProject = {
      id: projectId,
      title: newProject.title,
      desc: newProject.desc,
      img:
        newProject.img ||
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      alt: newProject.alt || newProject.title,
      tags: tagsArray.length > 0 ? tagsArray : ['Engineering', 'Systems'],
      period: newProject.period?.trim() || undefined,
      github: newProject.github?.trim() || undefined,
      demoUrl: newProject.demoUrl?.trim() || undefined,
      images: imagesArray,
      highlights: highlightsArray,
    };

    addWorkProject(projectToAdd);
    setNewProject({ id: '', title: '', desc: '', img: '', alt: '', tags: [], period: '', github: '', demoUrl: '', images: [], highlights: [] });
    setNewProjectTagsInput('');
    setNewProjectImagesInput('');
    setNewProjectHighlightsInput('');
    showToast(`Work project "${projectToAdd.title}" created successfully`);
  };

  return (
    <div className="admin-section">
      {/* 1. Add New Work Project */}
      <div className="admin-card">
        <h2 className="admin-card-title">+ Add New Work Project</h2>
        <p className="admin-card-desc">
          Showcase a high-impact engineering system or technical case study on the homepage.
        </p>

        <form onSubmit={handleAddProject} className="admin-form">
          <div className="admin-grid-2">
            <div className="admin-field">
              <label>Project Title *</label>
              <input
                type="text"
                placeholder="e.g. Distributed Consensus Engine"
                value={newProject.title || ''}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label>Unique ID (leave blank to auto-generate)</label>
              <input
                type="text"
                placeholder="e.g. consensus-engine"
                value={newProject.id || ''}
                onChange={(e) => setNewProject({ ...newProject, id: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-field">
            <label>Description *</label>
            <textarea
              rows={3}
              placeholder="High-level description of architecture, throughput, and operational impact..."
              value={newProject.desc || ''}
              onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })}
            />
          </div>

          <div className="admin-grid-2">
            <div className="admin-field">
              <label>Cover Image URL (Unsplash or asset path)</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={newProject.img || ''}
                onChange={(e) => setNewProject({ ...newProject, img: e.target.value })}
              />
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    setNewProject({ ...newProject, img: await uploadImage(file) });
                    showToast('Gambar berhasil diunggah ke Cloudinary');
                  } catch (error) {
                    showToast(error instanceof Error ? error.message : 'Upload gambar gagal');
                  }
                }}
              />
            </div>
            <div className="admin-field">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                placeholder="Go, Raft, Distributed Systems, Low-Latency"
                value={newProjectTagsInput}
                onChange={(e) => setNewProjectTagsInput(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="admin-field">
              <label>Project Period</label>
              <input
                type="text"
                placeholder="e.g. 2026 — Present"
                value={newProject.period || ''}
                onChange={(e) => setNewProject({ ...newProject, period: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label>GitHub URL</label>
              <input
                type="url"
                placeholder="https://github.com/username/repo"
                value={newProject.github || ''}
                onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-field">
            <label>Live Website URL (leave empty for local detail page)</label>
            <input
              type="url"
              placeholder="https://example.com"
              value={newProject.demoUrl || ''}
              onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
            />
          </div>

          <div className="admin-field">
            <label>Gallery Image URLs (comma separated)</label>
            <textarea
              rows={2}
              placeholder="https://res.cloudinary.com/.../image-1.jpg, https://res.cloudinary.com/.../image-2.jpg"
              value={newProjectImagesInput}
              onChange={(e) => setNewProjectImagesInput(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                if (files.length === 0) return;
                try {
                  const urls = await Promise.all(files.map(uploadImage));
                  setNewProjectImagesInput((current) => [current, ...urls].filter(Boolean).join(', '));
                  showToast('Galeri project berhasil diunggah ke Cloudinary');
                } catch (error) {
                  showToast(error instanceof Error ? error.message : 'Upload galeri gagal');
                }
              }}
            />
          </div>

          <div className="admin-field">
            <label>Detail Highlights (one per line)</label>
            <textarea
              rows={3}
              placeholder="Built RAG retrieval API&#10;Added Redis semantic cache&#10;Shipped admin dashboard"
              value={newProjectHighlightsInput}
              onChange={(e) => setNewProjectHighlightsInput(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn--primary"
            style={{ alignSelf: 'flex-start' }}
          >
            <Plus size={14} />
            <span>Publish Project</span>
          </button>
        </form>
      </div>

      {/* 2. Existing Projects List */}
      <div className="admin-card">
        <h2 className="admin-card-title">
          Existing Work Projects ({data.workProjects.length})
        </h2>
        <div className="admin-items-list">
          {data.workProjects.map((project) => (
            <div key={project.id} className="admin-item-row">
              <img
                src={project.img}
                alt={project.alt || project.title}
                style={{
                  width: '90px',
                  height: '65px',
                  objectFit: 'cover',
                  borderRadius: '2px',
                  border: '1px solid var(--line)',
                }}
              />
              <div className="admin-item-content">
                {editingProjectId === project.id ? (
                  <div className="admin-edit-inline">
                    <div className="admin-field">
                      <label>Title</label>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) =>
                          editWorkProject(project.id, { title: e.target.value })
                        }
                      />
                    </div>
                    <div className="admin-field">
                      <label>Description</label>
                      <textarea
                        rows={2}
                        value={project.desc}
                        onChange={(e) =>
                          editWorkProject(project.id, { desc: e.target.value })
                        }
                      />
                    </div>
                    <div className="admin-grid-2">
                      <div className="admin-field">
                        <label>Cover Image URL</label>
                        <input
                          type="text"
                          value={project.img}
                          onChange={(e) => editWorkProject(project.id, { img: e.target.value })}
                        />
                      </div>
                      <div className="admin-field">
                        <label>Alt Text</label>
                        <input
                          type="text"
                          value={project.alt}
                          onChange={(e) => editWorkProject(project.id, { alt: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="admin-grid-2">
                      <div className="admin-field">
                        <label>Period</label>
                        <input
                          type="text"
                          value={project.period || ''}
                          onChange={(e) => editWorkProject(project.id, { period: e.target.value })}
                        />
                      </div>
                      <div className="admin-field">
                        <label>Tags</label>
                        <input
                          type="text"
                          value={toCsv(project.tags)}
                          onChange={(e) => editWorkProject(project.id, { tags: parseCsv(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div className="admin-grid-2">
                      <div className="admin-field">
                        <label>GitHub URL</label>
                        <input
                          type="url"
                          value={project.github || ''}
                          onChange={(e) => editWorkProject(project.id, { github: e.target.value })}
                        />
                      </div>
                      <div className="admin-field">
                        <label>Live Website URL</label>
                        <input
                          type="url"
                          value={project.demoUrl || ''}
                          onChange={(e) => editWorkProject(project.id, { demoUrl: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="admin-field">
                      <label>Gallery Image URLs</label>
                      <textarea
                        rows={2}
                        value={toCsv(project.images)}
                        onChange={(e) => editWorkProject(project.id, { images: parseCsv(e.target.value) })}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length === 0) return;
                          try {
                            const urls = await Promise.all(files.map(uploadImage));
                            editWorkProject(project.id, { images: [...(project.images || []), ...urls] });
                            showToast('Galeri project berhasil diunggah ke Cloudinary');
                          } catch (error) {
                            showToast(error instanceof Error ? error.message : 'Upload galeri gagal');
                          }
                        }}
                      />
                    </div>
                    <div className="admin-field">
                      <label>Detail Highlights</label>
                      <textarea
                        rows={3}
                        value={(project.highlights || []).join('\n')}
                        onChange={(e) =>
                          editWorkProject(project.id, {
                            highlights: e.target.value
                              .split('\n')
                              .map((item) => item.trim())
                              .filter(Boolean),
                          })
                        }
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn--primary"
                      style={{
                        padding: '0.35rem 0.8rem',
                        fontSize: '0.85rem',
                        alignSelf: 'flex-start',
                      }}
                      onClick={() => {
                        setEditingProjectId(null);
                        showToast('Project updated');
                      }}
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="admin-item-header">
                      <h3>{project.title}</h3>
                      <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                        #{project.id}
                      </span>
                    </div>
                    <p className="admin-item-desc">{project.desc}</p>
                    <div className="admin-tags-wrap">
                      {project.tags.map((t, idx) => (
                        <span key={idx} className="admin-tag-pill">
                          {t}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="admin-item-actions">
                {editingProjectId !== project.id && (
                  <button
                    className="admin-action-btn"
                    onClick={() => setEditingProjectId(project.id)}
                  >
                    <Edit3 size={12} />
                    <span>Edit</span>
                  </button>
                )}
                <button
                  className="admin-action-btn danger"
                  onClick={() => {
                    if (window.confirm(`Delete project "${project.title}"?`)) {
                      deleteWorkProject(project.id);
                      showToast('Project deleted');
                    }
                  }}
                >
                  <Trash2 size={12} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
