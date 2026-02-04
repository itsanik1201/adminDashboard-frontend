/**
 * Auth Service
 * Centralizes authentication state and session management.
 * Uses localStorage for persistence across page refreshes.
 */

import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN_KEY = 'token';
const ROLE_KEY = 'role';
const NAME_KEY = 'userName';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);

  /** Current token from localStorage — used by guards and components. */
  readonly token = signal<string | null>(this.readToken());

  /** True when user has a valid session. */
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

  /**
   * Saves the session to localStorage so it persists across refreshes.
   * Call this after successful login/registration.
   */
  saveSession(token: string, role?: string, name?: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
    if (role) localStorage.setItem(ROLE_KEY, role);
    if (name) localStorage.setItem(NAME_KEY, name);
    this.token.set(token);
  }

  /** Clears the session and navigates to login. */
  clearSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(NAME_KEY);
    this.token.set(null);
  }

  /** Returns the stored role (TPC, STUDENT, DEPT_HEAD) or null. */
  getStoredRole(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ROLE_KEY);
  }

  /** True if the current user has admin-like access (TPC, DEPT_HEAD, or ADMIN). */
  isAdminView(): boolean {
    const role = this.getStoredRole();
    return role === 'TPC' || role === 'DEPT_HEAD' || role === 'ADMIN';
  }

  /** True if the current user is ADMIN only. */
  isAdminOnly(): boolean {
    const role = this.getStoredRole();
    return role === 'ADMIN';
  }

  /**
   * Call after successful authentication. Saves session and navigates to dashboard.
   */
  handleSuccessfulAuthentication(token: string, role?: string, name?: string): void {
    this.saveSession(token, role, name);
    this.redirectToDashboard();
  }

  /** Navigates to the dashboard route. */
  redirectToDashboard(): void {
    this.router.navigate(['/dashboard']).catch(() => {
      window.location.href = '/dashboard';
    });
  }
}
