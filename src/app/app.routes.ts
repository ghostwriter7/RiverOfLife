import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'streams',
    pathMatch: 'full'
  },
  {
    path: 'new',
    loadComponent: () => import('@app/pages/stream-form-page/stream-form/stream-form.component').then(m => m.StreamFormComponent)
  },
  {
    data: { isEdit: true },
    path: 'edit/:streamId',
    loadComponent: () => import('@app/pages/stream-form-page/stream-form/stream-form.component').then(m => m.StreamFormComponent),
  },
  {
    path: 'streams',
    loadComponent: () => import('./pages/streams-page/streams/streams.component').then(m => m.StreamsComponent)
  },
  {
    path: 'streams/:streamId',
    loadComponent: () => import('./pages/stream-page/stream/stream.component').then(m => m.StreamComponent),
  },
  {
    path: '**',
    redirectTo: 'streams'
  }
];
