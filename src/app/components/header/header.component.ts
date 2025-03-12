import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { TasksComponent } from '../tasks/tasks.component';
import { TaskItemComponent } from "../task-item/task-item.component";
import { CommonModule } from '@angular/common';
import { UiService } from '../../services/ui.service';
import { Subscription } from 'rxjs';
import { AddTaskComponent } from '../add-task/add-task.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonComponent, CommonModule, TasksComponent, TaskItemComponent, AddTaskComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  title: string = 'Task Tracker';
  showAddTask: boolean = false;
  subscription: Subscription;

  constructor(private uiService: UiService) {
    this.subscription = this.uiService
      .onToggle()
      .subscribe((value) => (this.showAddTask = value));
  }

  ngOnInit(): void {}
  
   ngOnDestroy() {
     // Unsubscribe to ensure no memory leaks
     this.subscription.unsubscribe();
   }

  toggleAddTask() {
    this.uiService.toggleAddTask();
  }

}
