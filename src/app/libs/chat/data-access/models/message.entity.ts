import { RoomEntity } from './room.entity';
import { UserEntity } from './user.entity';

export class MessageEntity {
  id!: number;
  text!: string;
  createdAt!: Date;
  author?: UserEntity;
  room?: RoomEntity;
}
