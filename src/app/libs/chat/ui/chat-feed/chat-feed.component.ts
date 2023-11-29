import {
  Component,
  ChangeDetectionStrategy,
  Input,
  inject,
  AfterViewInit,
  OnInit,
  ViewChild,
  ElementRef,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { RoomStore } from '../../data-access/store/room.store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MessageStore } from '../../data-access/store/message.store';
import { RoomHeadComponent } from '../room-header/room-header.component';
import { MessageListComponent } from '../message-list/message-list.component';
import { debounceTime, filter, fromEvent, map, tap } from 'rxjs';
import { AUTO_SCROLL_DOWN_TRIGGER_HEIGHT } from '../../util/chat.constant';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    RoomHeadComponent,
    MessageListComponent,
  ],
  template: `
    <div class="grid grid-rows-[4rem_1fr_4rem] h-full max-h-screen">
      <app-room-header
        [menu]="true"
        [title]="roomWithMessage()?.name ?? ''"
        [description]="roomWithMessage()?.description ?? ''"
        [roomId]="+roomId"
      ></app-room-header>
      <div class="overflow-auto" #list>
        <app-message-list
          (messageInit)="messageInit($event)"
          [isOnTop]="isOnTop()"
          [messages]="messages()"
        ></app-message-list>
      </div>
      <form
        [formGroup]="form"
        class="flex items-center bg-gray-300 "
        (submit)="submit()"
      >
        <button mat-icon-button class="mx-4">
          <mat-icon> send</mat-icon>
        </button>

        <input
          [disabled]="!roomId"
          class="h-10 rounded-full pl-4 w-full  mr-4 focus:outline-[#bbbbbb] focus:outline-offset-2"
          formControlName="textInput"
          type="text"
          matInput
          placeholder="Message"
        />
      </form>
    </div>
  `,
  styles: [
    `
      mat-form-field-invalid.ng-touched {
        outline: none;
        border: none;
      }
    `,
  ],
})
export class ChatFeedComponent implements AfterViewInit {
  #destroyRef = inject(DestroyRef);
  #roomStore = inject(RoomStore);
  #messageStore = inject(MessageStore);
  #fb = inject(NonNullableFormBuilder);
  #router = inject(Router);

  #inTriggerArea = true;
  #roomId!: string;

  @Input() set roomId(value: string) {
    this.#roomStore.selectRoom(parseInt(value));
    this.#roomId = value;
  }

  @ViewChild('ele') ele!: MessageListComponent;

  @ViewChild('list') list!: ElementRef<HTMLDivElement>;

  get roomId() {
    return this.#roomId;
  }

  messages = this.#messageStore.messages;
  roomWithMessage = this.#roomStore.viewingRoom;
  isOnTop = this.#messageStore.isOnTop;

  form = this.#fb.group({
    textInput: ['', [Validators.required]],
  });

  constructor() {
    this.#router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        tap(() => (this.#inTriggerArea = true)),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    fromEvent(this.list.nativeElement, 'scroll')
      .pipe(
        debounceTime(20),
        map((event) => event.target as HTMLDivElement),
        tap((element) => {
          this.#inTriggerArea =
            element.scrollHeight - element.scrollTop - element.clientHeight <
            AUTO_SCROLL_DOWN_TRIGGER_HEIGHT;
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }
  submit() {
    if (this.form.invalid) {
      return;
    }

    const payload = {
      text: this.form.getRawValue().textInput,
      authorId: parseInt(localStorage.getItem('user_id')!),
      roomId: parseInt(this.roomId),
    };

    this.#messageStore.sendMessage(payload);
    this.form.reset();
  }

  messageInit(event: any) {
    if (this.#inTriggerArea) {
      this.list.nativeElement.scrollTop = this.list.nativeElement.scrollHeight;
    }
    return;
  }
}
