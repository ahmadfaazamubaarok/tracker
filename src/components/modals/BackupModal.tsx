import React, { useState, useRef } from 'react';
import { useTrackerStore } from '../../store/useTrackerStore';
import { X, Download, Upload, Copy, Check, Sparkles, Trash2, AlertCircle } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose }) => {
  const { exportData, importData, loadSampleData, clearAllData } = useTrackerStore();

  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [pastedJson, setPastedJson] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDownloadJson = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyClipboard = () => {
    const jsonStr = exportData();
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = importData(content);
        setImportStatus(res);
        if (res.success) {
          setTimeout(() => {
            setImportStatus(null);
            onClose();
          }, 1500);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImportText = () => {
    if (!pastedJson.trim()) return;
    const res = importData(pastedJson);
    setImportStatus(res);
    if (res.success) {
      setPastedJson('');
      setTimeout(() => {
        setImportStatus(null);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-canvas rounded-3xl p-6 sm:p-8 shadow-2xl border border-hairline my-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-hairline">
          <div>
            <h2 className="text-xl font-bold text-ink">Backup & Sinkronisasi</h2>
            <p className="text-xs text-muted mt-0.5">
              Simpan atau pindahkan data Project Tracker Anda antar perangkat.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-muted hover:text-ink hover:bg-canvas-soft transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {importStatus && (
          <div
            className={`mb-4 p-3 rounded-2xl text-xs flex items-center space-x-2 border ${
              importStatus.success
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{importStatus.message}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Export Section */}
          <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline">
            <h3 className="text-sm font-bold text-ink mb-1 flex items-center space-x-2">
              <Download className="w-4 h-4 text-ink" />
              <span>Ekspor Data (Backup)</span>
            </h3>
            <p className="text-xs text-muted mb-3">
              Unduh seluruh grup, proyek, dan kartu kanban dalam 1 file JSON mandiri.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleDownloadJson}
                className="btn-pill btn-primary text-xs py-2 px-4 space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File JSON</span>
              </button>
              <button
                type="button"
                onClick={handleCopyClipboard}
                className="btn-pill btn-soft text-xs py-2 px-4 space-x-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin ke Clipboard'}</span>
              </button>
            </div>
          </div>

          {/* Import Section */}
          <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline">
            <h3 className="text-sm font-bold text-ink mb-1 flex items-center space-x-2">
              <Upload className="w-4 h-4 text-ink" />
              <span>Impor Data (Restore)</span>
            </h3>
            <p className="text-xs text-muted mb-3">
              Pulihkan data dari file backup JSON atau tempel teks JSON secara langsung.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-pill btn-soft text-xs py-2 px-4 space-x-1.5 w-full justify-center"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Pilih File Backup JSON</span>
              </button>

              <div className="relative">
                <textarea
                  value={pastedJson}
                  onChange={(e) => setPastedJson(e.target.value)}
                  rows={2}
                  placeholder="Atau tempel (paste) kode JSON di sini..."
                  className="w-full px-3 py-2 rounded-xl border border-hairline bg-canvas text-ink text-xs focus:outline-none focus:ring-1 focus:ring-ink font-mono resize-none placeholder:text-muted/60"
                />
                {pastedJson.trim() && (
                  <button
                    type="button"
                    onClick={handleImportText}
                    className="btn-pill btn-primary text-[11px] py-1 px-3 mt-1 float-right"
                  >
                    Terapkan JSON
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Preset / Sample Data & Reset */}
          <div className="flex items-center justify-between pt-2 border-t border-hairline text-xs">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Muat contoh data untuk demonstrasi?')) {
                  loadSampleData();
                  onClose();
                }
              }}
              className="flex items-center space-x-1 text-muted hover:text-ink font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Muat Contoh Data</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    'Peringatan: Seluruh grup, proyek, dan progres akan dihapus permanen. Lanjutkan?'
                  )
                ) {
                  clearAllData();
                  onClose();
                }
              }}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Total Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
