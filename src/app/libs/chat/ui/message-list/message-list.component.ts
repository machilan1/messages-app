import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { MessageLineComponent } from '../message-line/message-line.component';
import { MessageEntity } from '../../data-access/models/message.entity';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-message-list',
  imports: [MessageLineComponent, MatIconModule, MatButtonModule, CommonModule],
  template: `
    <div #container class="h-full pt-2 ">
      <!-- Todo paginator trigger-->

      <!-- <div class=" text-center flex justify-center ">
        <button
          mat-icon-button
          aria-label="Example icon button with a vertical three dot icon"
        >
          <mat-icon>keyboard_arrow_up</mat-icon>
        </button>
      </div> -->
      <div class="px-2 pb-4">
        @for (message of messages; track message.id) {
        <app-message-line
          (initRender)="initRender($event)"
          [message]="message"
        ></app-message-line>
        }
      </div>
    </div>
  `,
})
export class MessageListComponent {
  #messages: MessageEntity[] = [];
  @Input({ required: true }) isOnTop!: boolean | undefined;
  @Input({ required: true }) set messages(value: MessageEntity[]) {
    this.#messages = value;
  }
  @Output() messageInit = new EventEmitter();
  get messages() {
    return this.#messages;
  }

  initRender(event: any) {
    this.messageInit.emit(event);
  }
  constructor() {}
}
