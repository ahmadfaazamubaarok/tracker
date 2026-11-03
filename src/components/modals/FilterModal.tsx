import React from 'react';
import { useTrackerStore } from '../../store/useTrackerStore';
import { X, RotateCcw, Check } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { groups, projects, filter, setFilter, resetFilter } = useTrackerStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-canvas rounded-3xl p-6 sm:p-8 shadow-2xl border border-hairline animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-hairline">
          <div>
            <h2 className="text-xl font-bold text-ink">Filter Board</h2>
            <p className="text-xs text-muted mt-0.5">
              Saring kartu yang tampil pada kolom Kanban.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-muted hover:text-ink hover:bg-canvas-soft transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Filter by Group */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Filter Berdasarkan Grup
            </label>
            <select
              value={filter.id_group || ''}
              onChange={(e) =>
                setFilter({ id_group: e.target.value ? Number(e.target.value) : null })
              }
              className="w-full px-4 py-2.5 rounded-2xl border border-hairline bg-field text-ink text-sm focus:outline-none focus:ring-2 focus:ring-ink"
            >
              <option value="">Semua Grup</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Project */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Filter Berdasarkan Proyek
            </label>
            <select
              value={filter.id_project || ''}
              onChange={(e) =>
                setFilter({ id_project: e.target.value ? Number(e.target.value) : null })
              }
              className="w-full px-4 py-2.5 rounded-2xl border border-hairline bg-field text-ink text-sm focus:outline-none focus:ring-2 focus:ring-ink"
            >
              <option value="">Semua Proyek</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-hairline">
            <button
              type="button"
              onClick={() => {
                resetFilter();
              }}
              className="flex items-center space-x-1.5 text-xs text-muted hover:text-ink font-medium px-3 py-2 rounded-full hover:bg-canvas-soft"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="btn-pill btn-primary text-sm px-6 space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Terapkan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
