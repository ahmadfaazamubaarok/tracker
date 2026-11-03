import React, { useState, useEffect } from 'react';
import { useTrackerStore } from '../../store/useTrackerStore';
import { Priority } from '../../types';
import { getDefaultDeadline } from '../../utils/helpers';
import { X, Calendar, AlertCircle } from 'lucide-react';

interface ProgressAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProgressAddModal: React.FC<ProgressAddModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { projects, addProgress } = useTrackerStore();

  const [projectId, setProjectId] = useState<number>(0);
  const [name, setName] = useState('');
  const [deadline, setDeadline] = useState(getDefaultDeadline());
  const [priority, setPriority] = useState<Priority>('medium');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && projects.length > 0) {
      if (!projectId || !projects.some((p) => p.id === projectId)) {
        setProjectId(projects[0].id);
      }
      setName('');
      setDeadline(getDefaultDeadline());
      setPriority('medium');
      setDescription('');
      setError(null);
    }
  }, [isOpen, projects]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = addProgress({
      project_id: projectId,
      name,
      deadline,
      priority,
      description,
    });

    if (res.success) {
      onClose();
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-canvas rounded-3xl p-6 sm:p-8 shadow-2xl border border-hairline animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-hairline">
          <div>
            <h2 className="text-xl font-bold text-ink">Tambah Progres</h2>
            <p className="text-xs text-muted mt-0.5">
              Kartu baru akan otomatis dimasukkan ke kolom Pending.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-muted hover:text-ink hover:bg-canvas-soft transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 text-red-700 text-xs flex items-center space-x-2 border border-red-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Select */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Pilih Proyek <span className="text-red-500">*</span>
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(Number(e.target.value))}
              required
              className="w-full px-4 py-2.5 rounded-2xl border border-hairline bg-field text-ink text-sm focus:outline-none focus:ring-2 focus:ring-ink"
            >
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.name}
                </option>
              ))}
            </select>
          </div>

          {/* Progress Name */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Nama Progres <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Implementasi Otentikasi JWT"
              required
              minLength={3}
              maxLength={150}
              className="w-full px-4 py-2.5 rounded-2xl border border-hairline bg-field text-ink text-sm focus:outline-none focus:ring-2 focus:ring-ink placeholder:text-muted/60"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Deadline <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl border border-hairline bg-field text-ink text-sm focus:outline-none focus:ring-2 focus:ring-ink"
              />
              <Calendar className="w-4 h-4 text-muted absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Prioritas <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as Priority[]).map((p) => {
                const isSelected = priority === p;
                const label = p === 'low' ? 'Rendah' : p === 'medium' ? 'Sedang' : 'Tinggi';
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 px-3 rounded-2xl text-xs font-medium border text-center transition-all ${
                      isSelected
                        ? 'bg-ink text-white border-ink shadow-sm'
                        : 'bg-field text-muted border-hairline hover:bg-canvas-soft'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Deskripsi Singkat (Opsional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Jelaskan kebutuhan ringkas tugas ini..."
              className="w-full px-4 py-2.5 rounded-2xl border border-hairline bg-field text-ink text-sm focus:outline-none focus:ring-2 focus:ring-ink placeholder:text-muted/60 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-hairline">
            <button
              type="button"
              onClick={onClose}
              className="btn-pill btn-soft text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-pill btn-primary text-sm px-6"
            >
              Simpan Progres
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
