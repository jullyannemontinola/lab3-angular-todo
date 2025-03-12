import { Component, Input, Output, EventEmitter, SimpleChanges} from '@angular/core';
import { Task } from '../../Task';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [CommonModule, FormsModule, ],
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent {
  @Input() task!: Task;
  @Output() onSaveEdit: EventEmitter<Task> = new EventEmitter();
  @Output() onCancelEdit: EventEmitter<void> = new EventEmitter();

  editedTask!: Task;

  constructor() {
    this.editedTask = { ...this.task }; // Copy the task to avoid direct mutation
  }

  ngOnChanges(): void {
    if (this.task) {
      this.editedTask = { ...this.task }; // Ensure copy is updated
    }
  }
  

  saveChanges() {
    console.log('Saving changes:', this.editedTask);
    this.onSaveEdit.emit(this.editedTask);
  }
  

  cancelChanges() {
    this.onCancelEdit.emit();
  }
}
