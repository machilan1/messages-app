import { Injectable, computed, inject } from '@angular/core';
import {
  ComponentStore,
  OnStateInit,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { RoomEntity } from '../models/room.entity';
import { RoomService } from '../service/room.service';
import {
  catchError,
  concatMap,
  exhaustMap,
  finalize,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from '../service/message.service';
import { MessageStore } from './message.store';
import { Paginate, PaginationMeta } from '../models/paginate.interface';
import { NotificationService } from '../service/notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarInvitationComponent } from '../../ui/snackbar-template/snackbar-invite.component';

interface ChatState {
  loading: boolean;
  paginationMeta?: PaginationMeta;
  rooms: RoomEntity[];
  viewingRoom?: RoomEntity;
  paginateIndex: number;
}

const initialState: ChatState = {
  loading: true,
  rooms: [],
  paginateIndex: 1,
};

@Injectable()
export class RoomStore
  extends ComponentStore<ChatState>
  implements OnStateInit
{
  #router = inject(Router);
  #roomService = inject(RoomService);
  #notificationService = inject(NotificationService);
  #messageStore = inject(MessageStore);
  #snackbar = inject(MatSnackBar);

  readonly rooms = this.selectSignal((state) => state.rooms);
  readonly loading = this.selectSignal((state) => state.loading);
  readonly paginationMeta = this.selectSignal((state) => state.paginationMeta);
  readonly viewingRoom = this.selectSignal((state) => state.viewingRoom);
  readonly viewingRoom$ = this.select((state) => state);
  readonly fullyLoaded = computed(() => {
    return (
      this.paginationMeta()?.currentPage === this.paginationMeta()?.totalPages
    );
  });

  constructor() {
    super(initialState);
  }

  readonly setLoadingState = this.updater((state, loading: boolean) => ({
    ...state,
    loading,
  }));

  readonly selectRoom = this.effect<number>((roomId) =>
    roomId.pipe(
      tap(() => this.#messageStore.reset()),
      tap(() => this.setLoadingState(true)),
      tap((id) => this.#roomService.selectRoom(id)),
      catchError((error) => {
        console.log(error);
        return error;
      })
    )
  );

  readonly leaveRoom = this.effect<number>(($roomId) =>
    $roomId.pipe(
      tap((id) => {
        const room = this.get().rooms.find((room) => (room.id = id));
        this.patchState({
          rooms: this.get().rooms.filter((room) => room.id !== id),
        });
        this.#router.navigate(['/chat']);
        this.#snackbar.open(`You have leaved ${room?.name}`, 'ok');
      }),

      catchError((error) => {
        console.log(error);
        return of('');
      })
    )
  );

  readonly listenToLeaveRoom = this.effect(($) =>
    $.pipe(
      concatMap(() =>
        this.#roomService.listenLeaveRoom().pipe(
          tapResponse(
            (res) => {
              console.log(123);
            },
            (error) => {
              console.log(error);
            }
          )
        )
      )
    )
  );

  readonly listenSelectedRoom = this.effect(($) =>
    $.pipe(
      switchMap(() =>
        this.#roomService.receiveSelectedRoom().pipe(
          tapResponse(
            (room) => {
              this.patchState({ viewingRoom: room });
              this.#messageStore.pushMessage(room.messages ?? []);
              this.setLoadingState(false);
            },
            (error) => {
              this.setLoadingState(false);
              console.log(error);
            }
          )
        )
      )
    )
  );

  readonly listenToUserRooms = this.effect(($) =>
    $.pipe(
      switchMap(() =>
        this.#roomService.receiveUserRooms().pipe(
          tapResponse(
            (roomsWithMeta) => {
              this.patchState({ rooms: [...roomsWithMeta.items] });
              this.patchState({ paginateIndex: this.get().paginateIndex + 1 });
            },
            (error) => {
              console.log(error);
            },
            () => {
              this.setLoadingState(false);
            }
          )
        )
      )
    )
  );

  readonly paginateRoom = this.effect(($) =>
    $.pipe(
      tap(() => this.#roomService.requestNextPage(this.get().paginateIndex)),
      catchError((error) => {
        console.log(error);
        return of();
      })
    )
  );

  readonly listenPaginateRoom = this.effect(($) =>
    $.pipe(
      concatMap(() =>
        this.#roomService.receivePaginateRoom().pipe(
          tapResponse(
            (data) => {
              if (this.fullyLoaded()) {
                this.setLoadingState(false);
                return of([]);
              }
              this.patchState({ paginationMeta: data.meta });
              this.patchState({
                rooms: [...this.get().rooms, ...data.items],
              });
              this.setLoadingState(false);
              return of([]);
            },
            (error) => {
              console.log(error);
            }
          )
        )
      )
    )
  );

  readonly listenNewRoom = this.effect(($) =>
    $.pipe(
      concatMap(() =>
        this.#roomService.receiveNewRoom().pipe(
          tapResponse(
            (room) => {
              this.patchState({ rooms: [room, ...this.get().rooms] });
            },
            (error) => {
              console.log(error);
            }
          )
        )
      )
    )
  );

  readonly listenToInvitationNotification = this.effect(($) =>
    $.pipe(
      concatMap(() =>
        this.#notificationService.listenToInvitationNotification().pipe(
          tapResponse(
            (room) => {
              this.#snackbar.openFromComponent(SnackbarInvitationComponent, {
                data: room,
              });
            },
            (error) => {
              console.log(error);
            }
          )
        )
      )
    )
  );

  ngrxOnStateInit() {
    if (!localStorage.getItem('access_token')) {
      this.#router.navigate(['auth']);
      return;
    }
    this.listenToUserRooms();
    this.listenNewRoom();
    this.listenSelectedRoom();
    this.listenPaginateRoom();
    this.listenToInvitationNotification();
    this.listenToLeaveRoom();
  }
}
