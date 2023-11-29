import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from 'src/app/libs/auth/data-access/store/auth.store';

export function needLogin(needLogin: boolean) {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (needLogin) {
    if (!localStorage.getItem('access_token')) {
      return router.createUrlTree(['/login']);
    } else {
      return true;
    }
  } else {
    if (!localStorage.getItem('access_token')) {
      return true;
    } else {
      return router.createUrlTree(['/chat']);
    }
  }
}
