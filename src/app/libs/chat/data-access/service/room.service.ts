import { Injectable, inject } from '@angular/core';
import { CustomSocket } from '../sockets/custom-socket';
import { RoomEntity } from '../models/room.entity';
import { map, tap } from 'rxjs';
import { Paginate } from '../models/paginate.interface';
import { HttpClient } from '@angular/common/http';
import { API_LINK } from 'src/app/libs/shared/util/constants/global.constant';

interface CreateRoomDto {
  name: string;
  description: string;
  userIds: number[];
}

@Injectable()
export class RoomService {
  #socket = inject(CustomSocket);
  #http = inject(HttpClient);

  /** Returns an observable that emits value when user finished loading his room list.
   *
   * @returns Observable<RoomEntity[]>
   */
  receiveUserRooms() {
    return this.#socket.fromEvent<Paginate<RoomEntity>>('receiveUserRooms');
  }

  /** Emits roomId to socket endpoint "selectRoom" when user click on a room option.
   *
   */
  selectRoom(roomId: number) {
    this.#socket.emit('selectRoom', roomId);
  }

  /** Emits roomId to socket endpoint "deleteRoom" when user click on leave room.
   *
   */
  leaveRoom(roomId: number) {
    this.#socket.emit('leaveRoom', roomId);
  }

  /** Return an observable that emits value when deletion of room is completed.
   *
   */
  listenLeaveRoom() {
    return this.#socket.fromEvent<RoomEntity>('receiveLeaveRoomResponse');
  }

  /** Returns an observable that emits value when selected room is loaded with messages.
   *
   * @returns Observable <RoomEntity>
   */
  receiveSelectedRoom() {
    return this.#socket.fromEvent<RoomEntity>('receiveSelectedRoom');
  }

  /** Returns an Observable that emits value when a new room is successfully created.
   *
   * @returns Observable < RoomEntity >
   */
  receiveNewRoom() {
    return this.#socket.fromEvent<RoomEntity>('receiveCreatedRoom');
  }

  /** Emits payload to socket endpoint "createRoom" whenever user creates a room.
   *
   */
  createNewRoom(createRoomDto: CreateRoomDto) {
    this.#socket.emit('createRoom', createRoomDto);
  }

  /** Load next page of rooms if exist
   *
   *
   */
  requestNextPage(index: number) {
    this.#socket.emit('paginateRoom', index);
  }

  /** Return an observable that emits value when a new batch of room data  is successfully loaded.
   *
   * @returns Observable Paginate<RoomEntity>
   */
  receivePaginateRoom() {
    return this.#socket.fromEvent<Paginate<RoomEntity>>('receivePaginatedRoom');
  }
}
