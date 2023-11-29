import { Pipe, PipeTransform, inject } from '@angular/core';
import { AuthStore } from 'src/app/libs/auth/data-access/store/auth.store';
import { MessageEntity } from 'src/app/libs/chat/data-access/models/message.entity';

@Pipe({
  name: 'isOwner',
  standalone: true,
})
export class IsOwnerPipe implements PipeTransform {
  #authStore = inject(AuthStore);

  transform(value: MessageEntity, ...args: any[]) {
    return +localStorage.getItem('user_id')! === value.author?.id;
  }
}
