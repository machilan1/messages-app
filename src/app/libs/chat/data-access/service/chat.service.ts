import { Injectable, inject } from '@angular/core';
import { CustomSocket } from '../sockets/custom-socket';

@Injectable()
export class ChatService {
  #socket = inject(CustomSocket);

  getNotification() {
    return this.#socket.fromEvent('broadcast');
  }
}
