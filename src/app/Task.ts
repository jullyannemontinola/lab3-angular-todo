export interface Task {
  id?: number;
  text: string;
  description: string;
  reminder: boolean;
  completed?: boolean;
  dueDate?: string; // Format: 'YYYY-MM-DD'
  dueTime?: string; // Format: 'HH:mm'
  dateAdded?: string; // ISO string or 'YYYY-MM-DD'
  priority?: number; // 1 (High), 2 (Medium), 3 (Low)
}