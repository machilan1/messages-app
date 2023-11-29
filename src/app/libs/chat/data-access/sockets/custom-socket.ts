import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import {
  API_SOCKET_LINK,
  APP_LINK,
} from 'src/app/libs/shared/util/constants/global.constant';

const config: SocketIoConfig = {
  url: API_SOCKET_LINK,
  options: {
    extraHeaders: {
      Authorization: localStorage.getItem('access_token') ?? '',
    },
  },
};

@Injectable({ providedIn: 'root' })
export class CustomSocket extends Socket {
  constructor() {
    super(config);
  }
}
