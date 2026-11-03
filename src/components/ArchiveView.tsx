import React from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { formatDateID, getPriorityLabel, getPriorityBadgeClass } from '../utils/helpers';
import { Archive, RotateCcw, Trash2, Calendar } from 'lucide-react';

export const ArchiveView: React.FC = () => {
  const { progresses, projects, groups, restoreProgress, deleteProgress } = useTrackerStore();

  const archivedItems = progresses.filter((p) => p.archived);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="pb-6 border-b border-hairline mb-6">
        <h1 className="text-2xl font-bold text-ink tracking-tight">Arsip Progres</h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Daftar progres yang telah diselesaikan dan diarsipkan dari board utama.
        </p>
      </div>

      {archivedItems.length > 0 ? (
        <div className="bg-canvas rounded-3xl border border-hairline overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-canvas-soft border-b border-hairline text-xs font-semibold text-muted uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Nama Progres</th>
                  <th className="py-3.5 px-6">Proyek</th>
                  <th className="py-3.5 px-6">Grup</th>
                  <th className="py-3.5 px-6">Prioritas</th>
                  <th className="py-3.5 px-6">Deadline</th>
                  <th className="py-3.5 px-6">Diarsipkan Pada</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {archivedItems.map((prog) => {
                  const proj = projects.find((p) => p.id === prog.project_id);
                  const grp = groups.find((g) => g.id === proj?.group_id);

                  return (
                    <tr
                      key={prog.id}
                      className="hover:bg-canvas-soft/40 transition-colors"
                    >
                      <td className="py-4 px-6 font-semibold text-ink">
                        {prog.name}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <span
                            className="dot"
                            style={{ backgroundColor: proj?.color || '#3B82F6' }}
                          />
                          <span className="font-medium text-ink text-xs sm:text-sm">
                            {proj ? proj.name : 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-muted text-xs sm:text-sm">
                        {grp ? grp.name : '-'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`chip ${getPriorityBadgeClass(prog.priority)}`}>
                          {getPriorityLabel(prog.priority)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-muted">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDateID(prog.deadline)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-muted">
                        {formatDateID(prog.archived_at)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => restoreProgress(prog.id)}
                            className="btn-pill btn-soft text-xs py-1 px-3 space-x-1"
                            title="Pulihkan kembali ke kolom Selesai"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Pulihkan</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  'Hapus progres ini secara permanen dari sistem?'
                                )
                              ) {
                                deleteProgress(prog.id);
                              }
                            }}
                            className="p-1.5 rounded-full text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Hapus Permanen"
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
            <Archive className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-ink mb-1">Arsip Kosong</h2>
          <p className="text-xs text-muted max-w-sm mx-auto">
            Progres yang berada di kolom Selesai pada board dapat diarsipkan untuk menjaga papan kerja tetap bersih.
          </p>
        </div>
      )}
    </div>
  );
};
