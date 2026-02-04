 import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login').then(m => m.Login)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/layout').then(m => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'placements',
        loadComponent: () =>
          import('./dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'user-management',
        loadComponent: () =>
          import('./admin/user-management/user-management').then(m => m.UserManagementComponent)
      },
      {
        path: 'manage-candidates',
        loadComponent: () =>
          import('./admin/manage-candidates/manage-candidates').then(m => m.ManageCandidatesComponent)
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./admin/reports/reports').then(m => m.ReportsComponent)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
