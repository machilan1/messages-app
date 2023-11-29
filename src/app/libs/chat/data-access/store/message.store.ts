import { Injectable, inject } from '@angular/core';
import {
  ComponentStore,
  OnStateInit,
  tapResponse,
} from '@ngrx/component-store';
import { MessageEntity } from '../models/message.entity';
import { concatMap, switchMap, tap } from 'rxjs';
import { MessageService } from '../service/message.service';
import { SendMessageDto } from '../models/add-message.dto';

interface MessageState {
  loading: boolean;
  outSentPending: boolean;
  messages: MessageEntity[] | [];
  onTop?: boolean;
}

const initialState: MessageState = {
  messages: [],
  loading: false,
  outSentPending: false,
};

@Injectable({ providedIn: 'root' })
export class MessageStore extends ComponentStore<MessageState> {
  #messageService = inject(MessageService);

  readonly messages = this.selectSignal((state) => state.messages);

  readonly isOnTop = this.selectSignal((state) => state.onTop);

  constructor() {
    super(initialState);
  }

  readonly pushMessage = this.updater((state, value: MessageEntity[]) => ({
    ...state,
    messages: [...this.get().messages, ...value],
  }));

  readonly setOnTop = this.updater((state, value: boolean) => ({
    ...state,
    onTop: value,
  }));

  // todo add pagination to messages

  readonly sendMessage = this.effect<SendMessageDto>((sendMessageDto$) =>
    sendMessageDto$.pipe(
      tap(() => this.patchState({ outSentPending: true })),
      tap((payload) => this.#messageService.sendMessage(payload))
    )
  );

  readonly listenToNewMessage = this.effect(($) =>
    $.pipe(
      concatMap(() =>
        this.#messageService.listenNewMessage().pipe(
          tapResponse(
            (message) => {
              this.patchState({
                messages: [...this.get().messages, message],
                loading: false,
              });
            },
            (error) => {
              this.patchState({ loading: false });
              console.log(error);
            }
          )
        )
      )
    )
  );

  readonly listenToInitialMessages = this.effect(($) =>
    $.pipe(
      switchMap(() =>
        this.#messageService.listenInitialMessage().pipe(
          tapResponse(
            (paginate) => {
              this.patchState({
                messages: [...this.get().messages, ...paginate.items],
                loading: false,
              });
            },
            (error) => {
              this.patchState({ loading: false });
              console.log(error);
            }
          )
        )
      )
    )
  );

  reset() {
    this.patchState(initialState);
  }
}
