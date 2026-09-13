import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Briefcase } from 'lucide-react';

interface ExperienceTabProps {
  showToast: (message: string) => void;
}

export const ExperienceTab: React.FC<ExperienceTabProps> = ({ showToast }) => {
  const { data, updateCareerList, updateCaseStudy } = usePortfolio();
  const [selectedCaseId, setSelectedCaseId] = useState<string>('exp-1');

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
          </div>
        )}
      </div>
    </div>
  );
};
