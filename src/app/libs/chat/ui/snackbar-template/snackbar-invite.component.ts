import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { RoomEntity } from '../../data-access/models/room.entity';
import { Router } from '@angular/router';
import { UserEntity } from '../../data-access/models/user.entity';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
  ],
  template: `
    <div class="flex">
      <span class="example-pizza-party" matSnackBarLabel>
        {{ data.user.name }} invites you to join {{ data.room.name }}</span
      >
      <span matSnackBarActions>
        <button
          mat-flat-button
          color="primary"
          matSnackBarAction
          (click)="snackbarRef.dismissWithAction(); visit()"
        >
          Visit
        </button>
        <button
          mat-button
          matSnackBarAction
          (click)="snackbarRef.dismissWithAction()"
        >
          Later
        </button>
      </span>
    </div>
  `,
})
export class SnackbarInvitationComponent {
  snackbarRef = inject(MatSnackBarRef);
  #router = inject(Router);

  data: { user: UserEntity; room: RoomEntity } = inject(MAT_SNACK_BAR_DATA);

  visit() {
    this.#router.navigate([`/chat/${this.data.room.id}`]);
  }
}
