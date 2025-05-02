import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../Task';
import { TaskItemComponent } from "../task-item/task-item.component";
import { AddTaskComponent } from "../add-task/add-task.component";
import { TaskService } from '../../services/task.service';
import { FormsModule } from '@angular/forms';
import { CompletedTasksComponent } from '../completed-tasks/completed-tasks.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, TaskItemComponent, AddTaskComponent, FormsModule, CompletedTasksComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit{
  tasks: Task[] = [];
  completedTasks: Task[] = [];
  sortBy: string = 'dateAdded';

  // Toast state
  showToast = false;
  deletedTask: Task | null = null;
  toastTimeout: any;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    const savedSort = localStorage.getItem('sortBy');
    if (savedSort) {
      this.sortBy = savedSort;
    }
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks.filter(t => !t.completed);
      this.completedTasks = tasks.filter(t => t.completed);
      this.sortTasks(); // Apply sorting after loading tasks
    });
  }

  deleteTask(task: Task) {
    // Remove from UI immediately
    this.tasks = this.tasks.filter((t) => t.id !== task.id);
    this.completedTasks = this.completedTasks.filter((t) => t.id !== task.id);

    // Show toast and store task for undo
    this.deletedTask = task;
    this.showToast = true;

    // Actually delete from DB after 5 seconds if not undone
    this.toastTimeout = setTimeout(() => {
      if (this.deletedTask) {
        this.taskService.deleteTask(this.deletedTask).subscribe();
        this.deletedTask = null;
        this.showToast = false;
      }
    }, 5000);
  }

  undoDelete() {
    if (this.deletedTask) {
      // Add back to correct list
      if (this.deletedTask.completed) {
        this.completedTasks.push(this.deletedTask);
      } else {
        this.tasks.push(this.deletedTask);
      }
      this.deletedTask = null;
      this.showToast = false;
      clearTimeout(this.toastTimeout);
    }
  }

  toggleReminder(task: Task) {
    task.reminder = !task.reminder;
    this.taskService.updateTaskReminder(task).subscribe();
  }

  addTask(task: Task) {
    this.taskService.addTask(task).subscribe((task) => this.tasks.push(task));
  }

  updateTask(updatedTask: Task) {
    this.taskService.updateTask(updatedTask).subscribe((task) => {
      this.tasks = this.tasks.map((t) => (t.id == task.id ? task : t)); 
    });
  }

  onToggleCompleted(task: Task) {
    const newCompleted = !task.completed;
    this.taskService.updateTask({ ...task, completed: newCompleted }).subscribe((updatedTask) => {
      // Update the local property immediately
      task.completed = newCompleted;
      if (updatedTask.completed) {
        this.tasks = this.tasks.filter(t => t.id !== updatedTask.id);
        this.completedTasks.push(updatedTask);
      } else {
        this.completedTasks = this.completedTasks.filter(t => t.id !== updatedTask.id);
        this.tasks.push(updatedTask);
      }
    });
  }

  onUndoCompleted(task: Task) {
    task.completed = false;
    this.taskService.updateTask(task).subscribe(() => {
      this.completedTasks = this.completedTasks.filter(t => t.id !== task.id);
      this.tasks.push(task);
    });
  }

  sortTasks() {
    localStorage.setItem('sortBy', this.sortBy); // Save choice
    if (this.sortBy === 'dateAdded') {
      this.tasks.sort((a, b) => (a.dateAdded || '').localeCompare(b.dateAdded || ''));
    } else if (this.sortBy === 'dueDate') {
      this.tasks.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
    } else if (this.sortBy === 'priority') {
      this.tasks.sort((a, b) => (a.priority || 3) - (b.priority || 3));
    }
  }
}
