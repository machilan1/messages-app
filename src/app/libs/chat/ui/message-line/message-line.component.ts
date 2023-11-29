import {
  Component,
  ChangeDetectionStrategy,
  Output,
  Input,
  EventEmitter,
  afterNextRender,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageEntity } from '../../data-access/models/message.entity';
import { CommonModule, DatePipe } from '@angular/common';
import { IsOwnerPipe } from 'src/app/libs/shared/util/pipes/is-owner.pipe';

@Component({
  selector: `app-message-line`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, DatePipe, IsOwnerPipe, CommonModule],
  template: `
    <div
      *ngIf="!(message | isOwner); else own"
      class="grid grid-cols-[2.5rem_1fr] gap-x-2 py-1"
    >
      <div
        class="h-10 aspect-square bg-slate-200 inline-block rounded-full"
      ></div>
      <div class="max-w-[50%]">
        <div class="text-sm">{{ message.author?.username }} :</div>
        <div class="rounded-3xl w-fit px-2  border-2 border-black/40">
          <div>{{ message.text }}</div>
        </div>
        <div>
          <small>
            {{ message.createdAt | date : 'MM/dd hh:mm' }}
          </small>
        </div>
      </div>
    </div>

    <ng-template #own>
      <div class="w-full flex justify-end">
        <div class="w-fit max-w-[50%] inline-flex justify-end">
          <div
            class="w-fit  border-2 border-gray-800 text-gray-100 bg-[#3f51b5] rounded-2xl px-2 "
          >
            {{ message.text }}
          </div>
        </div>
      </div>
      <small class=" block text-right">
        {{ message.createdAt | date : 'MM/dd hh:mm' }}
      </small>
    </ng-template>
  `,
})
export class MessageLineComponent {
  @Input() message!: MessageEntity;
  @Output() initRender = new EventEmitter();
  constructor() {
    afterNextRender(() => {
      this.initRender.emit(this.message.id);
    });
  }
}
