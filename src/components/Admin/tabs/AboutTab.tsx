import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { ProfileData } from '../../../types';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '../../../lib/uploadImage';

interface AboutTabProps {
  showToast: (message: string) => void;
}

export const AboutTab: React.FC<AboutTabProps> = ({ showToast }) => {
  const { data, updateProfile } = usePortfolio();
  const [isUploadingPortrait, setIsUploadingPortrait] = useState(false);
  const [isUploadingQuoteBg, setIsUploadingQuoteBg] = useState(false);

  const handleSaveProfileField = (field: keyof ProfileData, value: any) => {
    updateProfile({ [field]: value });
    showToast(`Updated ${String(field)}`);
  };

  const handleUploadPortrait = async (file: File) => {
    setIsUploadingPortrait(true);
    try {
      const url = await uploadImage(file);
      handleSaveProfileField('portraitImg', url);
      showToast('Foto portrait About berhasil diunggah');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Gagal mengunggah foto');
    } finally {
      setIsUploadingPortrait(false);
    }
  };

  const handleUploadQuoteBg = async (file: File) => {
    setIsUploadingQuoteBg(true);
    try {
      const url = await uploadImage(file);
      const nextQuote = { ...data.profile.aboutQuote, bgImage: url };
      handleSaveProfileField('aboutQuote', nextQuote);
      showToast('Background quote About berhasil diunggah');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Gagal mengunggah background quote');
    } finally {
      setIsUploadingQuoteBg(false);
    }
  };

  return (
    <div className="admin-section">
      {/* ── 1. About Images & Visuals ── */}
      <div className="admin-card">
        <h2 className="admin-card-title">
          <ImageIcon size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.4rem' }} />
          About Page Images &amp; Visuals
        </h2>
        <p className="admin-card-desc">
          Ganti atau hapus foto profil portrait dan gambar background quote pada halaman About.
        </p>

        <div className="admin-grid-2">
          {/* Portrait Photo */}
          <div className="admin-field">
            <label>Foto Profil Portrait</label>
            <input
              type="text"
              placeholder="https://... atau upload file di bawah"
              value={data.profile.portraitImg || ''}
              onChange={(e) => handleSaveProfileField('portraitImg', e.target.value)}
            />

            {data.profile.portraitImg && (
              <div style={{ position: 'relative', display: 'inline-block', marginTop: '0.6rem' }}>
                <img
                  src={data.profile.portraitImg}
                  alt="Portrait Preview"
                  style={{
                    width: '120px',
                    height: '140px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    border: '1px solid var(--line)',
                    display: 'block',
                  }}
                />
                <button
                  type="button"
                  title="Hapus foto portrait"
                  onClick={() => handleSaveProfileField('portraitImg', '')}
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    width: '22px',
                    height: '22px',
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
                  <X size={12} />
                </button>
              </div>
            )}

            <div style={{ marginTop: '0.5rem' }}>
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.85rem',
                  background: 'var(--paper-dim)',
                  border: '1px solid var(--line)',
                  borderRadius: '3px',
                  cursor: isUploadingPortrait ? 'not-allowed' : 'pointer',
                  fontSize: '0.82rem',
                  color: 'var(--ink)',
                }}
              >
                <Upload size={13} />
                {isUploadingPortrait ? 'Mengunggah...' : 'Upload Foto Portrait'}
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploadingPortrait}
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadPortrait(file);
                    e.target.value = '';
                  }}
                />
              </label>
            </div>
          </div>

          {/* Quote Background Image */}
          <div className="admin-field">
            <label>Quote Background Image</label>
            <input
              type="text"
              placeholder="https://... atau upload file di bawah"
              value={data.profile.aboutQuote?.bgImage || ''}
              onChange={(e) => {
                const nextQuote = { ...data.profile.aboutQuote, bgImage: e.target.value };
                handleSaveProfileField('aboutQuote', nextQuote);
              }}
            />

            {data.profile.aboutQuote?.bgImage && (
              <div style={{ position: 'relative', display: 'inline-block', marginTop: '0.6rem' }}>
                <img
                  src={data.profile.aboutQuote.bgImage}
                  alt="Quote Bg Preview"
                  style={{
                    width: '160px',
                    height: '90px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    border: '1px solid var(--line)',
                    display: 'block',
                  }}
                />
                <button
                  type="button"
                  title="Hapus background quote"
                  onClick={() => {
                    const nextQuote = { ...data.profile.aboutQuote, bgImage: '' };
                    handleSaveProfileField('aboutQuote', nextQuote);
                  }}
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    width: '22px',
                    height: '22px',
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
                  <X size={12} />
                </button>
              </div>
            )}

            <div style={{ marginTop: '0.5rem' }}>
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.85rem',
                  background: 'var(--paper-dim)',
                  border: '1px solid var(--line)',
                  borderRadius: '3px',
                  cursor: isUploadingQuoteBg ? 'not-allowed' : 'pointer',
                  fontSize: '0.82rem',
                  color: 'var(--ink)',
                }}
              >
                <Upload size={13} />
                {isUploadingQuoteBg ? 'Mengunggah...' : 'Upload Background Quote'}
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploadingQuoteBg}
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadQuoteBg(file);
                    e.target.value = '';
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Bio & Philosophy ── */}
      <div className="admin-card">
        <h2 className="admin-card-title">Bio &amp; Engineering Philosophy</h2>
        <p className="admin-card-desc">
          Long-form essays and architectural stances displayed on the About page.
        </p>

        <div className="admin-field">
          <label>Tools &amp; Philosophy Heading</label>
          <input
            type="text"
            value={data.profile.toolsHeading || 'How I think about tools now'}
            onChange={(e) => handleSaveProfileField('toolsHeading', e.target.value)}
          />
        </div>

        <div className="admin-field">
          <label>Bio Paragraph 1</label>
          <textarea
            rows={3}
            value={data.profile.aboutBio?.[0] || ''}
            onChange={(e) => {
              const next = [...(data.profile.aboutBio || [])];
              next[0] = e.target.value;
              handleSaveProfileField('aboutBio', next);
            }}
          />
        </div>

        <div className="admin-field">
          <label>Bio Paragraph 2</label>
          <textarea
            rows={3}
            value={data.profile.aboutBio?.[1] || ''}
            onChange={(e) => {
              const next = [...(data.profile.aboutBio || [])];
              next[1] = e.target.value;
              handleSaveProfileField('aboutBio', next);
            }}
          />
        </div>

        <div className="admin-field">
          <label>Philosophy Part 1</label>
          <textarea
            rows={3}
            value={data.profile.toolsText1 || ''}
            onChange={(e) => handleSaveProfileField('toolsText1', e.target.value)}
          />
        </div>

        <div className="admin-field">
          <label>Philosophy Part 2</label>
          <textarea
            rows={3}
            value={data.profile.toolsText2 || ''}
            onChange={(e) => handleSaveProfileField('toolsText2', e.target.value)}
          />
        </div>
      </div>

      {/* ── 3. Architecture Approach Principles ── */}
      <div className="admin-card">
        <h2 className="admin-card-title">Architecture Approach Principles</h2>
        <p className="admin-card-desc">
          Step-by-step principles for how you approach distributed infrastructure and tooling.
        </p>

        <div className="admin-field">
          <label>Approach Heading</label>
          <input
            type="text"
            value={data.profile.approachHeading || ''}
            onChange={(e) => handleSaveProfileField('approachHeading', e.target.value)}
          />
        </div>

        <div className="admin-field">
          <label>Approach Lead Paragraph</label>
          <textarea
            rows={2}
            value={data.profile.approachLead || ''}
            onChange={(e) => handleSaveProfileField('approachLead', e.target.value)}
          />
        </div>

        {(data.profile.approachSteps || []).map((step, idx) => (
          <div key={idx} className="admin-field">
            <label>Principle Step {idx + 1}</label>
            <input
              type="text"
              value={step}
              onChange={(e) => {
                const nextSteps = [...(data.profile.approachSteps || [])];
                nextSteps[idx] = e.target.value;
                handleSaveProfileField('approachSteps', nextSteps);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
