import { UserEntity } from './user.entity';

export class CreateRoomDto {
  name!: string;

  description!: string;

  userIds!: number[];

  users?: UserEntity[];
}
