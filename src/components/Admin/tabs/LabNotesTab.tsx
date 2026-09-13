import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { LabNote, RouteId } from '../../../types';
import { Plus, Edit3, Trash2, Eye, BookOpen } from 'lucide-react';
import { uploadImage } from '../../../lib/uploadImage';

interface LabNotesTabProps {
  showToast: (message: string) => void;
  onNavigateSite: (route: RouteId) => void;
}

export const LabNotesTab: React.FC<LabNotesTabProps> = ({ showToast, onNavigateSite }) => {
  const { data, addLabNote, editLabNote, deleteLabNote } = usePortfolio();

  const [newLabNote, setNewLabNote] = useState({
    title: '',
    category: 'Distributed Systems',
    date: 'September 2024',
    readTime: '6 min read',
    tagsInput: 'Go, Systems, Latency',
    img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    caption: 'Architecture breakdown and telemetry graphs',
    summary: '',
    contentRaw: '',
    codeLang: 'go',
    codeFilename: 'internal/cluster/node.go',
    codeBody: '',
  });

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const handleAddLabNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabNote.title.trim() || !newLabNote.summary.trim()) {
      alert('Please provide at least a title and summary.');
      return;
    }

    const tagsArray = newLabNote.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const paragraphs = newLabNote.contentRaw
      ? newLabNote.contentRaw
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean)
      : [newLabNote.summary];

    const slug = newLabNote.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const noteId = slug || `note-${Date.now()}`;
    if (data.labNotes.some((note) => note.id === noteId || note.slug === noteId)) {
      alert('Lab note slug already exists. Please use a different title.');
      return;
    }

    const noteToAdd: LabNote = {
      id: noteId,
      slug: noteId,
      title: newLabNote.title.trim(),
      category: newLabNote.category,
      date: newLabNote.date || 'Recent',
      readTime: newLabNote.readTime || '5 min read',
      tags: tagsArray.length > 0 ? tagsArray : ['Engineering'],
      img: newLabNote.img,
      alt: newLabNote.caption || newLabNote.title,
      caption: newLabNote.caption || newLabNote.title,
      summary: newLabNote.summary.trim(),
      content: paragraphs,
      codeSnippet: newLabNote.codeBody.trim()
        ? {
            language: newLabNote.codeLang,
            filename: newLabNote.codeFilename || undefined,
            code: newLabNote.codeBody.trim(),
          }
        : undefined,
    };

    addLabNote(noteToAdd);
    setNewLabNote({
      title: '',
      category: 'Distributed Systems',
      date: 'September 2024',
      readTime: '6 min read',
      tagsInput: 'Go, Systems, Latency',
      img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      caption: 'Architecture breakdown and telemetry graphs',
      summary: '',
      contentRaw: '',
      codeLang: 'go',
      codeFilename: 'internal/cluster/node.go',
      codeBody: '',
    });
    showToast(`Lab note "${noteToAdd.title}" published!`);
  };

  return (
    <div className="admin-section">
      {/* 1. Add New Lab Note Form */}
      <div className="admin-card">
        <h2 className="admin-card-title">+ Publish New Lab Note &amp; Whitepaper</h2>
        <p className="admin-card-desc">
          Publish deep technical write-ups, incident postmortems, or architecture blueprints.
        </p>

        <form onSubmit={handleAddLabNote} className="admin-form">
          <div className="admin-grid-2">
            <div className="admin-field">
              <label>Post Title *</label>
              <input
                type="text"
                placeholder="e.g. Profiling Go garbage collection under heavy allocations"
                value={newLabNote.title}
                onChange={(e) => setNewLabNote({ ...newLabNote, title: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label>Category *</label>
              <select
                value={newLabNote.category}
                onChange={(e) => setNewLabNote({ ...newLabNote, category: e.target.value })}
              >
                <option value="Distributed Systems">Distributed Systems</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Observability">Observability</option>
                <option value="Architecture">Architecture</option>
                <option value="Debugging & SRE">Debugging &amp; SRE</option>
                <option value="Productivity & Tooling">Productivity &amp; Tooling</option>
                <option value="Database Engineering">Database Engineering</option>
              </select>
            </div>
          </div>

          <div className="admin-grid-3">
            <div className="admin-field">
              <label>Published Date</label>
              <input
                type="text"
                placeholder="e.g. August 2024"
                value={newLabNote.date}
                onChange={(e) => setNewLabNote({ ...newLabNote, date: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label>Estimated Read Time</label>
              <input
                type="text"
                placeholder="e.g. 5 min read"
                value={newLabNote.readTime}
                onChange={(e) => setNewLabNote({ ...newLabNote, readTime: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                placeholder="Go, Memory, Pprof, GC"
                value={newLabNote.tagsInput}
                onChange={(e) => setNewLabNote({ ...newLabNote, tagsInput: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="admin-field">
              <label>Cover / Whiteboard Photo URL *</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={newLabNote.img}
                onChange={(e) => setNewLabNote({ ...newLabNote, img: e.target.value })}
              />
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    setNewLabNote({ ...newLabNote, img: await uploadImage(file) });
                    showToast('Gambar berhasil diunggah ke Cloudinary');
                  } catch (error) {
                    showToast(error instanceof Error ? error.message : 'Upload gambar gagal');
                  }
                }}
              />
            </div>
            <div className="admin-field">
              <label>Photo Caption / Figure Context</label>
              <input
                type="text"
                placeholder="e.g. Heap allocation profile before and after buffer pooling"
                value={newLabNote.caption}
                onChange={(e) => setNewLabNote({ ...newLabNote, caption: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-field">
            <label>Article Summary / Lead Excerpt *</label>
            <textarea
              rows={2}
              placeholder="A concise breakdown of the technical problem, solution, and outcome."
              value={newLabNote.summary}
              onChange={(e) => setNewLabNote({ ...newLabNote, summary: e.target.value })}
            />
          </div>

          <div className="admin-field">
            <label>
              Full Article Content (Separate paragraphs with double Enter / blank line)
            </label>
            <textarea
              rows={5}
              placeholder="Paragraph 1: The incident began with tail latency spikes during flash auctions...&#10;&#10;Paragraph 2: We isolated the problem using pprof CPU and memory profiles..."
              value={newLabNote.contentRaw}
              onChange={(e) => setNewLabNote({ ...newLabNote, contentRaw: e.target.value })}
            />
          </div>

          <div className="admin-grid-2">
            <div className="admin-field">
              <label>Code Snippet Language (Optional)</label>
              <select
                value={newLabNote.codeLang}
                onChange={(e) => setNewLabNote({ ...newLabNote, codeLang: e.target.value })}
              >
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="sql">SQL / Postgres</option>
                <option value="typescript">TypeScript</option>
                <option value="bash">Bash / Shell</option>
                <option value="yaml">YAML / Kube</option>
              </select>
            </div>
            <div className="admin-field">
              <label>Code Snippet Filename (Optional)</label>
              <input
                type="text"
                placeholder="e.g. internal/pool/buffer.go"
                value={newLabNote.codeFilename}
                onChange={(e) =>
                  setNewLabNote({ ...newLabNote, codeFilename: e.target.value })
                }
              />
            </div>
          </div>

          <div className="admin-field">
            <label>Code Snippet Content (Optional)</label>
            <textarea
              rows={4}
              placeholder="var bufPool = sync.Pool{ New: func() any { return new(bytes.Buffer) } }"
              style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
              value={newLabNote.codeBody}
              onChange={(e) => setNewLabNote({ ...newLabNote, codeBody: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn btn--primary"
            style={{ alignSelf: 'flex-start' }}
          >
            <Plus size={14} />
            <span>Publish Lab Note</span>
          </button>
        </form>
      </div>

      {/* 2. Published Lab Notes List */}
      <div className="admin-card">
        <h2 className="admin-card-title">
          Published Lab Notes ({data.labNotes.length})
        </h2>
        <div className="admin-items-list">
          {data.labNotes.map((note, idx) => (
            <div key={note.id || idx} className="admin-item-row">
              <img
                src={note.img}
                alt={note.alt || note.title}
                style={{
                  width: '80px',
                  height: '60px',
                  objectFit: 'cover',
                  borderRadius: '2px',
                  border: '1px solid var(--line)',
                }}
              />
              <div className="admin-item-content">
                {editingNoteId === note.id ? (
                  <div className="admin-edit-inline">
                    <div className="admin-field">
                      <label>Title</label>
                      <input
                        type="text"
                        value={note.title}
                        onChange={(e) => editLabNote(note.id, { title: e.target.value })}
                      />
                    </div>
                    <div className="admin-field">
                      <label>Category</label>
                      <input
                        type="text"
                        value={note.category}
                        onChange={(e) => editLabNote(note.id, { category: e.target.value })}
                      />
                    </div>
                    <div className="admin-field">
                      <label>Summary</label>
                      <textarea
                        rows={2}
                        value={note.summary || ''}
                        onChange={(e) => editLabNote(note.id, { summary: e.target.value })}
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
                        setEditingNoteId(null);
                        showToast('Lab note updated');
                      }}
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="admin-item-header">
                      <h3>{note.title}</h3>
                      <span
                        className="admin-tag-pill"
                        style={{ background: 'var(--paper-dim)', color: 'var(--ink)' }}
                      >
                        {note.category}
                      </span>
                    </div>
                    <p className="admin-item-desc">{note.summary || note.caption}</p>
                    <div
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        fontSize: '0.78rem',
                        color: 'var(--muted)',
                        marginTop: '0.3rem',
                      }}
                      className="mono"
                    >
                      <span>{note.date}</span>
                      <span>·</span>
                      <span>{note.readTime}</span>
                      <span>·</span>
                      <span>Slug: #{note.id}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="admin-item-actions">
                <button
                  className="admin-action-btn"
                  onClick={() => onNavigateSite(`note-${note.id}` as RouteId)}
                  title="Open live article page"
                >
                  <Eye size={12} />
                  <span>View Live</span>
                </button>
                {editingNoteId !== note.id && (
                  <button
                    className="admin-action-btn"
                    onClick={() => setEditingNoteId(note.id)}
                  >
                    <Edit3 size={12} />
                    <span>Edit</span>
                  </button>
                )}
                <button
                  className="admin-action-btn danger"
                  onClick={() => {
                    if (window.confirm(`Delete lab note "${note.title}"?`)) {
                      deleteLabNote(idx);
                      showToast('Lab note removed');
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
