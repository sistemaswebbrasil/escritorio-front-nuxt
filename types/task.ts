export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'PENDING' | 'TODO' | 'IN_PROGRESS' | 'BACKLOG';
  createdAt: string;
  updatedAt: string;
}
