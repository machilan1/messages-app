import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RoomHeadComponent } from '../ui/room-header/room-header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { UserEntity } from '../data-access/models/user.entity';
import { UserService } from '../data-access/service/user.service';
import { debounceTime, map, startWith, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RoomService } from '../data-access/service/room.service';
import { CreateRoomDto } from '../data-access/models/create-room.dto';
import { MatCardModule } from '@angular/material/card';
import { provideComponentStore } from '@ngrx/component-store';
import { CreateRoomStore } from '../data-access/store/create-room.store';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RoomHeadComponent,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule,
    MatChipsModule,
    MatIconModule,
    MatCardModule,
  ],
  providers: [provideComponentStore(CreateRoomStore), UserService],
  selector: 'app-create-room',
  template: `
    <div class="h-screen grid grid-rows-[4rem_1fr]">
      <app-room-header
        title="Create room"
        description="Start your own chat"
      ></app-room-header>
      <div class="h-full flex justify-center items-center">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Create room</mat-card-title>
            <mat-card-subtitle>Fill out the following form</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <form
              class="max-w-lg w-[25rem]"
              [formGroup]="form"
              (submit)="submit()"
            >
              <div>
                <mat-form-field>
                  <mat-label>Chatroom name</mat-label>
                  <input formControlName="name" matInput type="text" />
                </mat-form-field>
              </div>
              <div>
                <mat-form-field>
                  <mat-label>Description</mat-label>
                  <input formControlName="description" matInput type="text" />
                </mat-form-field>
              </div>

              <mat-form-field>
                <mat-chip-grid #chipGrid aria-label="Fruit selection">
                  @for (user of form.controls.users.value; track user) {
                  <mat-chip-row (removed)="remove(user)">
                    <img
                      matChipAvatar
                      [src]="
                        'https://material.angular.io/assets/img/examples/shiba1.jpg'
                      "
                      alt="Photo of a Shiba Inu"
                    />
                    {{ user.username }}
                    <button
                      matChipRemove
                      [attr.aria-label]="'remove ' + user.username"
                    >
                      <mat-icon>cancel</mat-icon>
                    </button>
                  </mat-chip-row>
                  }
                </mat-chip-grid>

                <mat-label>Invite user</mat-label>
                <input
                  type="text"
                  [formControl]="search"
                  placeholder="Search and pick"
                  aria-label="Number"
                  matInput
                  [matAutocomplete]="auto"
                  [matChipInputFor]="chipGrid"
                />
                <mat-autocomplete
                  [displayWith]="displayFn"
                  (optionSelected)="select($event)"
                  autoActiveFirstOption
                  #auto="matAutocomplete"
                >
                  @for (option of options|async ; track option) {
                  <mat-option [value]="option">{{
                    option.username
                  }}</mat-option>
                  }
                </mat-autocomplete>
              </mat-form-field>
              <mat-card-actions>
                <button mat-flat-button>Send</button>
              </mat-card-actions>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      mat-form-field {
        display: block;
      }
    `,
  ],
})
export class CreateRoomComponent {
  #fb = inject(NonNullableFormBuilder);
  #createRoomStore = inject(CreateRoomStore);
  #userService = inject(UserService);

  search = this.#fb.control('');

  options = this.search.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    switchMap((substring) => this.#userService.findManyWithSubtext(substring)),
    map((list) =>
      list.filter(
        (user) => user.id !== parseInt(localStorage.getItem('user_id')!)
      )
    )
  );

  form = this.#fb.group({
    name: this.#fb.control('', [Validators.required]),
    description: this.#fb.control('', [Validators.required]),
    users: this.#fb.control<UserEntity[]>([], [Validators.required]),
  });

  submit() {
    const { name, description, users } = this.form.value as CreateRoomDto;
    this.#createRoomStore.submit({
      name,
      description,
      userIds: users?.map((user) => user.id) ?? [],
    });
  }

  select(event: MatAutocompleteSelectedEvent) {
    const target = event.option.value as UserEntity;
    const before = this.form.controls.users.getRawValue();
    if (before.map((user) => user.id).includes(target.id)) {
      return;
    }
    this.form.controls.users.value.push(target);
  }

  remove(user: UserEntity): void {
    const index = this.form.controls.users.value.indexOf(user);
    if (index >= 0) {
      this.form.controls.users.value.splice(index, 1);
    }
  }

  displayFn(user: UserEntity): string {
    return user.username;
  }
}
