import { inject, Injectable } from '@angular/core';
import { CustomSocket } from '../sockets/custom-socket';
import { RoomEntity } from '../models/room.entity';
import { UserEntity } from '../models/user.entity';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  #socket = inject(CustomSocket);

  /** Returns an observable that emits value when an invitation is received.
   *
   * @returns
   */
  listenToInvitationNotification() {
    return this.#socket.fromEvent<{ user: UserEntity; room: RoomEntity }>(
      'receiveInvitationNotification'
    );
  }
}
