import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { RoomService } from 'src/app/libs/chat/data-access/service/room.service';
import { API_LINK } from '../constants/global.constant';
import { jwtDecode } from 'jwt-decode';
import { UserEntity } from 'src/app/libs/chat/data-access/models/user.entity';

export const isParticipant: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const roomId = route.params['roomId'];
  const userId = (
    jwtDecode(localStorage.getItem('access_token')!) as { user: UserEntity }
  ).user.id;

  const res = await fetch(
    API_LINK + `/room/checkParticipant?userId=${userId}&roomId=${roomId}`
  );

  const allowed = await res.json();

  return allowed ? true : router.createUrlTree(['/chat']);
};
