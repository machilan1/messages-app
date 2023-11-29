import {
  Component,
  ChangeDetectionStrategy,
  inject,
  DestroyRef,
  OnInit,
} from '@angular/core';

import {
  NonNullableFormBuilder,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../data-access/service/auth.service';
import { RegisterDto } from '../data-access/models/registerDto.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Observable, combineLatest, map, tap } from 'rxjs';
import { passwordMatches } from '../util/validators/password-matched.validator';
import { RouterModule } from '@angular/router';
import { AuthStore } from '../data-access/store/auth.store';
import { provideComponentStore } from '@ngrx/component-store';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [AuthService, provideComponentStore(AuthStore)],
  template: `
    <div class="flex justify-center items-center h-screen">
      <form
        (submit)="register()"
        class="flex flex-col h-fit max-w-sm w-full bg-white p-4 rounded-xl shadow-md"
        [formGroup]="form"
      >
        <h2 class="text-2xl">Register</h2>
        <div class="flex flex-col my-4">
          <mat-form-field>
            <mat-label>Enter your username</mat-label>
            <input type="email" matInput formControlName="username" />
            @if (form.controls.email.invalid) {
            <mat-error>Invalid username</mat-error>
            }
          </mat-form-field>
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
          <mat-form-field>
            <mat-label>Confirm password</mat-label>
            <input type="password" matInput formControlName="confirmPassword" />
            <!-- error handling  -->
          </mat-form-field>
        </div>
        <button
          [disabled]="form.invalid"
          type="submit"
          mat-flat-button
          color="primary"
        >
          Register
        </button>
        <div class="pt-4 text-center">or</div>
        <button
          routerLink="/login"
          type="button"
          class="hover:bg-white"
          mat-flat-button
        >
          Login
        </button>
      </form>
    </div>
  `,
  styles: [``],
})
export class RegisterComponent {
  // private readonly authService = inject(AuthService);
  #authStore = inject(AuthStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(NonNullableFormBuilder);

  form = this.fb.group(
    {
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: [passwordMatches()] }
  );

  get confirmPassword(): FormControl<string> {
    return this.form.get('confirmPassword') as FormControl<string>;
  }

  get password(): FormControl<string> {
    return this.form.get('password') as FormControl<string>;
  }

  match = this.confirmPassword.getRawValue() === this.password.getRawValue();

  register() {
    if (this.form.invalid) {
      return;
    }

    const { confirmPassword, ...rest } = this.form.getRawValue();
    this.#authStore.register(rest);
  }
}
