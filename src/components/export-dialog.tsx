'use client';

import { useState } from 'react';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => Promise<void>;
}

export function ExportDialog({ isOpen, onClose, onExport }: ExportDialogProps) {
  const [exporting, setExporting] = useState(false);

  if (!isOpen) return null;

  async function handleExport() {
    setExporting(true);
    try {
      await onExport();
      onClose();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl p-6 max-w-sm w-full mx-4">
        <h2 className="text-lg font-bold text-white mb-2">Export as PNG</h2>
        <p className="text-sm text-neutral-400 mb-4">
          Download your tier list as a high-resolution PNG image.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-sm transition-colors"
            onClick={onClose}
            disabled={exporting}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? 'Exporting...' : 'Download PNG'}
          </button>
        </div>
      </div>
    </div>
  );
}
