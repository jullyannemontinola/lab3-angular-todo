import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UiService } from '../../services/ui.service';
import { Subscription } from 'rxjs';
import { Task } from '../../Task';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  standalone: true,
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
  imports: [CommonModule, FormsModule], 
})
export class AddTaskComponent implements OnInit {
  @Output() onAddTask: EventEmitter<Task> = new EventEmitter();
  text: string = '';
  description: string = '';
  reminder: boolean = false;
  dueDate: string = '';
  dueTime: string = '';
  priority: number = 2; // Default to Medium
  showAddTask: boolean = false;
  subscription: Subscription;

  constructor(private uiService: UiService) {
    this.subscription = this.uiService
      .onToggle()
      .subscribe((value) => (this.showAddTask = value));
  }

  ngOnInit(): void {}
  
   ngOnDestroy() {
        this.subscription.unsubscribe();
    }

  onSubmit() {
    if (!this.text) {
      alert('Please add a task!');
      return;
    }

    const newTask: Task = {
      text: this.text,
      description: this.description,
      reminder: this.reminder,
      dueDate: this.dueDate,
      dueTime: this.dueTime,
      dateAdded: new Date().toISOString().slice(0, 10), // 'YYYY-MM-DD'
      priority: this.priority,
    };

    this.onAddTask.emit(newTask);

    this.text = '';
    this.description = '';
    this.reminder = false;
    this.dueDate = '';
    this.dueTime = '';
  }
}