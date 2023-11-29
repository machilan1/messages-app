import { MessageEntity } from './message.entity';
import { RoomEntity } from './room.entity';

export class UserEntity {
  id!: number;
  username!: string;
  email!: string;
  messages?: MessageEntity[];
  rooms?: RoomEntity[];
}
