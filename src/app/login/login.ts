import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../shared/toast/toast';

const AUTH_API_BASE = 'http://localhost:5000/api/auth';
const LOGIN_TIMEOUT_MS = 3000;
const DEMO_TOKEN = 'demo-session-token';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  isLoginMode = true;
  isSubmitting = false;
  showTimeoutBypass = false;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  candidateName = '';
  email = '';
  password = '';
  portalAccessLevel: 'TPC' | 'STUDENT' | 'DEPT_HEAD' = 'STUDENT';

  constructor(
    private auth: AuthService,
    private toast: ToastService,
    private http: HttpClient
  ) {}
  get isEmailValid(): boolean {
    const e = this.email.trim();
    return e.includes('@') && e.includes('.');
  }

  get canSubmit(): boolean {
    return this.isEmailValid && this.password.length >= 6;
  }
  handleSubmit(): void {
    if (!this.canSubmit) return;

    this.isSubmitting = true;
    if (this.isLoginMode) {
      this.http.post(`${AUTH_API_BASE}/login`, { email: this.email, password: this.password })
        .subscribe({
          next: (response: any) => {
            this.isSubmitting = false;
            this.auth.handleSuccessfulAuthentication(response.token, response.role, response.name);
          },
          error: (error) => {
            this.isSubmitting = false;
            if (error.status === 404) {
              this.toast.show('User not found. Please register first.', 'error');
              this.switchToRegister();
            } else if (error.status === 401) {
              this.toast.show('Invalid password.', 'error');
            } else {
              this.toast.show('Login failed. Please try again.', 'error');
            }
            console.error('Login error:', error);
          }
        });
    } else {
      this.http.post(`${AUTH_API_BASE}/register`, {
        name: this.candidateName,
        email: this.email,
        password: this.password,
        portalAccessLevel: this.portalAccessLevel
      })
        .subscribe({
          next: (response: any) => {
            this.isSubmitting = false;
            this.toast.show('Registration successful. You can now log in.', 'success');
            this.switchToLogin();
          },
          error: (error) => {
            this.isSubmitting = false;
            this.toast.show(error.error?.message || 'Registration failed. Please try again.', 'error');
            console.error('Register error:', error);
          }
        });
    }
  }
  handleSuccessfulAuthentication(token: string, role?: string, name?: string): void {
    this.auth.handleSuccessfulAuthentication(token, role, name);
  }
  enterDashboardAnyway(): void {
    this.auth.handleSuccessfulAuthentication(
      DEMO_TOKEN,
      this.portalAccessLevel,
      this.candidateName || this.email || 'Demo User'
    );
  }

  private clearTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  switchMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.showTimeoutBypass = false;
  }

  switchToRegister(): void {
    this.isLoginMode = false;
    this.showTimeoutBypass = false;
  }

  switchToLogin(): void {
    this.isLoginMode = true;
    this.showTimeoutBypass = false;
  }
}
