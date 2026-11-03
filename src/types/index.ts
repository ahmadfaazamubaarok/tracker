export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'wip' | 'done';

export interface Group {
  id: number;
  name: string;
  created_at: string;
  updated_at?: string | null;
}

export interface Project {
  id: number;
  group_id: number;
  name: string;
  description?: string | null;
  domain: string;
  directory_path: string;
  color: string;
  created_at: string;
  updated_at?: string | null;
}

export interface Progress {
  id: number;
  project_id: number;
  name: string;
  description?: string | null;
  notes?: string | null;
  deadline: string; // YYYY-MM-DD
  priority: Priority;
  status: Status;
  position: number;
  archived: boolean;
  archived_at?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface Subtask {
  id: number;
  progress_id: number;
  name: string;
  status: Status;
  position: number;
  created_at: string;
  updated_at?: string | null;
}

export interface BoardFilter {
  id_group: number | null;
  id_project: number | null;
}

export type ViewTab = 'board' | 'group' | 'project' | 'archive';

export interface CardItem extends Progress {
  project_name: string;
  project_color: string;
  group_name: string;
  subtask_total: number;
  subtask_done: number;
  is_overdue: boolean;
}
