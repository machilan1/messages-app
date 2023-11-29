import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  DestroyRef,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { LoginDto } from '../data-access/models/loginDto.interface';
import { AuthService } from '../data-access/service/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthStore } from '../data-access/store/auth.store';

import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
  ],
  template: `
    <div class="flex justify-center items-center h-screen">
      <form
        (submit)="submit()"
        class="flex flex-col h-fit max-w-sm w-full bg-white p-4 rounded-xl shadow-md"
        [formGroup]="form"
      >
        <h2 class="text-2xl">Login</h2>
        <div class="flex flex-col my-4">
          <mat-form-field>
            <mat-label>Enter your email</mat-label>
            <input type="email" matInput formControlName="email" />
            @if (form.controls.email.invalid) {
            <mat-error>Invalid email</mat-error>
            }
          </mat-form-field>
          <mat-form-field>
            <mat-label>Enter your password</mat-label>
            <input type="password" matInput formControlName="password" />
            @if (form.controls.password.invalid) {
            <mat-error>Please enter password</mat-error>
            }
          </mat-form-field>
        </div>
        <button
          [disabled]="form.invalid"
          type="submit"
          mat-flat-button
          color="primary"
        >
          Login
        </button>
        <div class="pt-4 text-center">or</div>
        <button
          routerLink="/register"
          type="button"
          class="hover:bg-white"
          mat-flat-button
        >
          Register
        </button>
      </form>
    </div>
  `,
  styles: [``],
})
export class LoginComponent {
  #authStore = inject(AuthStore);
  #fb = inject(NonNullableFormBuilder);

  form = this.#fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.#authStore.login(this.form.getRawValue());
  }
}
