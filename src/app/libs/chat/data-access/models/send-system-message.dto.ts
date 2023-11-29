import { MESSAGE_TYPE } from '../../util/chat.constant';
import { SendMessageDto } from './add-message.dto';

export class SendSystemMessageDto extends SendMessageDto {
  type!: MESSAGE_TYPE;
}
