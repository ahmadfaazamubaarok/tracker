import React, { useState } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { Group } from '../types';
import { Layers, Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';

interface GroupViewProps {
  onOpenAddGroup: () => void;
  onOpenEditGroup: (group: Group) => void;
}

export const GroupView: React.FC<GroupViewProps> = ({
  onOpenAddGroup,
  onOpenEditGroup,
}) => {
  const { groups, projects, deleteGroup } = useTrackerStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = (id: number) => {
    setErrorMessage(null);
    const count = projects.filter((p) => p.group_id === id).length;
    if (count > 0) {
      setErrorMessage('Grup tidak bisa dihapus karena masih memiliki proyek.');
      return;
    }

    if (window.confirm('Yakin ingin menghapus grup ini?')) {
      const res = deleteGroup(id);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-hairline mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Daftar Grup</h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Grup digunakan untuk mengelompokkan proyek berdasarkan domain atau divisi kerja.
          </p>
        </div>
        <button
          onClick={onOpenAddGroup}
          className="btn-pill btn-primary text-sm space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Grup</span>
        </button>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3 rounded-2xl bg-red-50 text-red-700 text-xs sm:text-sm flex items-center justify-between border border-red-200">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs underline font-medium hover:text-red-900"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Table / List */}
      {groups.length > 0 ? (
        <div className="bg-canvas rounded-3xl border border-hairline overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-canvas-soft border-b border-hairline text-xs font-semibold text-muted uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Nama Grup</th>
                  <th className="py-3.5 px-6 text-center">Jumlah Proyek</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {groups.map((group) => {
                  const projCount = projects.filter((p) => p.group_id === group.id).length;
                  return (
                    <tr
                      key={group.id}
                      className="hover:bg-canvas-soft/40 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-ink">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-field flex items-center justify-center text-ink flex-shrink-0">
                            <Layers className="w-4 h-4" />
                          </div>
                          <span>{group.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-field text-ink border border-hairline">
                          {projCount} Proyek
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onOpenEditGroup(group)}
                            className="p-1.5 rounded-full text-muted hover:text-ink hover:bg-field transition-colors"
                            title="Edit Grup"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(group.id)}
                            className="p-1.5 rounded-full text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Hapus Grup"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-canvas-soft rounded-3xl border border-hairline p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-field flex items-center justify-center text-ink">
            <Layers className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-ink mb-1">Belum ada grup</h2>
          <p className="text-xs text-muted mb-6 max-w-sm mx-auto">
            Grup merupakan wadah utama untuk mengelompokkan proyek.
          </p>
          <button
            onClick={onOpenAddGroup}
            className="btn-pill btn-primary text-sm space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Grup Pertama</span>
          </button>
        </div>
      )}
    </div>
  );
};
