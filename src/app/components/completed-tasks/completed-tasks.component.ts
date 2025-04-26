import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../Task';

@Component({
  selector: 'app-completed-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './completed-tasks.component.html',
  styleUrl: './completed-tasks.component.css'
})
export class CompletedTasksComponent {
  @Input() completedTasks: Task[] = [];
  @Output() undoCompleted: EventEmitter<Task> = new EventEmitter();

  onUndo(task: Task) {
    this.undoCompleted.emit(task);
  }
}
