import React, { useState, useEffect } from 'react';
import { useTrackerStore } from '../../store/useTrackerStore';
import { Project } from '../../types';
import { X, AlertCircle } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
}

const COLOR_PALETTE = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#141414', // Ink/Black
];

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  projectToEdit,
}) => {
  const { groups, addProject, updateProject } = useTrackerStore();

  const [groupId, setGroupId] = useState<number>(0);
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [directoryPath, setDirectoryPath] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (projectToEdit) {
        setGroupId(projectToEdit.group_id);
        setName(projectToEdit.name);
        setDomain(projectToEdit.domain);
        setDirectoryPath(projectToEdit.directory_path);
        setColor(projectToEdit.color);
        setDescription(projectToEdit.description || '');
      } else {
        setGroupId(groups.length > 0 ? groups[0].id : 0);
        setName('');
        setDomain('');
        setDirectoryPath('');
        setColor(COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)]);
        setDescription('');
      }
      setError(null);
    }
  }, [isOpen, projectToEdit, groups]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let res;
    if (projectToEdit) {
      res = updateProject(projectToEdit.id, {
        group_id: groupId,
        name,
        domain,
        directory_path: directoryPath,
        color,
        description,
      });
    } else {
      res = addProject({
        group_id: groupId,
        name,
        domain,
        directory_path: directoryPath,
        color,
        description,
      });
    }

    if (res.success) {
      onClose();
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-canvas rounded-3xl p-6 sm:p-8 shadow-2xl border border-hairline my-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-hairline">
          <div>
            <h2 className="text-xl font-bold text-ink">
              {projectToEdit ? 'Edit Proyek' : 'Tambah Proyek'}
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Kelola entitas proyek dengan domain dan direktori lokal.
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
          {/* Group */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Grup Induk <span className="text-red-500">*</span>
            </label>
            <select
              value={groupId}
              onChange={(e) => setGroupId(Number(e.target.value))}
              required
              className="w-full px-4 py-2.5 rounded-2xl border border-hairline bg-field text-ink text-sm focus:outline-none focus:ring-2 focus:ring-ink"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Nama Proyek <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Website Perusahaan"
              required
              minLength={3}
              maxLength={150}
              className="w-full px-4 py-2.5 rounded-2xl border border-hairline bg-field text-ink text-sm focus:outline-none focus:ring-2 focus:ring-ink"
            />
          </div>

          {/* Domain & Directory Path */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Alamat Domain <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="misal: company.com"
                required
                className="w-full px-4 py-2.5 rounded-2xl border border-hairline bg-field text-ink text-sm focus:outline-none focus:ring-2 focus:ring-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Direktori Lokal <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={directoryPath}
                onChange={(e) => setDirectoryPath(e.target.value)}
                placeholder="misal: /var/www/company"
                required
                className="w-full px-4 py-2.5 rounded-2xl border border-hairline bg-field text-ink text-sm focus:outline-none focus:ring-2 focus:ring-ink font-mono text-xs"
              />
            </div>
          </div>

          {/* Color palette */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Warna Identitas Proyek <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    color.toLowerCase() === c.toLowerCase()
                      ? 'scale-110 border-ink ring-2 ring-offset-2 ring-ink/30'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <div className="flex items-center ml-2 space-x-1">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-7 h-7 rounded-full border-0 cursor-pointer p-0 bg-transparent"
                />
                <span className="text-xs text-muted font-mono">{color}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Deskripsi Proyek (Opsional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              maxLength={1000}
              placeholder="Catatan mengenai proyek ini..."
              className="w-full px-4 py-2.5 rounded-2xl border border-hairline bg-field text-ink text-sm focus:outline-none focus:ring-2 focus:ring-ink resize-none"
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
              {projectToEdit ? 'Simpan Perubahan' : 'Tambah Proyek'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
