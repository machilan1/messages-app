import {
  Component,
  ChangeDetectionStrategy,
  Input,
  inject,
  ViewContainerRef,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { RoomStore } from '../../data-access/store/room.store';
import { MatDialog } from '@angular/material/dialog';
import { LeaveRoomDialogComponent } from '../confirm-dialog/leave-room-dialog.component';
import { RoomEntity } from '../../data-access/models/room.entity';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatToolbarModule, MatIconModule, MatMenuModule],
  selector: 'app-room-header',
  template: `
    <p>
      <mat-toolbar color="primary" class="flex justify-between">
        <div>
          <h2 class="inline">{{ room?.name ?? 'Create a new room' }}</h2>
          <span> - </span>
          <h3 class="inline">{{ room?.description ?? '' }}</h3>
        </div>
        @if(menu){

        <button
          mat-icon-button
          [matMenuTriggerFor]="menu"
          class="example-icon"
          aria-label="Example icon-button with share icon"
        >
          <mat-icon>menu</mat-icon>
        </button>
        }
      </mat-toolbar>
      <mat-menu #menu="matMenu">
        <button (click)="onLeave()" mat-menu-item>Leave Room</button>
      </mat-menu>
    </p>
  `,
})
export class RoomHeadComponent {
  #viewContainerRef = inject(ViewContainerRef);
  #roomStore = inject(RoomStore);
  #dialog = inject(MatDialog);
  @Input() room?: RoomEntity;
  @Input() menu: boolean = false;

  onLeave() {
    this.#dialog.open(LeaveRoomDialogComponent, {
      data: this.room,
      viewContainerRef: this.#viewContainerRef,
    });
  }
}
