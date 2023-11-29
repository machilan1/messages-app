import { MessageEntity } from './message.entity';
import { UserEntity } from './user.entity';

export class RoomEntity {
  id!: number;
  name!: string;
  description!: string;
  createdAt?: Date;
  updatedAt?: Date;
  messages?: MessageEntity[];
  users?: UserEntity[];
}
