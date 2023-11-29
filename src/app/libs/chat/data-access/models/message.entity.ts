import { MESSAGE_TYPE } from '../../util/chat.constant';
import { RoomEntity } from './room.entity';
import { UserEntity } from './user.entity';

export class MessageEntity {
  id!: number;
  text!: string;
  createdAt!: Date;
  type?: MESSAGE_TYPE;
  author?: UserEntity;
  room?: RoomEntity;
}
