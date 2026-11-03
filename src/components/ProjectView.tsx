import React, { useState } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { Project } from '../types';
import { formatDomainUrl } from '../utils/helpers';
import { 
  FolderKanban, 
  Plus, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Folder, 
  AlertCircle,
  Layers
} from 'lucide-react';

interface ProjectViewProps {
  onOpenAddProject: () => void;
  onOpenEditProject: (project: Project) => void;
  onNavigateToGroup: () => void;
}

export const ProjectView: React.FC<ProjectViewProps> = ({
  onOpenAddProject,
  onOpenEditProject,
  onNavigateToGroup,
}) => {
  const { projects, groups, progresses, deleteProject } = useTrackerStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = (id: number) => {
    setErrorMessage(null);
    const count = progresses.filter((p) => p.project_id === id).length;
    if (count > 0) {
      setErrorMessage('Proyek tidak bisa dihapus karena masih memiliki progres.');
      return;
    }

    if (window.confirm('Yakin ingin menghapus proyek ini?')) {
      const res = deleteProject(id);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    }
  };

  // Guard: if no groups
  if (groups.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-xl mx-auto my-12 p-8 text-center bg-canvas-soft rounded-3xl border border-hairline">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-field flex items-center justify-center text-ink">
            <Layers className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-ink mb-2">Belum ada grup</h2>
          <p className="text-sm text-muted mb-6 max-w-sm mx-auto">
            Proyek membutuhkan minimal 1 grup sebagai wadah. Silakan buat grup terlebih dahulu.
          </p>
          <button
            onClick={onNavigateToGroup}
            className="btn-pill btn-primary space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Grup Pertama</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-hairline mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Daftar Proyek</h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Kelola data proyek, alamat domain, direktori lokal, dan warna identitas.
          </p>
        </div>
        <button
          onClick={onOpenAddProject}
          className="btn-pill btn-primary text-sm space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Proyek</span>
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

      {/* Projects Table / List */}
      {projects.length > 0 ? (
        <div className="bg-canvas rounded-3xl border border-hairline overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-canvas-soft border-b border-hairline text-xs font-semibold text-muted uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Nama Proyek</th>
                  <th className="py-3.5 px-6">Grup</th>
                  <th className="py-3.5 px-6">Domain</th>
                  <th className="py-3.5 px-6">Direktori Lokal</th>
                  <th className="py-3.5 px-6 text-center">Progres</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {projects.map((proj) => {
                  const grp = groups.find((g) => g.id === proj.group_id);
                  const progCount = progresses.filter((p) => p.project_id === proj.id).length;
                  const domainHref = formatDomainUrl(proj.domain);

                  return (
                    <tr
                      key={proj.id}
                      className="hover:bg-canvas-soft/40 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-ink">
                        <div className="flex items-center space-x-2.5">
                          <span
                            className="dot"
                            style={{ backgroundColor: proj.color }}
                          />
                          <span className="font-semibold">{proj.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-muted text-xs sm:text-sm">
                        {grp ? grp.name : '-'}
                      </td>
                      <td className="py-4 px-6">
                        <a
                          href={domainHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs text-accent hover:underline font-mono"
                        >
                          <span>{proj.domain}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-1.5 text-xs text-muted font-mono bg-field px-2.5 py-1 rounded-xl border border-hairline max-w-[200px] truncate">
                          <Folder className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{proj.directory_path}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-field text-ink border border-hairline">
                          {progCount} Progres
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onOpenEditProject(proj)}
                            className="p-1.5 rounded-full text-muted hover:text-ink hover:bg-field transition-colors"
                            title="Edit Proyek"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(proj.id)}
                            className="p-1.5 rounded-full text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Hapus Proyek"
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
            <FolderKanban className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-ink mb-1">Belum ada proyek</h2>
          <p className="text-xs text-muted mb-6 max-w-sm mx-auto">
            Tambahkan proyek untuk mengelompokkan progres dan tugas-tugas Anda.
          </p>
          <button
            onClick={onOpenAddProject}
            className="btn-pill btn-primary text-sm space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Proyek Pertama</span>
          </button>
        </div>
      )}
    </div>
  );
};
