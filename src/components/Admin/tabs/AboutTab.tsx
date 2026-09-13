import React from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { ProfileData } from '../../../types';
import { FileText } from 'lucide-react';

interface AboutTabProps {
  showToast: (message: string) => void;
}

export const AboutTab: React.FC<AboutTabProps> = ({ showToast }) => {
  const { data, updateProfile } = usePortfolio();

  const handleSaveProfileField = (field: keyof ProfileData, value: any) => {
    updateProfile({ [field]: value });
    showToast(`Updated ${String(field)}`);
  };

  return (
    <div className="admin-section">
      {/* 1. Bio & Philosophy */}
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

      {/* 2. Architecture Approach Principles */}
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
