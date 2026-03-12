export interface Task {
  id: string;
  title: string;
  description?: string;
}

export type ContainerId = 'inbox' | 'sorted';
