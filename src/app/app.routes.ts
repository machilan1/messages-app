import { Routes, provideRouter } from '@angular/router';
import { needLogin } from './libs/shared/util/guards/auth.guard';
import { isParticipant } from './libs/shared/util/guards/participant.guard';
import { ChatComponent } from './libs/chat/component/chat.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [() => needLogin(false)],
    loadComponent: () =>
      import('./libs/auth/feature/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    canActivate: [() => needLogin(false)],
    loadComponent: () =>
      import('./libs/auth/feature/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'chat',
    canActivate: [() => needLogin(true)],
    loadComponent: () =>
      import('./libs/chat/component/chat.component').then(
        (m) => m.ChatComponent
      ),
    children: [
      { path: '', component: ChatComponent },
      {
        path: 'new',
        loadComponent: () =>
          import('./libs/chat/component/create-room.component').then(
            (m) => m.CreateRoomComponent
          ),
      },
      {
        path: ':roomId',
        canActivate: [isParticipant],
        loadComponent: () =>
          import('./libs/chat/ui/chat-feed/chat-feed.component').then(
            (m) => m.ChatFeedComponent
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
