import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Group, Project, Progress, Subtask, BoardFilter, ViewTab, Priority, Status, CardItem } from '../types';
import { isOverdue } from '../utils/helpers';

interface TrackerState {
  groups: Group[];
  projects: Project[];
  progresses: Progress[];
  subtasks: Subtask[];
  filter: BoardFilter;
  currentTab: ViewTab;

  // Navigation
  setCurrentTab: (tab: ViewTab) => void;
  setFilter: (filter: Partial<BoardFilter>) => void;
  resetFilter: () => void;

  // Groups
  addGroup: (name: string) => { success: boolean; message: string };
  updateGroup: (id: number, name: string) => { success: boolean; message: string };
  deleteGroup: (id: number) => { success: boolean; message: string };

  // Projects
  addProject: (data: {
    group_id: number;
    name: string;
    description?: string;
    domain: string;
    directory_path: string;
    color: string;
  }) => { success: boolean; message: string };
  updateProject: (id: number, data: {
    group_id: number;
    name: string;
    description?: string;
    domain: string;
    directory_path: string;
    color: string;
  }) => { success: boolean; message: string };
  deleteProject: (id: number) => { success: boolean; message: string };

  // Progresses
  addProgress: (data: {
    project_id: number;
    name: string;
    description?: string;
    deadline: string;
    priority: Priority;
  }) => { success: boolean; message: string };
  updateProgress: (id: number, data: {
    project_id: number;
    name: string;
    description?: string;
    deadline: string;
    priority: Priority;
  }) => { success: boolean; message: string };
  updateProgressNotes: (id: number, notes: string) => { success: boolean; message: string };
  deleteProgress: (id: number) => { success: boolean; message: string };
  archiveProgress: (id: number) => { success: boolean; message: string };
  restoreProgress: (id: number) => { success: boolean; message: string };
  reorderProgress: (status: Status, orderedIds: number[]) => void;
  moveProgress: (
    sourceStatus: Status,
    destStatus: Status,
    sourceIndex: number,
    destIndex: number,
    cardId: number
  ) => void;

  // Subtasks
  addSubtask: (progress_id: number, name: string) => { success: boolean; message: string };
  updateSubtaskStatus: (id: number, status: Status) => { success: boolean; message: string };
  deleteSubtask: (id: number) => { success: boolean; message: string };
  reorderSubtasks: (progress_id: number, status: Status, orderedIds: number[]) => void;

  // Import / Export
  exportData: () => string;
  importData: (jsonStr: string) => { success: boolean; message: string };
  clearAllData: () => void;
  loadSampleData: () => void;
}

export const useTrackerStore = create<TrackerState>()(
  persist(
    (set, get) => ({
      groups: [],
      projects: [],
      progresses: [],
      subtasks: [],
      filter: { id_group: null, id_project: null },
      currentTab: 'board',

      setCurrentTab: (tab) => set({ currentTab: tab }),

      setFilter: (newFilter) =>
        set((state) => ({ filter: { ...state.filter, ...newFilter } })),

      resetFilter: () =>
        set({ filter: { id_group: null, id_project: null } }),

      // --- GROUPS ---
      addGroup: (name) => {
        const trimmed = name.trim();
        if (!trimmed) {
          return { success: false, message: 'Nama grup wajib diisi.' };
        }
        if (trimmed.length < 3) {
          return { success: false, message: 'Nama grup minimal 3 karakter.' };
        }
        if (trimmed.length > 150) {
          return { success: false, message: 'Nama grup maksimal 150 karakter.' };
        }

        const existing = get().groups.some(
          (g) => g.name.toLowerCase() === trimmed.toLowerCase()
        );
        if (existing) {
          return { success: false, message: 'Nama grup sudah dipakai.' };
        }

        const newId = Date.now();
        const newGroup: Group = {
          id: newId,
          name: trimmed,
          created_at: new Date().toISOString(),
        };

        set((state) => ({ groups: [...state.groups, newGroup] }));
        return { success: true, message: 'Grup berhasil ditambahkan.' };
      },

      updateGroup: (id, name) => {
        const trimmed = name.trim();
        if (!trimmed) {
          return { success: false, message: 'Nama grup wajib diisi.' };
        }
        if (trimmed.length < 3) {
          return { success: false, message: 'Nama grup minimal 3 karakter.' };
        }
        if (trimmed.length > 150) {
          return { success: false, message: 'Nama grup maksimal 150 karakter.' };
        }

        const duplicate = get().groups.some(
          (g) => g.id !== id && g.name.toLowerCase() === trimmed.toLowerCase()
        );
        if (duplicate) {
          return { success: false, message: 'Nama grup sudah dipakai.' };
        }

        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === id ? { ...g, name: trimmed, updated_at: new Date().toISOString() } : g
          ),
        }));
        return { success: true, message: 'Grup berhasil diperbarui.' };
      },

      deleteGroup: (id) => {
        const hasProjects = get().projects.some((p) => p.group_id === id);
        if (hasProjects) {
          return {
            success: false,
            message: 'Grup tidak bisa dihapus karena masih memiliki proyek.',
          };
        }

        set((state) => ({
          groups: state.groups.filter((g) => g.id !== id),
          filter: state.filter.id_group === id ? { ...state.filter, id_group: null } : state.filter,
        }));
        return { success: true, message: 'Grup berhasil dihapus.' };
      },

      // --- PROJECTS ---
      addProject: (data) => {
        const trimmedName = data.name.trim();
        if (!trimmedName) {
          return { success: false, message: 'Nama proyek wajib diisi.' };
        }
        if (trimmedName.length < 3) {
          return { success: false, message: 'Nama proyek minimal 3 karakter.' };
        }
        if (trimmedName.length > 150) {
          return { success: false, message: 'Nama proyek maksimal 150 karakter.' };
        }

        const groupExists = get().groups.some((g) => g.id === data.group_id);
        if (!groupExists) {
          return { success: false, message: 'Grup tidak valid.' };
        }

        if (!data.domain.trim()) {
          return { success: false, message: 'Domain wajib diisi.' };
        }
        if (!data.directory_path.trim()) {
          return { success: false, message: 'Direktori wajib diisi.' };
        }
        if (!/^#[0-9a-fA-F]{6}$/.test(data.color)) {
          return { success: false, message: 'Warna tidak valid.' };
        }

        const newId = Date.now();
        const newProj: Project = {
          id: newId,
          group_id: data.group_id,
          name: trimmedName,
          description: data.description ? data.description.trim() : null,
          domain: data.domain.trim(),
          directory_path: data.directory_path.trim(),
          color: data.color,
          created_at: new Date().toISOString(),
        };

        set((state) => ({ projects: [...state.projects, newProj] }));
        return { success: true, message: 'Proyek berhasil ditambahkan.' };
      },

      updateProject: (id, data) => {
        const trimmedName = data.name.trim();
        if (!trimmedName) {
          return { success: false, message: 'Nama proyek wajib diisi.' };
        }
        if (trimmedName.length < 3) {
          return { success: false, message: 'Nama proyek minimal 3 karakter.' };
        }
        if (trimmedName.length > 150) {
          return { success: false, message: 'Nama proyek maksimal 150 karakter.' };
        }

        const groupExists = get().groups.some((g) => g.id === data.group_id);
        if (!groupExists) {
          return { success: false, message: 'Grup tidak valid.' };
        }

        if (!data.domain.trim()) {
          return { success: false, message: 'Domain wajib diisi.' };
        }
        if (!data.directory_path.trim()) {
          return { success: false, message: 'Direktori wajib diisi.' };
        }
        if (!/^#[0-9a-fA-F]{6}$/.test(data.color)) {
          return { success: false, message: 'Warna tidak valid.' };
        }

        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? {
                  ...p,
                  group_id: data.group_id,
                  name: trimmedName,
                  description: data.description ? data.description.trim() : null,
                  domain: data.domain.trim(),
                  directory_path: data.directory_path.trim(),
                  color: data.color,
                  updated_at: new Date().toISOString(),
                }
              : p
          ),
        }));
        return { success: true, message: 'Proyek berhasil diperbarui.' };
      },

      deleteProject: (id) => {
        const hasProgress = get().progresses.some((p) => p.project_id === id);
        if (hasProgress) {
          return {
            success: false,
            message: 'Proyek tidak bisa dihapus karena masih memiliki progres.',
          };
        }

        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          filter: state.filter.id_project === id ? { ...state.filter, id_project: null } : state.filter,
        }));
        return { success: true, message: 'Proyek berhasil dihapus.' };
      },

      // --- PROGRESSES ---
      addProgress: (data) => {
        const trimmedName = data.name.trim();
        if (!trimmedName) {
          return { success: false, message: 'Nama progres wajib diisi.' };
        }
        if (trimmedName.length < 3) {
          return { success: false, message: 'Nama progres minimal 3 karakter.' };
        }
        if (trimmedName.length > 150) {
          return { success: false, message: 'Nama progres maksimal 150 karakter.' };
        }

        const projExists = get().projects.some((p) => p.id === data.project_id);
        if (!projExists) {
          return { success: false, message: 'Proyek tidak valid.' };
        }

        const pendingItems = get().progresses.filter(
          (p) => !p.archived && p.status === 'pending'
        );
        const maxPos = pendingItems.reduce((max, p) => Math.max(max, p.position), -1);

        const newId = Date.now();
        const newProgress: Progress = {
          id: newId,
          project_id: data.project_id,
          name: trimmedName,
          description: data.description ? data.description.trim() : null,
          notes: '',
          deadline: data.deadline,
          priority: data.priority,
          status: 'pending',
          position: maxPos + 1,
          archived: false,
          archived_at: null,
          created_at: new Date().toISOString(),
        };

        set((state) => ({ progresses: [...state.progresses, newProgress] }));
        return { success: true, message: 'Progres berhasil ditambahkan.' };
      },

      updateProgress: (id, data) => {
        const trimmedName = data.name.trim();
        if (!trimmedName) {
          return { success: false, message: 'Nama progres wajib diisi.' };
        }
        if (trimmedName.length < 3) {
          return { success: false, message: 'Nama progres minimal 3 karakter.' };
        }
        if (trimmedName.length > 150) {
          return { success: false, message: 'Nama progres maksimal 150 karakter.' };
        }

        const projExists = get().projects.some((p) => p.id === data.project_id);
        if (!projExists) {
          return { success: false, message: 'Proyek tidak valid.' };
        }

        set((state) => ({
          progresses: state.progresses.map((p) =>
            p.id === id
              ? {
                  ...p,
                  project_id: data.project_id,
                  name: trimmedName,
                  description: data.description ? data.description.trim() : null,
                  deadline: data.deadline,
                  priority: data.priority,
                  updated_at: new Date().toISOString(),
                }
              : p
          ),
        }));
        return { success: true, message: 'Progres berhasil diperbarui.' };
      },

      updateProgressNotes: (id, notes) => {
        if (notes.length > 2000) {
          return { success: false, message: 'Catatan maksimal 2000 karakter.' };
        }

        set((state) => ({
          progresses: state.progresses.map((p) =>
            p.id === id ? { ...p, notes, updated_at: new Date().toISOString() } : p
          ),
        }));
        return { success: true, message: 'Catatan berhasil disimpan.' };
      },

      deleteProgress: (id) => {
        // Cascade delete subtasks
        set((state) => ({
          progresses: state.progresses.filter((p) => p.id !== id),
          subtasks: state.subtasks.filter((s) => s.progress_id !== id),
        }));
        return { success: true, message: 'Progres berhasil dihapus.' };
      },

      archiveProgress: (id) => {
        const prog = get().progresses.find((p) => p.id === id);
        if (!prog) {
          return { success: false, message: 'Progres tidak ditemukan.' };
        }
        if (prog.status !== 'done') {
          return {
            success: false,
            message: 'Hanya progres di kolom Selesai yang bisa diarsipkan.',
          };
        }

        set((state) => ({
          progresses: state.progresses.map((p) =>
            p.id === id
              ? {
                  ...p,
                  archived: true,
                  archived_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                }
              : p
          ),
        }));
        return { success: true, message: 'Progres berhasil diarsipkan.' };
      },

      restoreProgress: (id) => {
        const prog = get().progresses.find((p) => p.id === id);
        if (!prog) {
          return { success: false, message: 'Progres tidak ditemukan.' };
        }

        set((state) => ({
          progresses: state.progresses.map((p) =>
            p.id === id
              ? {
                  ...p,
                  archived: false,
                  archived_at: null,
                  status: 'done',
                  updated_at: new Date().toISOString(),
                }
              : p
          ),
        }));
        return { success: true, message: 'Progres berhasil dipulihkan.' };
      },

      reorderProgress: (status, orderedIds) => {
        set((state) => {
          const map = new Map(orderedIds.map((id, index) => [id, index]));
          return {
            progresses: state.progresses.map((p) => {
              if (!p.archived && map.has(p.id)) {
                return {
                  ...p,
                  status,
                  position: map.get(p.id)!,
                  updated_at: new Date().toISOString(),
                };
              }
              return p;
            }),
          };
        });
      },

      moveProgress: (sourceStatus, destStatus, sourceIndex, destIndex, cardId) => {
        set((state) => {
          const currentProgresses = [...state.progresses];
          const activeProgresses = currentProgresses.filter((p) => !p.archived);

          // Get items in source column
          const sourceItems = activeProgresses
            .filter((p) => p.status === sourceStatus)
            .sort((a, b) => a.position - b.position);

          if (sourceStatus === destStatus) {
            // Reorder within same column
            const [moved] = sourceItems.splice(sourceIndex, 1);
            sourceItems.splice(destIndex, 0, moved);

            const updatedMap = new Map(sourceItems.map((item, idx) => [item.id, idx]));
            return {
              progresses: currentProgresses.map((p) => {
                if (updatedMap.has(p.id)) {
                  return { ...p, position: updatedMap.get(p.id)! };
                }
                return p;
              }),
            };
          } else {
            // Move across columns
            const destItems = activeProgresses
              .filter((p) => p.status === destStatus)
              .sort((a, b) => a.position - b.position);

            const [moved] = sourceItems.splice(sourceIndex, 1);
            moved.status = destStatus;
            destItems.splice(destIndex, 0, moved);

            const sourceMap = new Map(sourceItems.map((item, idx) => [item.id, idx]));
            const destMap = new Map(destItems.map((item, idx) => [item.id, idx]));

            return {
              progresses: currentProgresses.map((p) => {
                if (p.id === cardId) {
                  return { ...p, status: destStatus, position: destIndex };
                }
                if (sourceMap.has(p.id)) {
                  return { ...p, position: sourceMap.get(p.id)! };
                }
                if (destMap.has(p.id)) {
                  return { ...p, position: destMap.get(p.id)! };
                }
                return p;
              }),
            };
          }
        });
      },

      // --- SUBTASKS ---
      addSubtask: (progress_id, name) => {
        const trimmed = name.trim();
        if (!trimmed) {
          return { success: false, message: 'Nama sub tugas wajib diisi.' };
        }
        if (trimmed.length < 3) {
          return { success: false, message: 'Nama sub tugas minimal 3 karakter.' };
        }
        if (trimmed.length > 150) {
          return { success: false, message: 'Nama sub tugas maksimal 150 karakter.' };
        }

        const subtasksOfProgress = get().subtasks.filter(
          (s) => s.progress_id === progress_id
        );
        const maxPos = subtasksOfProgress.reduce((m, s) => Math.max(m, s.position), -1);

        const newSubtask: Subtask = {
          id: Date.now(),
          progress_id,
          name: trimmed,
          status: 'pending',
          position: maxPos + 1,
          created_at: new Date().toISOString(),
        };

        set((state) => ({ subtasks: [...state.subtasks, newSubtask] }));
        return { success: true, message: 'Sub tugas berhasil ditambahkan.' };
      },

      updateSubtaskStatus: (id, status) => {
        set((state) => ({
          subtasks: state.subtasks.map((s) =>
            s.id === id ? { ...s, status, updated_at: new Date().toISOString() } : s
          ),
        }));
        return { success: true, message: '' };
      },

      deleteSubtask: (id) => {
        set((state) => ({
          subtasks: state.subtasks.filter((s) => s.id !== id),
        }));
        return { success: true, message: 'Sub tugas berhasil dihapus.' };
      },

      reorderSubtasks: (progress_id, status, orderedIds) => {
        set((state) => {
          const map = new Map(orderedIds.map((id, index) => [id, index]));
          return {
            subtasks: state.subtasks.map((s) => {
              if (s.progress_id === progress_id && map.has(s.id)) {
                return {
                  ...s,
                  status,
                  position: map.get(s.id)!,
                  updated_at: new Date().toISOString(),
                };
              }
              return s;
            }),
          };
        });
      },

      // --- BACKUP & RESTORE ---
      exportData: () => {
        const state = get();
        const exportObj = {
          app: 'Project Tracker',
          version: '1.0.0',
          exported_at: new Date().toISOString(),
          groups: state.groups,
          projects: state.projects,
          progresses: state.progresses,
          subtasks: state.subtasks,
        };
        return JSON.stringify(exportObj, null, 2);
      },

      importData: (jsonStr) => {
        try {
          const parsed = JSON.parse(jsonStr);
          if (!Array.isArray(parsed.groups) || !Array.isArray(parsed.projects)) {
            return {
              success: false,
              message: 'Format data tidak valid. Pastikan file JSON dari Project Tracker.',
            };
          }

          set({
            groups: parsed.groups || [],
            projects: parsed.projects || [],
            progresses: parsed.progresses || [],
            subtasks: parsed.subtasks || [],
          });
          return { success: true, message: 'Data berhasil diimpor sepenuhnya!' };
        } catch {
          return { success: false, message: 'Gagal memproses file JSON. Format file rusak.' };
        }
      },

      clearAllData: () => {
        set({
          groups: [],
          projects: [],
          progresses: [],
          subtasks: [],
          filter: { id_group: null, id_project: null },
        });
      },

      loadSampleData: () => {
        const sampleGroup: Group = {
          id: 1,
          name: 'Pekerjaan Utama',
          created_at: new Date().toISOString(),
        };

        const sampleProject1: Project = {
          id: 1,
          group_id: 1,
          name: 'Redesign Landing Page',
          description: 'Pembaruan UI Mobbin-style untuk peluncuran Q4',
          domain: 'landing.example.com',
          directory_path: '/var/www/landing',
          color: '#3B82F6',
          created_at: new Date().toISOString(),
        };

        const sampleProject2: Project = {
          id: 2,
          group_id: 1,
          name: 'Mobile App API',
          description: 'Sinkronisasi endpoint JWT dan rate limiter',
          domain: 'api.example.com',
          directory_path: '/home/dev/api',
          color: '#10B981',
          created_at: new Date().toISOString(),
        };

        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate() + 3).padStart(2, '0');
        const overdueD = String(now.getDate() - 2).padStart(2, '0');

        const sampleProgresses: Progress[] = [
          {
            id: 101,
            project_id: 1,
            name: 'Audit Konten & Asset Vektor',
            description: 'Kumpulkan semua SVG dan copywriting baru.',
            notes: 'Catatan tim: pastikan logo ukuran 512px transparan.',
            deadline: `${y}-${m}-${d}`,
            priority: 'medium',
            status: 'pending',
            position: 0,
            archived: false,
            archived_at: null,
            created_at: new Date().toISOString(),
          },
          {
            id: 102,
            project_id: 1,
            name: 'Slicing Komponen Hero & Pricing',
            description: 'Gunakan Tailwind CSS & Inter font.',
            notes: '',
            deadline: `${y}-${m}-${d}`,
            priority: 'high',
            status: 'wip',
            position: 0,
            archived: false,
            archived_at: null,
            created_at: new Date().toISOString(),
          },
          {
            id: 103,
            project_id: 2,
            name: 'Setup Rate Limiter Redis',
            description: 'Batas 100 request/menit per IP.',
            notes: '',
            deadline: `${y}-${m}-${overdueD}`,
            priority: 'high',
            status: 'pending',
            position: 1,
            archived: false,
            archived_at: null,
            created_at: new Date().toISOString(),
          },
          {
            id: 104,
            project_id: 2,
            name: 'Dokumentasi Postman & OpenAPI',
            description: 'Export koleksi postman v2.1',
            notes: 'Sudah di-share ke tim mobile.',
            deadline: `${y}-${m}-${d}`,
            priority: 'low',
            status: 'done',
            position: 0,
            archived: false,
            archived_at: null,
            created_at: new Date().toISOString(),
          },
        ];

        const sampleSubtasks: Subtask[] = [
          {
            id: 201,
            progress_id: 102,
            name: 'Header & Navbar responsive',
            status: 'done',
            position: 0,
            created_at: new Date().toISOString(),
          },
          {
            id: 202,
            progress_id: 102,
            name: 'Tabel Pricing Toggle Bulanan/Tahunan',
            status: 'wip',
            position: 1,
            created_at: new Date().toISOString(),
          },
          {
            id: 203,
            progress_id: 102,
            name: 'CTA Footer & Newsletter Form',
            status: 'pending',
            position: 2,
            created_at: new Date().toISOString(),
          },
        ];

        set({
          groups: [sampleGroup],
          projects: [sampleProject1, sampleProject2],
          progresses: sampleProgresses,
          subtasks: sampleSubtasks,
        });
      },
    }),
    {
      name: 'project-tracker-storage-v1',
    }
  )
);

// Selector for filtered board cards
export function useBoardCards() {
  const { progresses, projects, groups, subtasks, filter } = useTrackerStore();

  const activeProgresses = progresses.filter((p) => !p.archived);

  // Apply filters
  const filtered = activeProgresses.filter((prog) => {
    const proj = projects.find((p) => p.id === prog.project_id);
    if (!proj) return false;

    if (filter.id_project && prog.project_id !== filter.id_project) {
      return false;
    }
    if (filter.id_group && proj.group_id !== filter.id_group) {
      return false;
    }
    return true;
  });

  const cards: CardItem[] = filtered.map((prog) => {
    const proj = projects.find((p) => p.id === prog.project_id);
    const grp = groups.find((g) => g.id === proj?.group_id);
    const subs = subtasks.filter((s) => s.progress_id === prog.id);

    return {
      ...prog,
      project_name: proj ? proj.name : 'Unknown',
      project_color: proj ? proj.color : '#3B82F6',
      group_name: grp ? grp.name : 'Unknown',
      subtask_total: subs.length,
      subtask_done: subs.filter((s) => s.status === 'done').length,
      is_overdue: isOverdue(prog.deadline, prog.status),
    };
  });

  return {
    pending: cards.filter((c) => c.status === 'pending').sort((a, b) => a.position - b.position),
    wip: cards.filter((c) => c.status === 'wip').sort((a, b) => a.position - b.position),
    done: cards.filter((c) => c.status === 'done').sort((a, b) => a.position - b.position),
  };
}
