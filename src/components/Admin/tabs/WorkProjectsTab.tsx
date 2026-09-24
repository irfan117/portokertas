import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { WorkProject } from '../../../types';
import { Plus, Edit3, Trash2, X, Upload } from 'lucide-react';
import { uploadImage } from '../../../lib/uploadImage';

interface WorkProjectsTabProps {
  showToast: (message: string) => void;
}

const DEFAULT_PLACEHOLDER =
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80';

/* ── Reusable image thumbnail strip ── */
function ImageStrip({
  label,
  images,
  onRemove,
  onUpload,
  onUrlChange,
  multiple = false,
  urlValue,
}: {
  label: string;
  images: string[];
  onRemove: (index: number) => void;
  onUpload: (files: File[]) => void;
  onUrlChange?: (url: string) => void;
  multiple?: boolean;
  urlValue?: string;
}) {
  return (
    <div className="admin-field">
      <label>{label}</label>

      {/* URL text input (only for cover / single) */}
      {onUrlChange !== undefined && (
        <input
          type="text"
          placeholder="https://images.unsplash.com/... atau upload di bawah"
          value={urlValue || ''}
          onChange={(e) => onUrlChange(e.target.value)}
        />
      )}

      {/* Existing images as thumbnails */}
      {images.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
          {images.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              style={{ position: 'relative', display: 'inline-block', flexShrink: 0 }}
            >
              <img
                src={url}
                alt={`Image ${idx + 1}`}
                style={{
                  width: '90px',
                  height: '65px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  border: '1px solid var(--line)',
                  display: 'block',
                }}
              />
              <button
                type="button"
                title="Hapus gambar ini"
                onClick={() => onRemove(idx)}
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#e53e3e',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  lineHeight: 1,
                  zIndex: 2,
                }}
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <label
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          marginTop: '0.5rem',
          padding: '0.35rem 0.8rem',
          background: 'var(--paper-dim)',
          border: '1px solid var(--line)',
          borderRadius: '3px',
          cursor: 'pointer',
          fontSize: '0.82rem',
          color: 'var(--ink)',
        }}
      >
        <Upload size={13} />
        {multiple ? 'Upload gambar galeri' : 'Upload cover image'}
        <input
          type="file"
          accept="image/*,image/png,image/jpeg,image/webp"
          multiple={multiple}
          style={{ display: 'none' }}
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length > 0) onUpload(files);
            e.target.value = '';
          }}
        />
      </label>
    </div>
  );
}

/* ── Main tab ── */
export const WorkProjectsTab: React.FC<WorkProjectsTabProps> = ({ showToast }) => {
  const { data, addWorkProject, editWorkProject, deleteWorkProject } = usePortfolio();

  /* New project form state */
  const [newProject, setNewProject] = useState<Partial<WorkProject>>({
    id: '', title: '', desc: '', img: '', alt: '',
    tags: [], period: '', github: '', demoUrl: '', images: [], highlights: [],
  });
  const [newTagsInput, setNewTagsInput] = useState('');
  const [newHighlightsInput, setNewHighlightsInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<string | null>(null); // projectId or 'new'

  const parseCsv = (v: string) => v.split(',').map((s) => s.trim()).filter(Boolean);
  const toCsv = (items?: string[]) => (Array.isArray(items) ? items.join(', ') : '');

  /* ── Upload helpers ── */
  async function doUpload(
    files: File[],
    onSuccess: (urls: string[]) => void,
    context: string,
  ) {
    setIsUploading(context);
    try {
      const urls = await Promise.all(files.map(uploadImage));
      onSuccess(urls);
      showToast(`${urls.length} gambar berhasil diunggah ke Cloudinary`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Upload gambar gagal');
    } finally {
      setIsUploading(null);
    }
  }

  /* ── Submit new project ── */
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.desc) {
      alert('Judul dan deskripsi wajib diisi.');
      return;
    }

    const tagsArray = parseCsv(newTagsInput);
    const highlightsArray = newHighlightsInput.split('\n').map((s) => s.trim()).filter(Boolean);
    const generatedId =
      newProject.id?.trim() ||
      (newProject.title || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') ||
      `project-${Date.now()}`;

    if (data.workProjects.some((p) => p.id === generatedId)) {
      alert('Project ID sudah ada. Gunakan ID yang berbeda.');
      return;
    }

    const projectToAdd: WorkProject = {
      id: generatedId,
      title: newProject.title!,
      desc: newProject.desc!,
      img: newProject.img || DEFAULT_PLACEHOLDER,
      alt: newProject.alt || newProject.title!,
      tags: tagsArray.length > 0 ? tagsArray : ['Engineering'],
      period: newProject.period?.trim() || undefined,
      github: newProject.github?.trim() || undefined,
      demoUrl: newProject.demoUrl?.trim() || undefined,
      images: Array.isArray(newProject.images) ? newProject.images : [],
      highlights: highlightsArray,
    };

    addWorkProject(projectToAdd);
    setNewProject({ id: '', title: '', desc: '', img: '', alt: '', tags: [], period: '', github: '', demoUrl: '', images: [], highlights: [] });
    setNewTagsInput('');
    setNewHighlightsInput('');
    showToast(`Project "${projectToAdd.title}" berhasil dipublikasikan`);
  };

  return (
    <div className="admin-section">

      {/* ── 1. Add New Project ── */}
      <div className="admin-card">
        <h2 className="admin-card-title">+ Tambah Project Baru</h2>
        <p className="admin-card-desc">
          Tampilkan project engineering sebagai showcase di halaman Work.
        </p>

        <form onSubmit={handleAddProject} className="admin-form">
          <div className="admin-grid-2">
            <div className="admin-field">
              <label>Judul Project *</label>
              <input
                type="text"
                placeholder="e.g. Distributed Consensus Engine"
                value={newProject.title || ''}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label>Unique ID (kosongkan untuk auto-generate)</label>
              <input
                type="text"
                placeholder="e.g. consensus-engine"
                value={newProject.id || ''}
                onChange={(e) => setNewProject({ ...newProject, id: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-field">
            <label>Deskripsi *</label>
            <textarea
              rows={3}
              placeholder="Deskripsi singkat arsitektur, fitur utama, dampak teknis..."
              value={newProject.desc || ''}
              onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })}
            />
          </div>

          {/* Cover image */}
          <ImageStrip
            label="Cover Image"
            images={newProject.img && newProject.img !== DEFAULT_PLACEHOLDER ? [newProject.img] : []}
            onRemove={() => setNewProject({ ...newProject, img: '' })}
            onUpload={(files) =>
              doUpload(files.slice(0, 1), ([url]) => setNewProject({ ...newProject, img: url }), 'new')
            }
            urlValue={newProject.img || ''}
            onUrlChange={(url) => setNewProject({ ...newProject, img: url })}
          />

          {/* Gallery images */}
          <ImageStrip
            label="Gambar Galeri (opsional, bisa lebih dari satu)"
            images={newProject.images || []}
            multiple
            onRemove={(idx) =>
              setNewProject({
                ...newProject,
                images: (newProject.images || []).filter((_, i) => i !== idx),
              })
            }
            onUpload={(files) =>
              doUpload(
                files,
                (urls) => setNewProject({ ...newProject, images: [...(newProject.images || []), ...urls] }),
                'new',
              )
            }
          />

          {isUploading === 'new' && (
            <p className="mono-sm" style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>
              ⟳ Mengupload gambar...
            </p>
          )}

          <div className="admin-grid-2">
            <div className="admin-field">
              <label>Tags (pisahkan dengan koma)</label>
              <input
                type="text"
                placeholder="Go, Raft, Distributed Systems"
                value={newTagsInput}
                onChange={(e) => setNewTagsInput(e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label>Periode Project</label>
              <input
                type="text"
                placeholder="e.g. 2026 — Present"
                value={newProject.period || ''}
                onChange={(e) => setNewProject({ ...newProject, period: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="admin-field">
              <label>GitHub URL</label>
              <input
                type="url"
                placeholder="https://github.com/username/repo"
                value={newProject.github || ''}
                onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label>Live Website URL</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={newProject.demoUrl || ''}
                onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-field">
            <label>Detail Highlights (satu per baris)</label>
            <textarea
              rows={3}
              placeholder={'Built RAG retrieval API\nAdded Redis semantic cache\nShipped admin dashboard'}
              value={newHighlightsInput}
              onChange={(e) => setNewHighlightsInput(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn--primary" style={{ alignSelf: 'flex-start' }}>
            <Plus size={14} />
            <span>Publish Project</span>
          </button>
        </form>
      </div>

      {/* ── 2. Existing Projects ── */}
      <div className="admin-card">
        <h2 className="admin-card-title">
          Project yang Ada ({data.workProjects.length})
        </h2>

        <div className="admin-items-list">
          {data.workProjects.map((project) => (
            <div key={project.id} className="admin-item-row">

              {/* Thumbnail cover */}
              <img
                src={project.img || DEFAULT_PLACEHOLDER}
                alt={project.alt || project.title}
                style={{
                  width: '90px', height: '65px', objectFit: 'cover',
                  borderRadius: '2px', border: '1px solid var(--line)', flexShrink: 0,
                }}
              />

              <div className="admin-item-content">
                {editingId === project.id ? (
                  /* ── Inline edit mode ── */
                  <div className="admin-edit-inline">
                    <div className="admin-field">
                      <label>Judul</label>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => editWorkProject(project.id, { title: e.target.value })}
                      />
                    </div>

                    <div className="admin-field">
                      <label>Deskripsi</label>
                      <textarea
                        rows={2}
                        value={project.desc}
                        onChange={(e) => editWorkProject(project.id, { desc: e.target.value })}
                      />
                    </div>

                    {/* Cover image edit with remove */}
                    <ImageStrip
                      label="Cover Image"
                      images={project.img && project.img !== DEFAULT_PLACEHOLDER ? [project.img] : []}
                      onRemove={() => editWorkProject(project.id, { img: DEFAULT_PLACEHOLDER })}
                      onUpload={(files) =>
                        doUpload(
                          files.slice(0, 1),
                          ([url]) => editWorkProject(project.id, { img: url }),
                          project.id,
                        )
                      }
                      urlValue={project.img !== DEFAULT_PLACEHOLDER ? project.img : ''}
                      onUrlChange={(url) => editWorkProject(project.id, { img: url || DEFAULT_PLACEHOLDER })}
                    />

                    {/* Gallery images edit with per-image remove */}
                    <ImageStrip
                      label="Gambar Galeri"
                      images={project.images || []}
                      multiple
                      onRemove={(idx) =>
                        editWorkProject(project.id, {
                          images: (project.images || []).filter((_, i) => i !== idx),
                        })
                      }
                      onUpload={(files) =>
                        doUpload(
                          files,
                          (urls) =>
                            editWorkProject(project.id, { images: [...(project.images || []), ...urls] }),
                          project.id,
                        )
                      }
                    />

                    {isUploading === project.id && (
                      <p className="mono-sm" style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>
                        ⟳ Mengupload gambar...
                      </p>
                    )}

                    <div className="admin-grid-2">
                      <div className="admin-field">
                        <label>Alt Text</label>
                        <input
                          type="text"
                          value={project.alt}
                          onChange={(e) => editWorkProject(project.id, { alt: e.target.value })}
                        />
                      </div>
                      <div className="admin-field">
                        <label>Periode</label>
                        <input
                          type="text"
                          value={project.period || ''}
                          onChange={(e) => editWorkProject(project.id, { period: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="admin-grid-2">
                      <div className="admin-field">
                        <label>Tags</label>
                        <input
                          type="text"
                          value={toCsv(project.tags)}
                          onChange={(e) => editWorkProject(project.id, { tags: parseCsv(e.target.value) })}
                        />
                      </div>
                      <div className="admin-field">
                        <label>GitHub URL</label>
                        <input
                          type="url"
                          value={project.github || ''}
                          onChange={(e) => editWorkProject(project.id, { github: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="admin-field">
                      <label>Live Website URL</label>
                      <input
                        type="url"
                        value={project.demoUrl || ''}
                        onChange={(e) => editWorkProject(project.id, { demoUrl: e.target.value })}
                      />
                    </div>

                    <div className="admin-field">
                      <label>Detail Highlights (satu per baris)</label>
                      <textarea
                        rows={3}
                        value={(project.highlights || []).join('\n')}
                        onChange={(e) =>
                          editWorkProject(project.id, {
                            highlights: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                          })
                        }
                      />
                    </div>

                    <button
                      type="button"
                      className="btn btn--primary"
                      style={{ padding: '0.35rem 0.8rem', fontSize: '0.85rem', alignSelf: 'flex-start' }}
                      onClick={() => { setEditingId(null); showToast('Project diperbarui'); }}
                    >
                      Selesai
                    </button>
                  </div>
                ) : (
                  /* ── Read-only view ── */
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
                        <span key={idx} className="admin-tag-pill">{t}</span>
                      ))}
                    </div>
                    {/* Show count of gallery images */}
                    {(project.images?.length ?? 0) > 0 && (
                      <p className="mono-sm" style={{ color: 'var(--muted)', marginTop: '0.4rem', fontSize: '0.75rem' }}>
                        {project.images!.length} gambar galeri
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="admin-item-actions">
                {editingId !== project.id && (
                  <button
                    className="admin-action-btn"
                    onClick={() => setEditingId(project.id)}
                  >
                    <Edit3 size={12} />
                    <span>Edit</span>
                  </button>
                )}
                <button
                  className="admin-action-btn danger"
                  onClick={() => {
                    if (window.confirm(`Hapus project "${project.title}"?`)) {
                      deleteWorkProject(project.id);
                      showToast('Project dihapus');
                    }
                  }}
                >
                  <Trash2 size={12} />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
