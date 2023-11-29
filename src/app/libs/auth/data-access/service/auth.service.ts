import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { LoginResponse } from '../models/loginResponse.interface';
import { LoginDto } from '../models/loginDto.interface';
import { RegisterDto } from '../models/registerDto.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  #http = inject(HttpClient);

  login(loginDto: LoginDto): Observable<LoginResponse> {
    return this.#http.post<LoginResponse>(
      'http://localhost:3000/api/auth/login',
      loginDto
    );
  }

  register(registerDto: RegisterDto) {
    return this.#http
      .post('http://localhost:3000/api/auth/register', registerDto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          throw new Error(error.error.message);
        })
      );
  }
}
