import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../Task';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditTaskComponent } from '../edit-task/edit-task.component';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule, EditTaskComponent],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent implements OnInit {
  @Input() task!: Task; 
  @Output() onDeleteTask: EventEmitter<Task> = new EventEmitter();
  @Output() onToggleReminder: EventEmitter<Task> = new EventEmitter();
  @Output() onUpdateTask: EventEmitter<Task> = new EventEmitter();
  @Output() onToggleCompleted: EventEmitter<Task> = new EventEmitter();

  faTimes = faTimes;
  faEdit = faEdit;
  isEditing: boolean = false;
  completed: boolean = false; // Add this line

  constructor() {}

  ngOnInit(): void {}

  onDelete(task: Task) {
    const confirmDelete = confirm(`Are you sure you want to delete "${task.text}"?`);
    if (confirmDelete) {
      this.onDeleteTask.emit(task);
    }
  }

  onToggle(task: Task) {
    this.onToggleReminder.emit(task);
  }

  editTask() {
    this.isEditing = true;
  }

  updateTask(updatedTask: Task) {
    console.log('Updated Task:', updatedTask);
    this.task = updatedTask;
    this.onUpdateTask.emit(updatedTask);
    this.isEditing = false;
  }
  
  cancelEdit() {
    this.isEditing = false;
  }

  toggleCompleted() {
    this.onToggleCompleted.emit({ ...this.task, completed: this.completed });
  }
}
