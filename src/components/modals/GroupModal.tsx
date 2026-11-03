import React, { useState, useEffect } from 'react';
import { useTrackerStore } from '../../store/useTrackerStore';
import { Group } from '../../types';
import { X, AlertCircle } from 'lucide-react';

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupToEdit?: Group | null;
}

export const GroupModal: React.FC<GroupModalProps> = ({
  isOpen,
  onClose,
  groupToEdit,
}) => {
  const { addGroup, updateGroup } = useTrackerStore();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(groupToEdit ? groupToEdit.name : '');
      setError(null);
    }
  }, [isOpen, groupToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let res;
    if (groupToEdit) {
      res = updateGroup(groupToEdit.id, name);
    } else {
      res = addGroup(name);
    }

    if (res.success) {
      onClose();
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-canvas rounded-3xl p-6 sm:p-8 shadow-2xl border border-hairline animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-hairline">
          <div>
            <h2 className="text-xl font-bold text-ink">
              {groupToEdit ? 'Edit Grup' : 'Tambah Grup'}
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Grup adalah kategori induk untuk proyek-proyek Anda.
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
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Nama Grup <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Pekerjaan Kantor, Proyek Pribadi"
              required
              minLength={3}
              maxLength={150}
              className="w-full px-4 py-2.5 rounded-2xl border border-hairline bg-field text-ink text-sm focus:outline-none focus:ring-2 focus:ring-ink"
            />
          </div>

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
              {groupToEdit ? 'Simpan Perubahan' : 'Tambah Grup'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
