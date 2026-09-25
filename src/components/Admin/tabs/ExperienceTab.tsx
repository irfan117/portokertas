import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Briefcase, Upload, X, Plus, Trash2, Edit3 } from 'lucide-react';
import { uploadImage } from '../../../lib/uploadImage';
import { ExperienceSlide } from '../../../types';

interface ExperienceTabProps {
  showToast: (message: string) => void;
}

export const ExperienceTab: React.FC<ExperienceTabProps> = ({ showToast }) => {
  const { data, updateCareerList, updateCaseStudy, updateExperienceSlides } = usePortfolio();
  const [selectedCaseId, setSelectedCaseId] = useState<string>('exp-1');
  const [uploadingCaseField, setUploadingCaseField] = useState<string | null>(null);

  // Experience Slide Form State
  const [newSlide, setNewSlide] = useState<Partial<ExperienceSlide>>({
    roleTitle: '',
    date: '',
    img: '',
    alt: '',
    captionTitle: '',
    captionSub: '',
  });
  const [isUploadingSlideNew, setIsUploadingSlideNew] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [isUploadingSlideEdit, setIsUploadingSlideEdit] = useState<string | null>(null);

  const handleUploadCaseImage = async (fieldKey: 'heroImage' | 'midImage' | 'endImage', file: File) => {
    setUploadingCaseField(fieldKey);
    try {
      const url = await uploadImage(file);
      const current = data.caseStudies[selectedCaseId];
      if (current) {
        updateCaseStudy(selectedCaseId, { ...current, [fieldKey]: url });
        showToast('Gambar Case Study berhasil diunggah');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Upload gambar gagal');
    } finally {
      setUploadingCaseField(null);
    }
  };

  return (
    <div className="admin-section">
      {/* 1. Career Milestones List */}
      <div className="admin-card">
        <h2 className="admin-card-title">Career Timeline Milestones</h2>
        <p className="admin-card-desc">
          Professional roles displayed in the compact timeline list on the career overview page.
        </p>

        <div className="admin-items-list">
          {data.careerList.map((item, idx) => (
            <div key={item.id} className="admin-item-row compact">
              <div className="admin-item-info">
                <div className="admin-grid-2">
                  <div className="admin-field">
                    <label>Title &amp; Company</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const nextList = [...data.careerList];
                        nextList[idx] = { ...nextList[idx], title: e.target.value };
                        updateCareerList(nextList);
                        showToast(`Updated milestone: ${e.target.value}`);
                      }}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Period / Date</label>
                    <input
                      type="text"
                      value={item.date}
                      onChange={(e) => {
                        const nextList = [...data.careerList];
                        nextList[idx] = { ...nextList[idx], date: e.target.value };
                        updateCareerList(nextList);
                        showToast('Updated milestone date');
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Case Studies In-Depth Editor */}
      <div className="admin-card">
        <div className="admin-flex-between">
          <div>
            <h2 className="admin-card-title">In-Depth Case Study Editor</h2>
            <p className="admin-card-desc">
              Edit the comprehensive long-form architectural breakdown for each major position.
            </p>
          </div>
          <div className="admin-case-selector">
            <label>Select Case Study: </label>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
            >
              <option value="exp-1">Nimbus Systems (exp-1)</option>
              <option value="exp-2">Arta Digital (exp-2)</option>
              <option value="exp-3">Studio Delapan (exp-3)</option>
              <option value="exp-4">Freelance Independent (exp-4)</option>
            </select>
          </div>
        </div>

        {data.caseStudies[selectedCaseId] && (
          <div className="admin-case-editor">
            <div className="admin-grid-2">
              <div className="admin-field">
                <label>Period &amp; Header subtitle</label>
                <input
                  type="text"
                  value={data.caseStudies[selectedCaseId].period}
                  onChange={(e) => {
                    updateCaseStudy(selectedCaseId, {
                      ...data.caseStudies[selectedCaseId],
                      period: e.target.value,
                    });
                    showToast('Case study period saved');
                  }}
                />
              </div>
              <div className="admin-field">
                <label>Role</label>
                <input
                  type="text"
                  value={data.caseStudies[selectedCaseId].role}
                  onChange={(e) => {
                    updateCaseStudy(selectedCaseId, {
                      ...data.caseStudies[selectedCaseId],
                      role: e.target.value,
                    });
                    showToast('Case study role saved');
                  }}
                />
              </div>
            </div>

            <div className="admin-field">
              <label>Subtitle / Focus statement</label>
              <input
                type="text"
                value={data.caseStudies[selectedCaseId].subtitle}
                onChange={(e) => {
                  updateCaseStudy(selectedCaseId, {
                    ...data.caseStudies[selectedCaseId],
                    subtitle: e.target.value,
                  });
                  showToast('Case study subtitle saved');
                }}
              />
            </div>

            <div className="admin-field">
              <label>Lead Paragraph 1</label>
              <textarea
                rows={3}
                value={data.caseStudies[selectedCaseId].leadParagraph1 || ''}
                onChange={(e) => {
                  updateCaseStudy(selectedCaseId, {
                    ...data.caseStudies[selectedCaseId],
                    leadParagraph1: e.target.value,
                  });
                }}
              />
            </div>

            <div className="admin-field">
              <label>Lead Paragraph 2</label>
              <textarea
                rows={3}
                value={data.caseStudies[selectedCaseId].leadParagraph2 || ''}
                onChange={(e) => {
                  updateCaseStudy(selectedCaseId, {
                    ...data.caseStudies[selectedCaseId],
                    leadParagraph2: e.target.value,
                  });
                }}
              />
            </div>

            {/* Case Study Images Editor */}
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--line)', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Case Study Visual Assets / Images</h3>
              <div className="admin-grid-3">
                {/* Hero Image */}
                <div className="admin-field">
                  <label>Hero Image URL</label>
                  <input
                    type="text"
                    value={data.caseStudies[selectedCaseId].heroImage || ''}
                    onChange={(e) => {
                      updateCaseStudy(selectedCaseId, {
                        ...data.caseStudies[selectedCaseId],
                        heroImage: e.target.value,
                      });
                    }}
                  />
                  {data.caseStudies[selectedCaseId].heroImage && (
                    <div style={{ position: 'relative', display: 'inline-block', marginTop: '0.5rem' }}>
                      <img
                        src={data.caseStudies[selectedCaseId].heroImage}
                        alt="Hero Preview"
                        style={{ width: '100px', height: '65px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--line)' }}
                      />
                      <button
                        type="button"
                        onClick={() => updateCaseStudy(selectedCaseId, { ...data.caseStudies[selectedCaseId], heroImage: '' })}
                        style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', background: '#e53e3e', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <X size={11} />
                      </button>
                    </div>
                  )}
                  <div style={{ marginTop: '0.4rem' }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.6rem', background: 'var(--paper-dim)', border: '1px solid var(--line)', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8rem' }}>
                      <Upload size={12} />
                      {uploadingCaseField === 'heroImage' ? 'Uploading...' : 'Upload Hero'}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadCaseImage('heroImage', file);
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Mid Image */}
                <div className="admin-field">
                  <label>Diagram / Mid Image URL</label>
                  <input
                    type="text"
                    value={data.caseStudies[selectedCaseId].midImage || ''}
                    onChange={(e) => {
                      updateCaseStudy(selectedCaseId, {
                        ...data.caseStudies[selectedCaseId],
                        midImage: e.target.value,
                      });
                    }}
                  />
                  {data.caseStudies[selectedCaseId].midImage && (
                    <div style={{ position: 'relative', display: 'inline-block', marginTop: '0.5rem' }}>
                      <img
                        src={data.caseStudies[selectedCaseId].midImage}
                        alt="Mid Preview"
                        style={{ width: '100px', height: '65px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--line)' }}
                      />
                      <button
                        type="button"
                        onClick={() => updateCaseStudy(selectedCaseId, { ...data.caseStudies[selectedCaseId], midImage: '' })}
                        style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', background: '#e53e3e', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <X size={11} />
                      </button>
                    </div>
                  )}
                  <div style={{ marginTop: '0.4rem' }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.6rem', background: 'var(--paper-dim)', border: '1px solid var(--line)', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8rem' }}>
                      <Upload size={12} />
                      {uploadingCaseField === 'midImage' ? 'Uploading...' : 'Upload Mid'}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadCaseImage('midImage', file);
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* End Image */}
                <div className="admin-field">
                  <label>Outcome / End Image URL</label>
                  <input
                    type="text"
                    value={data.caseStudies[selectedCaseId].endImage || ''}
                    onChange={(e) => {
                      updateCaseStudy(selectedCaseId, {
                        ...data.caseStudies[selectedCaseId],
                        endImage: e.target.value,
                      });
                    }}
                  />
                  {data.caseStudies[selectedCaseId].endImage && (
                    <div style={{ position: 'relative', display: 'inline-block', marginTop: '0.5rem' }}>
                      <img
                        src={data.caseStudies[selectedCaseId].endImage}
                        alt="End Preview"
                        style={{ width: '100px', height: '65px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--line)' }}
                      />
                      <button
                        type="button"
                        onClick={() => updateCaseStudy(selectedCaseId, { ...data.caseStudies[selectedCaseId], endImage: '' })}
                        style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', background: '#e53e3e', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <X size={11} />
                      </button>
                    </div>
                  )}
                  <div style={{ marginTop: '0.4rem' }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.6rem', background: 'var(--paper-dim)', border: '1px solid var(--line)', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8rem' }}>
                      <Upload size={12} />
                      {uploadingCaseField === 'endImage' ? 'Uploading...' : 'Upload End'}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadCaseImage('endImage', file);
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* 3. Experience Slides Carousel Editor */}
      <div className="admin-card" style={{ marginTop: '2rem' }}>
        <h2 className="admin-card-title">Experience Carousel Slides (CRUD)</h2>
        <p className="admin-card-desc">
          Manage visual gallery slides displayed on the Experience page header carousel.
        </p>

        {/* Add New Slide Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newSlide.roleTitle || !newSlide.img) {
              alert('Please enter at least a Role Title and Image URL.');
              return;
            }
            const slideToAdd: ExperienceSlide = {
              id: `slide-${Date.now()}`,
              roleTitle: newSlide.roleTitle.trim(),
              date: newSlide.date?.trim() || '2024',
              img: newSlide.img.trim(),
              alt: newSlide.roleTitle.trim(),
              captionTitle: newSlide.captionTitle?.trim() || newSlide.roleTitle.trim(),
              captionSub: newSlide.captionSub?.trim() || '',
            };
            const updated = [...data.experienceSlides, slideToAdd];
            updateExperienceSlides(updated);
            setNewSlide({ roleTitle: '', date: '', img: '', alt: '', captionTitle: '', captionSub: '' });
            showToast('Experience slide added successfully');
          }}
          className="admin-form"
          style={{ background: 'var(--paper-dim)', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}
        >
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.8rem' }}>+ Add New Slide</h3>
          <div className="admin-grid-2">
            <div className="admin-field">
              <label>Role / Title *</label>
              <input
                type="text"
                placeholder="e.g. Lead Systems Architect"
                value={newSlide.roleTitle || ''}
                onChange={(e) => setNewSlide({ ...newSlide, roleTitle: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label>Date / Period</label>
              <input
                type="text"
                placeholder="e.g. 2023 - Present"
                value={newSlide.date || ''}
                onChange={(e) => setNewSlide({ ...newSlide, date: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="admin-field">
              <label>Caption Title</label>
              <input
                type="text"
                placeholder="e.g. Nimbus Core Platform"
                value={newSlide.captionTitle || ''}
                onChange={(e) => setNewSlide({ ...newSlide, captionTitle: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label>Caption Subtitle</label>
              <input
                type="text"
                placeholder="e.g. Infrastructure Modernization"
                value={newSlide.captionSub || ''}
                onChange={(e) => setNewSlide({ ...newSlide, captionSub: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-field">
            <label>Image URL *</label>
            <input
              type="text"
              placeholder="https://... or upload file"
              value={newSlide.img || ''}
              onChange={(e) => setNewSlide({ ...newSlide, img: e.target.value })}
            />
            {newSlide.img && (
              <div style={{ position: 'relative', display: 'inline-block', marginTop: '0.5rem' }}>
                <img
                  src={newSlide.img}
                  alt="Slide preview"
                  style={{ width: '120px', height: '70px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--line)' }}
                />
                <button
                  type="button"
                  onClick={() => setNewSlide({ ...newSlide, img: '' })}
                  style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', background: '#e53e3e', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={11} />
                </button>
              </div>
            )}
            <div style={{ marginTop: '0.4rem' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.7rem', background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '3px', cursor: 'pointer', fontSize: '0.82rem' }}>
                <Upload size={13} />
                {isUploadingSlideNew ? 'Uploading...' : 'Upload Image'}
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploadingSlideNew}
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setIsUploadingSlideNew(true);
                    try {
                      const url = await uploadImage(file);
                      setNewSlide((prev) => ({ ...prev, img: url }));
                      showToast('Slide image uploaded successfully');
                    } catch (err) {
                      showToast(err instanceof Error ? err.message : 'Upload failed');
                    } finally {
                      setIsUploadingSlideNew(false);
                      e.target.value = '';
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn--primary" style={{ marginTop: '0.8rem', padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
            <Plus size={14} style={{ marginRight: '0.3rem', display: 'inline' }} /> Add Slide
          </button>
        </form>

        {/* Slide List & Edit/Delete */}
        <div className="admin-items-list">
          {data.experienceSlides.map((slide, idx) => (
            <div key={slide.id || idx} className="admin-item-row" style={{ flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  {slide.img ? (
                    <img src={slide.img} alt={slide.roleTitle} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '3px', border: '1px solid var(--line)' }} />
                  ) : (
                    <div style={{ width: '60px', height: '40px', background: 'var(--paper-dim)', borderRadius: '3px', border: '1px solid var(--line)' }} />
                  )}
                  <div>
                    <strong>{slide.roleTitle}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{slide.date} · {slide.captionTitle}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setEditingSlideId(editingSlideId === slide.id ? null : slide.id)}
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                  >
                    <Edit3 size={13} style={{ marginRight: '0.2rem', display: 'inline' }} />
                    {editingSlideId === slide.id ? 'Close' : 'Edit'}
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => {
                      if (confirm(`Delete slide "${slide.roleTitle}"?`)) {
                        const updated = data.experienceSlides.filter((s) => s.id !== slide.id);
                        updateExperienceSlides(updated);
                        showToast('Slide deleted');
                      }
                    }}
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: '#e53e3e', borderColor: 'rgba(229,62,62,0.3)' }}
                  >
                    <Trash2 size={13} style={{ marginRight: '0.2rem', display: 'inline' }} /> Delete
                  </button>
                </div>
              </div>

              {/* Inline Edit Panel */}
              {editingSlideId === slide.id && (
                <div style={{ borderTop: '1px dashed var(--line)', paddingTop: '0.8rem', marginTop: '0.4rem', width: '100%' }}>
                  <div className="admin-grid-2">
                    <div className="admin-field">
                      <label>Role / Title</label>
                      <input
                        type="text"
                        value={slide.roleTitle}
                        onChange={(e) => {
                          const updated = [...data.experienceSlides];
                          updated[idx] = { ...updated[idx], roleTitle: e.target.value };
                          updateExperienceSlides(updated);
                        }}
                      />
                    </div>
                    <div className="admin-field">
                      <label>Date / Period</label>
                      <input
                        type="text"
                        value={slide.date}
                        onChange={(e) => {
                          const updated = [...data.experienceSlides];
                          updated[idx] = { ...updated[idx], date: e.target.value };
                          updateExperienceSlides(updated);
                        }}
                      />
                    </div>
                  </div>

                  <div className="admin-grid-2">
                    <div className="admin-field">
                      <label>Caption Title</label>
                      <input
                        type="text"
                        value={slide.captionTitle}
                        onChange={(e) => {
                          const updated = [...data.experienceSlides];
                          updated[idx] = { ...updated[idx], captionTitle: e.target.value };
                          updateExperienceSlides(updated);
                        }}
                      />
                    </div>
                    <div className="admin-field">
                      <label>Caption Subtitle</label>
                      <input
                        type="text"
                        value={slide.captionSub}
                        onChange={(e) => {
                          const updated = [...data.experienceSlides];
                          updated[idx] = { ...updated[idx], captionSub: e.target.value };
                          updateExperienceSlides(updated);
                        }}
                      />
                    </div>
                  </div>

                  <div className="admin-field">
                    <label>Image URL</label>
                    <input
                      type="text"
                      value={slide.img}
                      onChange={(e) => {
                        const updated = [...data.experienceSlides];
                        updated[idx] = { ...updated[idx], img: e.target.value };
                        updateExperienceSlides(updated);
                      }}
                    />
                    {slide.img && (
                      <div style={{ position: 'relative', display: 'inline-block', marginTop: '0.5rem' }}>
                        <img
                          src={slide.img}
                          alt="Slide preview"
                          style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--line)' }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...data.experienceSlides];
                            updated[idx] = { ...updated[idx], img: '' };
                            updateExperienceSlides(updated);
                          }}
                          style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', background: '#e53e3e', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <X size={11} />
                        </button>
                      </div>
                    )}
                    <div style={{ marginTop: '0.4rem' }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.6rem', background: 'var(--paper-dim)', border: '1px solid var(--line)', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8rem' }}>
                        <Upload size={12} />
                        {isUploadingSlideEdit === slide.id ? 'Uploading...' : 'Upload New Image'}
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploadingSlideEdit === slide.id}
                          style={{ display: 'none' }}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setIsUploadingSlideEdit(slide.id);
                            try {
                              const url = await uploadImage(file);
                              const updated = [...data.experienceSlides];
                              updated[idx] = { ...updated[idx], img: url };
                              updateExperienceSlides(updated);
                              showToast('Image updated');
                            } catch (err) {
                              showToast(err instanceof Error ? err.message : 'Upload failed');
                            } finally {
                              setIsUploadingSlideEdit(null);
                              e.target.value = '';
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
