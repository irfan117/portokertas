import React from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Mail } from 'lucide-react';

interface ContactTabProps {
  showToast: (message: string) => void;
}

export const ContactTab: React.FC<ContactTabProps> = ({ showToast }) => {
  const { data, updateContact, updateNowItems } = usePortfolio();

  return (
    <div className="admin-section">
      {/* 1. Contact Information & Social Links */}
      <div className="admin-card">
        <h2 className="admin-card-title">Contact Information &amp; Channels</h2>
        <p className="admin-card-desc">
          Manage publicly displayed communication channels and social developer links.
        </p>

        <div className="admin-field">
          <label>Contact Page Title</label>
          <input
            type="text"
            value={data.contact.heading}
            onChange={(e) => {
              updateContact({ heading: e.target.value });
              showToast('Contact title updated');
            }}
          />
        </div>

        <div className="admin-grid-2">
          <div className="admin-field">
            <label>Primary Email</label>
            <input
              type="email"
              value={data.contact.email}
              onChange={(e) => {
                updateContact({ email: e.target.value });
                showToast('Email updated');
              }}
            />
          </div>
          <div className="admin-field">
            <label>GitHub Profile URL</label>
            <input
              type="text"
              value={data.contact.github}
              onChange={(e) => {
                updateContact({ github: e.target.value });
                showToast('GitHub link updated');
              }}
            />
          </div>
        </div>

        <div className="admin-grid-2">
          <div className="admin-field">
            <label>LinkedIn Profile URL</label>
            <input
              type="text"
              value={data.contact.linkedin}
              onChange={(e) => {
                updateContact({ linkedin: e.target.value });
                showToast('LinkedIn link updated');
              }}
            />
          </div>
          <div className="admin-field">
            <label>X / Twitter URL</label>
            <input
              type="text"
              value={data.contact.xTwitter}
              onChange={(e) => {
                updateContact({ xTwitter: e.target.value });
                showToast('X / Twitter link updated');
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. Side Drawer "Now" Items */}
      <div className="admin-card">
        <h2 className="admin-card-title">Side Drawer "Now" Status Feed</h2>
        <p className="admin-card-desc">
          These items appear inside the sliding aside panel on the right of the screen.
        </p>

        {(data.nowItems || []).map((item, idx) => (
          <div key={idx} className="admin-grid-2" style={{ marginBottom: '1rem' }}>
            <div className="admin-field">
              <label>Status Label (e.g. Building, Learning, Reading)</label>
              <input
                type="text"
                value={item.k}
                onChange={(e) => {
                  const nextItems = [...data.nowItems];
                  nextItems[idx] = { ...nextItems[idx], k: e.target.value };
                  updateNowItems(nextItems);
                  showToast('Now item updated');
                }}
              />
            </div>
            <div className="admin-field">
              <label>Current Activity</label>
              <input
                type="text"
                value={item.v}
                onChange={(e) => {
                  const nextItems = [...data.nowItems];
                  nextItems[idx] = { ...nextItems[idx], v: e.target.value };
                  updateNowItems(nextItems);
                  showToast('Now item updated');
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
