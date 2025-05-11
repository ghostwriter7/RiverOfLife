import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'streams',
    pathMatch: 'full'
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/new-stream-page/new-stream/new-stream.component').then(m => m.NewStreamComponent)
  },
  {
    path: 'streams',
    loadComponent: () => import('./pages/streams-page/streams/streams.component').then(m => m.StreamsComponent)
  },
  {
    path: '**',
    redirectTo: 'streams'
  }
];
