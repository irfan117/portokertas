import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { LabNote, RouteId } from '../../../types';
import { Plus, Edit3, Trash2, Eye, Upload, X, Image as ImageIcon } from 'lucide-react';
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
    img: '',
    caption: 'Architecture breakdown and telemetry graphs',
    summary: '',
    contentRaw: '',
    codeLang: '',
    codeFilename: '',
    codeBody: '',
  });

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [isUploadingNew, setIsUploadingNew] = useState(false);
  const [isUploadingEdit, setIsUploadingEdit] = useState<string | null>(null);

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
      slug,
      title: newLabNote.title.trim(),
      category: newLabNote.category,
      date: newLabNote.date.trim() || 'August 2024',
      readTime: newLabNote.readTime.trim() || '5 min read',
      tags: tagsArray.length > 0 ? tagsArray : ['Systems', 'Architecture'],
      caption: newLabNote.caption.trim() || newLabNote.title.trim(),
      img: newLabNote.img.trim(),
      alt: newLabNote.title.trim(),
      summary: newLabNote.summary.trim(),
      content: paragraphs,
      codeSnippet: newLabNote.codeBody.trim()
        ? {
            language: newLabNote.codeLang || 'go',
            filename: newLabNote.codeFilename.trim() || 'main.go',
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
      img: '',
      caption: 'Architecture breakdown and telemetry graphs',
      summary: '',
      contentRaw: '',
      codeLang: '',
      codeFilename: '',
      codeBody: '',
    });
    showToast(`Lab note "${noteToAdd.title}" published!`);
  };

  const handleUploadImageNew = async (file: File) => {
    setIsUploadingNew(true);
    try {
      const url = await uploadImage(file);
      setNewLabNote((prev) => ({ ...prev, img: url }));
      showToast('Gambar lab note berhasil diunggah ke Cloudinary');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Upload gambar gagal');
    } finally {
      setIsUploadingNew(false);
    }
  };

  const handleUploadImageEdit = async (noteId: string, file: File) => {
    setIsUploadingEdit(noteId);
    try {
      const url = await uploadImage(file);
      editLabNote(noteId, { img: url });
      showToast('Gambar lab note berhasil diperbarui');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Upload gambar gagal');
    } finally {
      setIsUploadingEdit(null);
    }
  };

  return (
    <div className="admin-section">
      {/* ── 1. Add New Lab Note Form ── */}
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

          {/* Cover Image & Caption */}
          <div className="admin-grid-2">
            <div className="admin-field">
              <label>Cover / Diagram Photo URL</label>
              <input
                type="text"
                placeholder="https://... atau upload file di bawah"
                value={newLabNote.img}
                onChange={(e) => setNewLabNote({ ...newLabNote, img: e.target.value })}
              />

              {newLabNote.img && (
                <div style={{ position: 'relative', display: 'inline-block', marginTop: '0.6rem' }}>
                  <img
                    src={newLabNote.img}
                    alt="Cover Preview"
                    style={{
                      width: '120px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      border: '1px solid var(--line)',
                      display: 'block',
                    }}
                  />
                  <button
                    type="button"
                    title="Hapus gambar"
                    onClick={() => setNewLabNote({ ...newLabNote, img: '' })}
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
                      zIndex: 2,
                    }}
                  >
                    <X size={11} />
                  </button>
                </div>
              )}

              <div style={{ marginTop: '0.5rem' }}>
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.8rem',
                    background: 'var(--paper-dim)',
                    border: '1px solid var(--line)',
                    borderRadius: '3px',
                    cursor: isUploadingNew ? 'not-allowed' : 'pointer',
                    fontSize: '0.82rem',
                    color: 'var(--ink)',
                  }}
                >
                  <Upload size={13} />
                  {isUploadingNew ? 'Mengunggah...' : 'Upload Gambar'}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingNew}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadImageNew(file);
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>
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
              placeholder={'Paragraph 1: The incident began with tail latency spikes during flash auctions...\n\nParagraph 2: We isolated the problem using pprof CPU and memory profiles...'}
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
                <option value="">-- Pilih bahasa (opsional) --</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="sql">SQL / Postgres</option>
                <option value="typescript">TypeScript</option>
                <option value="bash">Bash / Shell</option>
                <option value="python">Python</option>
              </select>
            </div>
            <div className="admin-field">
              <label>Code Snippet Filename</label>
              <input
                type="text"
                placeholder="e.g. internal/cluster/node.go"
                value={newLabNote.codeFilename}
                onChange={(e) => setNewLabNote({ ...newLabNote, codeFilename: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-field">
            <label>Code Snippet Body</label>
            <textarea
              rows={4}
              placeholder={'// Paste your illustrative code snippet here...\nfunc SyncClusterState(ctx context.Context) error {\n    // ...\n}'}
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

      {/* ── 2. Published Lab Notes List ── */}
      <div className="admin-card">
        <h2 className="admin-card-title">
          Published Lab Notes ({data.labNotes.length})
        </h2>
        <div className="admin-items-list">
          {data.labNotes.map((note, idx) => (
            <div key={note.id || idx} className="admin-item-row">
              {note.img ? (
                <img
                  src={note.img}
                  alt={note.alt || note.title}
                  style={{
                    width: '80px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '2px',
                    border: '1px solid var(--line)',
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '80px',
                    height: '60px',
                    background: 'var(--paper-dim)',
                    borderRadius: '2px',
                    border: '1px solid var(--line)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--muted)',
                    flexShrink: 0,
                  }}
                >
                  <ImageIcon size={20} style={{ opacity: 0.4 }} />
                </div>
              )}

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

                    <div className="admin-grid-2">
                      <div className="admin-field">
                        <label>Category</label>
                        <input
                          type="text"
                          value={note.category}
                          onChange={(e) => editLabNote(note.id, { category: e.target.value })}
                        />
                      </div>
                      <div className="admin-field">
                        <label>Date &amp; Read Time</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input
                            type="text"
                            placeholder="Date (e.g. Sept 2024)"
                            value={note.date || ''}
                            onChange={(e) => editLabNote(note.id, { date: e.target.value })}
                          />
                          <input
                            type="text"
                            placeholder="Read Time (e.g. 5 min read)"
                            value={note.readTime || ''}
                            onChange={(e) => editLabNote(note.id, { readTime: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Image Edit & Upload & Delete */}
                    <div className="admin-field">
                      <label>Cover / Diagram Image</label>
                      <input
                        type="text"
                        placeholder="https://... atau upload di bawah"
                        value={note.img || ''}
                        onChange={(e) => editLabNote(note.id, { img: e.target.value })}
                      />

                      {note.img && (
                        <div style={{ position: 'relative', display: 'inline-block', marginTop: '0.6rem' }}>
                          <img
                            src={note.img}
                            alt="Cover Preview"
                            style={{
                              width: '120px',
                              height: '80px',
                              objectFit: 'cover',
                              borderRadius: '4px',
                              border: '1px solid var(--line)',
                              display: 'block',
                            }}
                          />
                          <button
                            type="button"
                            title="Hapus gambar note"
                            onClick={() => editLabNote(note.id, { img: '' })}
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
                              zIndex: 2,
                            }}
                          >
                            <X size={11} />
                          </button>
                        </div>
                      )}

                      <div style={{ marginTop: '0.5rem' }}>
                        <label
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.35rem 0.8rem',
                            background: 'var(--paper-dim)',
                            border: '1px solid var(--line)',
                            borderRadius: '3px',
                            cursor: isUploadingEdit === note.id ? 'not-allowed' : 'pointer',
                            fontSize: '0.82rem',
                            color: 'var(--ink)',
                          }}
                        >
                          <Upload size={13} />
                          {isUploadingEdit === note.id ? 'Mengunggah...' : 'Upload Gambar Baru'}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingEdit === note.id}
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUploadImageEdit(note.id, file);
                              e.target.value = '';
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="admin-field">
                      <label>Photo Caption / Figure Context</label>
                      <input
                        type="text"
                        value={note.caption || ''}
                        onChange={(e) => editLabNote(note.id, { caption: e.target.value })}
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
                  onClick={() => onNavigateSite(`lab-note-${note.slug || note.id}` as RouteId)}
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
