import React, { useState, useEffect } from 'react';
import { useTrackerStore } from '../../store/useTrackerStore';
import { CardItem, Status, Priority } from '../../types';
import { formatDateID, getPriorityLabel, getPriorityBadgeClass } from '../../utils/helpers';
import { 
  X, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Trash2, 
  Archive, 
  Plus, 
  Save, 
  Edit3,
  AlertCircle
} from 'lucide-react';

interface ProgressDetailModalProps {
  card: CardItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleteProgress: (cardId: number) => void;
}

export const ProgressDetailModal: React.FC<ProgressDetailModalProps> = ({
  card,
  isOpen,
  onClose,
  onDeleteProgress,
}) => {
  const { 
    progresses, 
    projects, 
    subtasks, 
    updateProgress, 
    updateProgressNotes, 
    archiveProgress, 
    addSubtask, 
    updateSubtaskStatus, 
    deleteSubtask 
  } = useTrackerStore();

  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [newSubtaskName, setNewSubtaskName] = useState('');
  const [subtaskError, setSubtaskError] = useState<string | null>(null);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editProjectId, setEditProjectId] = useState<number>(0);
  const [editDeadline, setEditDeadline] = useState('');
  const [editPriority, setEditPriority] = useState<Priority>('medium');
  const [editDescription, setEditDescription] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  const currentProgress = card ? progresses.find((p) => p.id === card.id) : null;
  const currentSubtasks = card ? subtasks.filter((s) => s.progress_id === card.id) : [];

  useEffect(() => {
    if (currentProgress) {
      setNotes(currentProgress.notes || '');
      setNotesSaved(false);
      setNewSubtaskName('');
      setSubtaskError(null);
      setIsEditing(false);

      setEditName(currentProgress.name);
      setEditProjectId(currentProgress.project_id);
      setEditDeadline(currentProgress.deadline);
      setEditPriority(currentProgress.priority);
      setEditDescription(currentProgress.description || '');
      setEditError(null);
    }
  }, [currentProgress, isOpen]);

  if (!isOpen || !card || !currentProgress) return null;

  const handleSaveNotes = () => {
    const res = updateProgressNotes(currentProgress.id, notes);
    if (res.success) {
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    }
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    setSubtaskError(null);
    const res = addSubtask(currentProgress.id, newSubtaskName);
    if (res.success) {
      setNewSubtaskName('');
    } else {
      setSubtaskError(res.message);
    }
  };

  const handleArchive = () => {
    const res = archiveProgress(currentProgress.id);
    if (res.success) {
      onClose();
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    const res = updateProgress(currentProgress.id, {
      project_id: editProjectId,
      name: editName,
      deadline: editDeadline,
      priority: editPriority,
      description: editDescription,
    });
    if (res.success) {
      setIsEditing(false);
    } else {
      setEditError(res.message);
    }
  };

  const getNextStatus = (current: Status): Status => {
    if (current === 'pending') return 'wip';
    if (current === 'wip') return 'done';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-canvas rounded-3xl p-6 sm:p-8 shadow-2xl border border-hairline my-8 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-hairline">
          <div className="flex items-center space-x-2">
            <span
              className="dot"
              style={{ backgroundColor: card.project_color || '#3B82F6' }}
            />
            <span className="text-xs font-semibold text-ink">
              {card.project_name}
            </span>
            <span className="text-xs text-muted">/</span>
            <span className="text-xs text-muted">{card.group_name}</span>
          </div>

          <div className="flex items-center space-x-2">
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded-full text-muted hover:text-ink hover:bg-canvas-soft transition-colors"
                title="Edit Progres"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}

            {currentProgress.status === 'done' && !currentProgress.archived && (
              <button
                type="button"
                onClick={handleArchive}
                className="btn-pill btn-soft text-xs py-1 px-3 space-x-1"
                title="Arsipkan progres ini"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Arsipkan</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-muted hover:text-ink hover:bg-canvas-soft transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
          {/* If Editing Mode */}
          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              {editError && (
                <div className="p-3 rounded-2xl bg-red-50 text-red-700 text-xs flex items-center space-x-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Nama Progres</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  minLength={3}
                  maxLength={150}
                  className="w-full px-4 py-2 rounded-2xl border border-hairline bg-field text-ink text-sm focus:outline-none focus:ring-2 focus:ring-ink"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Proyek</label>
                  <select
                    value={editProjectId}
                    onChange={(e) => setEditProjectId(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-2xl border border-hairline bg-field text-ink text-sm focus:outline-none focus:ring-2 focus:ring-ink"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Deadline</label>
                  <input
                    type="date"
                    value={editDeadline}
                    onChange={(e) => setEditDeadline(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-2xl border border-hairline bg-field text-ink text-sm focus:outline-none focus:ring-2 focus:ring-ink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Prioritas</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setEditPriority(p)}
                      className={`py-1.5 px-3 rounded-xl text-xs font-medium border text-center ${
                        editPriority === p
                          ? 'bg-ink text-white border-ink'
                          : 'bg-field text-muted border-hairline'
                      }`}
                    >
                      {p === 'low' ? 'Rendah' : p === 'medium' ? 'Sedang' : 'Tinggi'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Deskripsi</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 rounded-2xl border border-hairline bg-field text-ink text-sm focus:outline-none focus:ring-2 focus:ring-ink resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-pill btn-soft text-xs py-1.5 px-4"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-pill btn-primary text-xs py-1.5 px-5"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Normal View: Title & Badges */}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-ink leading-tight mb-2">
                  {currentProgress.name}
                </h1>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className={`chip ${getPriorityBadgeClass(currentProgress.priority)}`}>
                    Prioritas {getPriorityLabel(currentProgress.priority)}
                  </span>

                  <span className="chip bg-field text-muted border border-hairline">
                    Status: <strong className="ml-1 uppercase">{currentProgress.status}</strong>
                  </span>

                  <span
                    className={`chip flex items-center space-x-1 ${
                      card.is_overdue
                        ? 'bg-red-50 text-overdue border border-red-200'
                        : 'bg-field text-muted border border-hairline'
                    }`}
                  >
                    <Calendar className="w-3 h-3" />
                    <span>Deadline: {formatDateID(currentProgress.deadline)}</span>
                    {card.is_overdue && <span className="font-bold">(Terlambat)</span>}
                  </span>
                </div>

                {currentProgress.description && (
                  <p className="mt-3 text-sm text-ink-soft bg-canvas-soft/60 p-3.5 rounded-2xl border border-hairline/80 leading-relaxed">
                    {currentProgress.description}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Subtasks Section */}
          <div className="pt-2 border-t border-hairline">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-ink flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-ink" />
                <span>Sub Tugas / Checklist</span>
                <span className="text-xs text-muted font-normal">
                  ({currentSubtasks.filter((s) => s.status === 'done').length}/{currentSubtasks.length})
                </span>
              </h3>
            </div>

            {/* Add Subtask Form */}
            <form onSubmit={handleAddSubtask} className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSubtaskName}
                onChange={(e) => setNewSubtaskName(e.target.value)}
                placeholder="Tambah sub tugas baru..."
                className="flex-1 px-3.5 py-1.5 rounded-xl border border-hairline bg-field text-ink text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-ink"
              />
              <button
                type="submit"
                className="btn-pill btn-primary text-xs py-1.5 px-4 space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </form>

            {subtaskError && (
              <p className="text-xs text-red-600 mb-2">{subtaskError}</p>
            )}

            {/* Subtasks List */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {currentSubtasks.map((sub) => {
                const nextSt = getNextStatus(sub.status);
                return (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-canvas-soft border border-hairline hover:border-ink/20 transition-all text-xs"
                  >
                    <div className="flex items-center space-x-2.5 flex-1 min-w-0 mr-2">
                      <button
                        type="button"
                        onClick={() => updateSubtaskStatus(sub.id, nextSt)}
                        title={`Klik untuk ubah status ke ${nextSt}`}
                        className="text-muted hover:text-ink transition-colors flex-shrink-0"
                      >
                        {sub.status === 'done' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : sub.status === 'wip' ? (
                          <Clock className="w-4 h-4 text-amber-600" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted" />
                        )}
                      </button>

                      <span
                        className={`truncate ${
                          sub.status === 'done' ? 'line-through text-muted' : 'text-ink'
                        }`}
                      >
                        {sub.name}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => updateSubtaskStatus(sub.id, nextSt)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          sub.status === 'done'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : sub.status === 'wip'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-field text-muted border border-hairline'
                        }`}
                      >
                        {sub.status}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteSubtask(sub.id)}
                        className="w-5 h-5 flex items-center justify-center rounded-full text-muted hover:text-red-600 hover:bg-red-50"
                        title="Hapus sub tugas"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {currentSubtasks.length === 0 && (
                <div className="text-center py-4 text-xs text-muted bg-field/40 rounded-xl border border-dashed border-hairline">
                  Belum ada sub tugas. Tambahkan poin-poin checklist di atas.
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div className="pt-2 border-t border-hairline">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-ink flex items-center space-x-2">
                <FileText className="w-4 h-4 text-ink" />
                <span>Catatan Tambahan</span>
              </label>

              <div className="flex items-center space-x-2">
                {notesSaved && (
                  <span className="text-xs text-emerald-600 font-medium">Tersimpan!</span>
                )}
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="btn-pill btn-soft text-xs py-1 px-3 space-x-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Catatan</span>
                </button>
              </div>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={2000}
              rows={4}
              placeholder="Tuliskan catatan teknis, link referensi, credential dev, dsb..."
              className="w-full px-4 py-2.5 rounded-2xl border border-hairline bg-field text-ink text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-ink resize-none placeholder:text-muted/60"
            />
            <div className="text-right text-[10px] text-muted mt-1">
              {notes.length} / 2000 karakter
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-hairline flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Yakin ingin menghapus progres ini secara permanen?')) {
                onDeleteProgress(currentProgress.id);
                onClose();
              }
            }}
            className="flex items-center space-x-1 text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Progres</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="btn-pill btn-primary text-xs py-1.5 px-6"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
