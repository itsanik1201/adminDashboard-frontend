import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Guards routes that require authentication.
 * Uses AuthService.isLoggedIn so state stays in sync with localStorage.
 */
export const authGuard: CanActivateFn = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const auth = inject(AuthService);
  if (auth.isLoggedIn()) return true;

  inject(Router).navigate(['/login']);
  return false;
};
