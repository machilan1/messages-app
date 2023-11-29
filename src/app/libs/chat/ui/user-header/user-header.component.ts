import {
  Component,
  ChangeDetectionStrategy,
  Input,
  inject,
} from '@angular/core';
import { UserEntity } from '../../data-access/models/user.entity';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatRippleModule } from '@angular/material/core';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatTooltipModule,
    MatRippleModule,
  ],
  selector: 'app-user-header',
  template: `
    <div class="flex pl-4 py-2 justify-between">
      <div class="flex gap-2">
        <div class="bg-gray-200 aspect-square h-12 rounded-full"></div>
        <div>
          <div>{{ user.username }}</div>
          <small>{{ user.email }}</small>
        </div>
      </div>
      <button
        (click)="openDialog()"
        class="scale-75"
        matTooltip="Sign out"
        mat-icon-button
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 11H13V13H5V16L0 12L5 8V11ZM3.99927 18H6.70835C8.11862 19.2447 9.97111 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C9.97111 4 8.11862 4.75527 6.70835 6H3.99927C5.82368 3.57111 8.72836 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C8.72836 22 5.82368 20.4289 3.99927 18Z"
            fill="#333333"
          />
        </svg>
      </button>
    </div>
    <div class="flex justify-center mt-4">
      <a
        matRipple
        [matRippleColor]="'rgba(200,200,200,.4)'"
        routerLink="/chat/new"
        class="px-4 bg-[#222222] hover:bg-[#333333] text-white py-1 rounded-full w-fit flex-nowrap"
      >
        <small class="inline"> Create a new room + </small>
      </a>
    </div>
  `,
})
export class UserHeaderComponent {
  #dialog = inject(MatDialog);

  @Input({ required: true }) user!: UserEntity;

  openDialog(): void {
    const dialogRef = this.#dialog.open(ConfirmDialogComponent);
  }
}
