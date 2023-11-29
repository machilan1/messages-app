import { Component, inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { RoomStore } from '../../data-access/store/room.store';
import { Router } from '@angular/router';
import { RoomEntity } from '../../data-access/models/room.entity';

@Component({
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  template: `
    <h1 mat-dialog-title>Confirm</h1>
    <div mat-dialog-content>
      <p>Leaving</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">No Thanks</button>
      <button (click)="onConfirm()" mat-button cdkFocusInitial>Yes</button>
    </div>
  `,
})
export class LeaveRoomDialogComponent {
  #dialogRef = inject(MatDialogRef<LeaveRoomDialogComponent>);
  #data = inject(MAT_DIALOG_DATA) as RoomEntity;
  #roomStore = inject(RoomStore);

  onNoClick() {
    this.#dialogRef.close();
  }
  onConfirm() {
    this.#dialogRef.close();
    this.#roomStore.leaveRoom(this.#data.id);
  }
}
