import { MESSAGE_TYPE } from '../../util/chat.constant';

export class SendMessageDto {
  text!: string;
  authorId!: number;
  roomId!: number;
}
