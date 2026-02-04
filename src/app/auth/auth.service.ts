
import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN_KEY = 'token';
const ROLE_KEY = 'role';
const NAME_KEY = 'userName';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);

  readonly token = signal<string | null>(this.readToken());
  readonly isLoggedIn = computed(() => !!this.token());

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', () => this.token.set(this.readToken()));
    }
  }
  private readToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }
  saveSession(token: string, role?: string, name?: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
    if (role) localStorage.setItem(ROLE_KEY, role);
    if (name) localStorage.setItem(NAME_KEY, name);
    this.token.set(token);
  }
  clearSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(NAME_KEY);
    this.token.set(null);
  }

  getStoredRole(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ROLE_KEY);
  }
  isAdminView(): boolean {
    const role = this.getStoredRole();
    return role === 'TPC' || role === 'DEPT_HEAD' || role === 'ADMIN';
  }
  isAdminOnly(): boolean {
    const role = this.getStoredRole();
    return role === 'ADMIN';
  }

  handleSuccessfulAuthentication(token: string, role?: string, name?: string): void {
    this.saveSession(token, role, name);
    this.redirectToDashboard();
  }
  redirectToDashboard(): void {
    this.router.navigate(['/dashboard']).catch(() => {
      window.location.href = '/dashboard';
    });
  }
}
