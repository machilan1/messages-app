import { Injectable, inject } from '@angular/core';
import { CustomSocket } from '../sockets/custom-socket';
import { MessageEntity } from '../models/message.entity';
import { SendMessageDto } from '../models/add-message.dto';
import { Paginate } from '../models/paginate.interface';

@Injectable({ providedIn: 'root' })
export class MessageService {
  #socket = inject(CustomSocket);

  askManyByRoomId(roomId: number) {
    this.#socket.emit('loadInitialMessageInRoom', roomId);
  }

  sendMessage(sendMessageDto: SendMessageDto) {
    try {
      const { text, authorId, roomId } = sendMessageDto;
      if (!text || authorId < 0 || roomId < 0) {
        throw 'Payload invalid';
      }
    } catch (error) {
      throw error;
    }
    this.#socket.emit('sendMessage', sendMessageDto);
  }

  listenInitialMessage() {
    return this.#socket.fromEvent<Paginate<MessageEntity>>(
      'receiveInitialMessages'
    );
  }

  listenNewMessage() {
    return this.#socket.fromEvent<MessageEntity>('receiveNewMessage');
  }
}
