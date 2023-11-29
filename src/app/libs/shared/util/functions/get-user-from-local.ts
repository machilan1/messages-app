import { jwtDecode } from 'jwt-decode';
import { UserEntity } from 'src/app/libs/chat/data-access/models/user.entity';

export function getLocalUser() {
  const decoded = jwtDecode(localStorage.getItem('access_token')!) as {
    user: UserEntity;
  };
  return decoded.user;
}
