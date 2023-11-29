import { Injectable, inject } from '@angular/core';
import {
  ComponentStore,
  OnStateInit,
  tapResponse,
} from '@ngrx/component-store';
import { UserEntity } from '../models/user.entity';
import { UserService } from '../service/user.service';
import { catchError, of, switchMap, tap } from 'rxjs';
import { CreateRoomDto } from '../models/create-room.dto';
import { RoomService } from '../service/room.service';
import { Router } from '@angular/router';

interface CreateRoomState {
  loading: boolean;
}

const initialState: CreateRoomState = {
  loading: false,
};
@Injectable()
export class CreateRoomStore
  extends ComponentStore<CreateRoomState>
  implements OnStateInit
{
  #roomService = inject(RoomService);
  #router = inject(Router);

  constructor() {
    super(initialState);
  }

  readonly submit = this.effect<CreateRoomDto>((createRoomDto$) =>
    createRoomDto$.pipe(
      tap(() => this.patchState({ loading: true })),
      tap((createRoomDto) => this.#roomService.createNewRoom(createRoomDto)),
      catchError((error) => {
        console.log(error);
        this.patchState({ loading: false });
        return of();
      })
    )
  );

  private readonly listenNewRoom = this.effect(($) =>
    $.pipe(
      switchMap(() =>
        this.#roomService.receiveNewRoom().pipe(
          tapResponse(
            async (room) => {
              this.patchState({ loading: false });
              await this.#router.navigate(['/chat/' + room.id]);
            },
            (error) => {
              console.log(error);
              this.patchState({ loading: false });
            }
          )
        )
      )
    )
  );

  ngrxOnStateInit() {
    this.listenNewRoom();
  }
}
