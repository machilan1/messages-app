import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1 mat-dialog-title>Confirm</h1>
    <div mat-dialog-content>
      <p>Sign out now?</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">No Thanks</button>
      <button (click)="onConfirm()" mat-button cdkFocusInitial>Yes</button>
    </div>`,
})
export class ConfirmDialogComponent {
  #router = inject(Router);
  snackbar = inject(MatSnackBar);
  dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  onNoClick() {
    this.dialogRef.close();
  }

  async onConfirm() {
    this.dialogRef.close();
    await this.#router.navigate(['/']);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    this.snackbar.open('Signed out', 'Bye', { duration: 2000 });
  }
}
