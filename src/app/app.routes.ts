import { Routes, provideRouter } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./libs/auth/feature/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./libs/auth/feature/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'chat',

    loadComponent: () =>
      import('./libs/chat/component/chat.component').then(
        (m) => m.ChatComponent
      ),
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./libs/chat/component/create-room.component').then(
            (m) => m.CreateRoomComponent
          ),
      },
      {
        path: ':roomId',
        loadComponent: () =>
          import('./libs/chat/ui/chat-feed/chat-feed.component').then(
            (m) => m.ChatFeedComponent
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
