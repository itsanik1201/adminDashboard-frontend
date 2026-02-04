import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';


export const authGuard: CanActivateFn = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const auth = inject(AuthService);
  if (auth.isLoggedIn()) return true;

  inject(Router).navigate(['/login']);
  return false;
};
