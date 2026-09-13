import React from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { ProfileData } from '../../../types';

interface ProfileHeroTabProps {
  showToast: (message: string) => void;
}

export const ProfileHeroTab: React.FC<ProfileHeroTabProps> = ({ showToast }) => {
  const { data, updateProfile } = usePortfolio();

  const handleSaveProfileField = (field: keyof ProfileData, value: any) => {
    updateProfile({ [field]: value });
    showToast(`Updated ${String(field)}`);
  };

  return (
    <div className="admin-section">
      {/* 1. Identity & Headline */}
      <div className="admin-card">
        <h2 className="admin-card-title">Identity &amp; Hero Headline</h2>
        <p className="admin-card-desc">
          Core biographical headline and location shown at the very top of the landing page.
        </p>

        <div className="admin-grid-2">
          <div className="admin-field">
            <label>Full Name</label>
            <input
              type="text"
              value={data.profile.name || ''}
              onChange={(e) => handleSaveProfileField('name', e.target.value)}
            />
          </div>
          <div className="admin-field">
            <label>Professional Role / Specialization</label>
            <input
              type="text"
              value={data.profile.role || ''}
              onChange={(e) => handleSaveProfileField('role', e.target.value)}
            />
          </div>
        </div>

        <div className="admin-field">
          <label>Location Eyebrow</label>
          <input
            type="text"
            value={data.profile.location || ''}
            onChange={(e) => handleSaveProfileField('location', e.target.value)}
          />
        </div>

        <div className="admin-field">
          <label>Hero Title (Main Bold Statement)</label>
          <input
            type="text"
            value={data.profile.heroTitle || ''}
            onChange={(e) => handleSaveProfileField('heroTitle', e.target.value)}
          />
        </div>

        <div className="admin-field">
          <label>Hero Lead Paragraph</label>
          <textarea
            rows={4}
            value={data.profile.heroLead || ''}
            onChange={(e) => handleSaveProfileField('heroLead', e.target.value)}
          />
        </div>
      </div>

      {/* 2. Hero Status Meta Badges */}
      <div className="admin-card">
        <h2 className="admin-card-title">Hero Status Meta Badges</h2>
        <p className="admin-card-desc">
          Key status attributes displayed below the hero action buttons (e.g. Currently, Focus, Based in).
        </p>
        <div className="admin-grid-3">
          {(data.profile.heroMeta || []).map((meta, idx) => (
            <div key={idx} className="admin-field">
              <label>{meta.label || `Meta ${idx + 1}`}</label>
              <input
                type="text"
                value={meta.value || ''}
                onChange={(e) => {
                  const next = [...(data.profile.heroMeta || [])];
                  next[idx] = { ...next[idx], value: e.target.value };
                  handleSaveProfileField('heroMeta', next);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Hero Scale & Throughput Stats */}
      <div className="admin-card">
        <h2 className="admin-card-title">Hero Impact Statistics</h2>
        <p className="admin-card-desc">
          Three high-impact operational metrics showcased on the home view (e.g. 40k /s, 99.99%).
        </p>
        <div className="admin-grid-3">
          {(data.profile.heroStats || []).map((stat, idx) => (
            <div key={idx} className="admin-field">
              <label>Metric {idx + 1}</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Value (e.g. 40k)"
                  style={{ width: '45%' }}
                  value={stat.num || ''}
                  onChange={(e) => {
                    const next = [...(data.profile.heroStats || [])];
                    next[idx] = { ...next[idx], num: e.target.value };
                    handleSaveProfileField('heroStats', next);
                  }}
                />
                <input
                  type="text"
                  placeholder="Unit (e.g. /s)"
                  style={{ width: '55%' }}
                  value={stat.unit || ''}
                  onChange={(e) => {
                    const next = [...(data.profile.heroStats || [])];
                    next[idx] = { ...next[idx], unit: e.target.value };
                    handleSaveProfileField('heroStats', next);
                  }}
                />
              </div>
              <textarea
                rows={2}
                placeholder="Description label"
                value={stat.label || ''}
                onChange={(e) => {
                  const next = [...(data.profile.heroStats || [])];
                  next[idx] = { ...next[idx], label: e.target.value };
                  handleSaveProfileField('heroStats', next);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Homepage Parallax Feature Section */}
      <div className="admin-card">
        <h2 className="admin-card-title">Homepage Feature (Right Now Section)</h2>
        <p className="admin-card-desc">
          The showcase section with side-by-side engineering illustration and highlight narrative.
        </p>
        <div className="admin-field">
          <label>Section Title</label>
          <input
            type="text"
            value={data.profile.splitParallax?.title || ''}
            onChange={(e) => {
              handleSaveProfileField('splitParallax', {
                ...(data.profile.splitParallax || {}),
                title: e.target.value,
              });
            }}
          />
        </div>
        <div className="admin-field">
          <label>Description</label>
          <textarea
            rows={3}
            value={data.profile.splitParallax?.desc || ''}
            onChange={(e) => {
              handleSaveProfileField('splitParallax', {
                ...(data.profile.splitParallax || {}),
                desc: e.target.value,
              });
            }}
          />
        </div>
        <div className="admin-field">
          <label>Media Image URL</label>
          <input
            type="text"
            value={data.profile.splitParallax?.img || ''}
            onChange={(e) => {
              handleSaveProfileField('splitParallax', {
                ...(data.profile.splitParallax || {}),
                img: e.target.value,
              });
            }}
          />
        </div>
      </div>

      {/* 5. Homepage Featured Quote */}
      <div className="admin-card">
        <h2 className="admin-card-title">Homepage Featured Quote</h2>
        <div className="admin-field">
          <label>Quote Text</label>
          <textarea
            rows={2}
            value={data.profile.homeQuote?.text || ''}
            onChange={(e) => {
              handleSaveProfileField('homeQuote', {
                ...(data.profile.homeQuote || {}),
                text: e.target.value,
              });
            }}
          />
        </div>
        <div className="admin-field">
          <label>Citation / Attribution</label>
          <input
            type="text"
            value={data.profile.homeQuote?.cite || ''}
            onChange={(e) => {
              handleSaveProfileField('homeQuote', {
                ...(data.profile.homeQuote || {}),
                cite: e.target.value,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};
