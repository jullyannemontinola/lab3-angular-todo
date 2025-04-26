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

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks.filter(t => !t.completed);
      this.completedTasks = tasks.filter(t => t.completed);
    });
  }

  deleteTask(task: Task) {
    this.taskService
      .deleteTask(task)
      .subscribe(
        () => (this.tasks = this.tasks.filter((t) => t.id !== task.id))
      );
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
}
