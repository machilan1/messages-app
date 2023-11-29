import { Injectable, inject } from '@angular/core';
import {
  ComponentStore,
  OnStateInit,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { Observable, catchError, exhaustMap, of, switchMap, tap } from 'rxjs';
import { LoginDto } from '../models/loginDto.interface';
import { AuthService } from '../service/auth.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { RegisterDto } from '../models/registerDto.interface';
import { UserEntity } from 'src/app/libs/chat/data-access/models/user.entity';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LOGIN_SUCCESS, REGISTER_SUCCESS } from '../constants/snack.constant';
import { HttpErrorResponse } from '@angular/common/http';

interface AuthState {
  currentUser?: UserEntity;
  loading: boolean;
}

const initialState: AuthState = {
  loading: false,
};

@Injectable({ providedIn: 'root' })
export class AuthStore extends ComponentStore<AuthState> {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);
  readonly #snackbar = inject(MatSnackBar);
  readonly currentUser = this.selectSignal((state) => state.currentUser);
  readonly loading = this.selectSignal((state) => state.loading);

  constructor() {
    super(initialState);
  }

  readonly setCurrentUser = this.updater((state, currentUser: UserEntity) => ({
    ...state,
    currentUser,
  }));

  readonly setLoading = this.updater((state, loading: boolean) => ({
    ...state,
    loading,
  }));

  readonly login = this.effect<LoginDto>((credential$) =>
    credential$.pipe(
      tap(() => this.patchState({ loading: true })),
      exhaustMap((credentials) =>
        this.#authService.login(credentials).pipe(
          tapResponse(
            (res) => {
              const decodedJwt = jwtDecode(res.accessToken) as unknown as {
                user: UserEntity;
              };
              localStorage.setItem('access_token', res.accessToken);
              localStorage.setItem('user_id', decodedJwt.user.id.toString());

              this.patchState({ loading: false, currentUser: decodedJwt.user });
              this.#snackbar.open(
                LOGIN_SUCCESS + decodedJwt.user.username,
                undefined,
                {
                  duration: 3000,
                }
              );
              this.#router.navigate(['chat']);
            },
            (error: HttpErrorResponse) => {
              this.patchState({ loading: false });
              console.log(error);

              this.#snackbar.open(error.error.message, '', { duration: 3000 });
            }
          )
        )
      )
    )
  );

  readonly register = this.effect<RegisterDto>((data$) =>
    data$.pipe(
      tap(() => {
        this.patchState({ loading: true });
      }),
      exhaustMap((data) =>
        this.#authService.register(data).pipe(
          tapResponse(
            () => {
              this.#snackbar.open(REGISTER_SUCCESS, undefined, {
                duration: 3000,
              });
              this.#router.navigate(['/login']);
            },
            (error: string) => {
              this.#snackbar.open(error, '', {
                duration: 3000,
              });
            },
            () => {
              this.patchState({ loading: false });
            }
          )
        )
      )
    )
  );
}
