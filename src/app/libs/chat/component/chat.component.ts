import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { RoomStore } from '../data-access/store/room.store';
import { RoomService } from '../data-access/service/room.service';
import { AuthStore } from '../../auth/data-access/store/auth.store';
import { jwtDecode } from 'jwt-decode';
import { UserEntity } from '../data-access/models/user.entity';
import { getLocalUser } from '../../shared/util/functions/get-user-from-local';
import { MessageStore } from '../data-access/store/message.store';
import { MatListModule } from '@angular/material/list';
import { UserHeaderComponent } from '../ui/user-header/user-header.component';
import { NotificationService } from '../data-access/service/notification.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chat',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    RouterModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    UserHeaderComponent,
  ],
  providers: [
    NotificationService,
    RoomService,
    provideComponentStore(RoomStore),
  ],
  template: `
    <div class="h-screen grid grid-cols-[14rem_1fr]">
      <aside class="max-w-xs w-full h-full shadow max-h-screen overflow-auto">
        <app-user-header [user]="user"></app-user-header>

        <mat-list role="list">
          @for (room of rooms(); track room.id) {

          <a>
            <mat-list-item
              [routerLink]="'/chat/' + room.id"
              routerLinkActive="active"
              class="cursor-pointer hover:bg-slate-100 hover:cursor-pointer"
            >
              <div>{{ room.name }}</div>
            </mat-list-item>
          </a>
          }
        </mat-list>

        @if(!fullyLoaded()){
        <mat-list-item (click)="loadMore()">Load more +</mat-list-item>
        }
      </aside>
      <section class="">
        <router-outlet></router-outlet>
      </section>
    </div>
  `,
  styles: [
    `
      app-user-header {
        position: sticky;
      }

      aside::-webkit-scrollbar {
        display: none;
      }

      .active {
        background-color: #333333;
      }

      .active div {
        color: white;
      }
    `,
  ],
})
export class ChatComponent implements OnInit {
  #roomStore = inject(RoomStore);
  #messageStore = inject(MessageStore);

  user = getLocalUser();
  rooms = this.#roomStore.rooms;
  fullyLoaded = this.#roomStore.fullyLoaded;

  ngOnInit() {
    this.#messageStore.listenToInitialMessages();
    this.#messageStore.listenToNewMessage();
  }

  loadMore() {
    this.#roomStore.paginateRoom();
  }
}
