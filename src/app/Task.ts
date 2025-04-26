export interface Task {
  id?: number;
  text: string;
  description: string;
  reminder: boolean;
  completed?: boolean;
  dueDate?: string; // Format: 'YYYY-MM-DD'
  dueTime?: string; // Format: 'HH:mm'
}