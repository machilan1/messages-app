import { Injectable, inject } from '@angular/core';
import { CustomSocket } from '../sockets/custom-socket';
import { MessageEntity } from '../models/message.entity';
import { SendMessageDto } from '../models/add-message.dto';
import { Paginate } from '../models/paginate.interface';
import { SendSystemMessageDto } from '../models/send-system-message.dto';
import { UserEntity } from '../models/user.entity';
import { RoomEntity } from '../models/room.entity';

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

  sendSystemMessage(sendSystemMessageDto: SendSystemMessageDto) {
    try {
      const { text, authorId, roomId, type } = sendSystemMessageDto;
      if (!text || authorId < 0 || roomId < 0) {
        throw 'Payload invalid';
      }
      if (type !== 'system') {
        throw 'Payload invalid';
      }
    } catch (error) {
      throw error;
    }

    this.#socket.emit('sendSystemMessage', sendSystemMessageDto);
  }

  listenInitialMessage() {
    return this.#socket.fromEvent<Paginate<MessageEntity>>(
      'receiveInitialMessages'
    );
  }

  listenNewMessage() {
    return this.#socket.fromEvent<MessageEntity>('receiveNewMessage');
  }

  listenSystemMessage() {
    return this.#socket.fromEvent<MessageEntity>('receiveSystemMessage');
  }
}
