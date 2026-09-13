import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Database, Download, Upload, AlertTriangle } from 'lucide-react';

interface BackupTabProps {
  showToast: (message: string) => void;
}

export const BackupTab: React.FC<BackupTabProps> = ({ showToast }) => {
  const { data, importData, resetToDefaults } = usePortfolio();
  const [jsonInput, setJsonInput] = useState('');

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `irfan-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Portfolio configuration backup downloaded');
  };

  const handleImportJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.profile || !parsed.workProjects) {
        throw new Error('JSON format is missing required portfolio properties (profile, workProjects).');
      }
      importData(parsed);
      setJsonInput('');
      showToast('Configuration successfully imported!');
    } catch (err: any) {
      alert(`Import error: ${err.message || 'Invalid JSON syntax'}`);
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all data to default? Any custom projects and telemetry edits will be erased.'
      )
    ) {
      resetToDefaults();
      showToast('Data reset to factory defaults');
    }
  };

  return (
    <div className="admin-section">
      {/* 1. Export / Backup */}
      <div className="admin-card">
        <h2 className="admin-card-title">Export / Backup Content</h2>
        <p className="admin-card-desc">
          Download your entire portfolio configuration as a JSON file to save an offline
          backup or transfer your custom setup.
        </p>
        <button className="btn btn--primary" onClick={handleExportJSON}>
          <Download size={14} style={{ marginRight: '0.4rem' }} />
          <span>Download Backup (.json)</span>
        </button>
      </div>

      {/* 2. Import Content */}
      <div className="admin-card">
        <h2 className="admin-card-title">Import Content from JSON</h2>
        <p className="admin-card-desc">
          Paste a previously exported JSON configuration to restore or populate portfolio content.
        </p>
        <div className="admin-field">
          <textarea
            rows={6}
            placeholder="Paste JSON configuration here..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.85rem' }}
          />
        </div>
        <button
          className="btn btn--ghost"
          onClick={handleImportJSON}
          disabled={!jsonInput.trim()}
        >
          <Upload size={14} style={{ marginRight: '0.4rem' }} />
          <span>Apply Imported JSON</span>
        </button>
      </div>

      {/* 3. Factory Reset */}
      <div
        className="admin-card"
        style={{ borderColor: '#FFD2D2', background: '#FFFDFD' }}
      >
        <h2 className="admin-card-title" style={{ color: '#D32F2F' }}>
          Reset to Factory Defaults
        </h2>
        <p className="admin-card-desc">
          Erase all custom changes stored in local storage and restore the original portfolio
          data.
        </p>
        <button
          className="btn btn--ghost"
          style={{ borderColor: '#D32F2F', color: '#D32F2F' }}
          onClick={handleReset}
        >
          <AlertTriangle size={14} style={{ marginRight: '0.4rem' }} />
          <span>Reset Everything to Defaults</span>
        </button>
      </div>
    </div>
  );
};
