import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { TalkWriting } from '../../../types';
import { Plus, Trash2, Mic2 } from 'lucide-react';

interface TalksWritingTabProps {
  showToast: (message: string) => void;
}

export const TalksWritingTab: React.FC<TalksWritingTabProps> = ({ showToast }) => {
  const { data, addTalkWriting, deleteTalkWriting } = usePortfolio();

  const [newTalk, setNewTalk] = useState<TalkWriting>({
    title: '',
    desc: '',
    tag: 'Writing',
  });

  const handleAddTalk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTalk.title.trim() || !newTalk.desc.trim()) {
      alert('Please provide title and description.');
      return;
    }
    addTalkWriting(newTalk);
    setNewTalk({ title: '', desc: '', tag: 'Writing' });
    showToast(`Added "${newTalk.title}" to marquee`);
  };

  return (
    <div className="admin-section">
      {/* 1. Add Talk / Writing Item */}
      <div className="admin-card">
        <h2 className="admin-card-title">+ Add New Talk or Writing Item</h2>
        <p className="admin-card-desc">
          These items animate across the infinite marquee strip and showcase public lectures, essays, and workshops.
        </p>

        <form onSubmit={handleAddTalk} className="admin-form">
          <div className="admin-grid-2">
            <div className="admin-field">
              <label>Title *</label>
              <input
                type="text"
                placeholder="e.g. Designing for failure: consensus algorithms in production"
                value={newTalk.title}
                onChange={(e) => setNewTalk({ ...newTalk, title: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label>Tag / Category</label>
              <select
                value={newTalk.tag}
                onChange={(e) => setNewTalk({ ...newTalk, tag: e.target.value })}
              >
                <option value="Writing">Writing</option>
                <option value="Talk">Talk</option>
                <option value="Workshop">Workshop</option>
                <option value="Podcast">Podcast</option>
              </select>
            </div>
          </div>

          <div className="admin-field">
            <label>Description *</label>
            <textarea
              rows={2}
              placeholder="Summary of the talk, essay, or workshop keynote..."
              value={newTalk.desc}
              onChange={(e) => setNewTalk({ ...newTalk, desc: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn btn--primary"
            style={{ alignSelf: 'flex-start' }}
          >
            <Plus size={14} />
            <span>Add to Marquee</span>
          </button>
        </form>
      </div>

      {/* 2. Marquee Items List */}
      <div className="admin-card">
        <h2 className="admin-card-title">Marquee Items ({data.talksWriting.length})</h2>
        <div className="admin-items-list">
          {data.talksWriting.map((item, idx) => (
            <div key={idx} className="admin-item-row compact">
              <div className="admin-item-info">
                <div className="admin-item-header">
                  <h4>{item.title}</h4>
                  <span className="admin-tag-pill">{item.tag}</span>
                </div>
                <p className="admin-item-desc">{item.desc}</p>
              </div>
              <div className="admin-item-actions">
                <button
                  className="admin-action-btn danger"
                  onClick={() => {
                    deleteTalkWriting(idx);
                    showToast('Talk/Writing removed from marquee');
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
