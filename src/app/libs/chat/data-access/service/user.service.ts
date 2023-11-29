import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_LINK } from 'src/app/libs/shared/util/constants/global.constant';
import { UserEntity } from '../models/user.entity';

@Injectable()
export class UserService {
  #http = inject(HttpClient);

  findManyWithSubtext(substring: string) {
    return this.#http.get<UserEntity[]>(API_LINK + '/user', {
      params: { substring: `${substring}` },
    });
  }
}
