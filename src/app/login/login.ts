import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../shared/toast/toast';
import { environment } from '../../environments/environment';

const AUTH_API_BASE = `${environment.apiUrl}/api/auth`;
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
     
      this.http.post(`${AUTH_API_BASE}/login`, {
        email: this.email,
        password: this.password
      }).subscribe({
        next: (res: any) => {
          this.isSubmitting = false;
          this.auth.handleSuccessfulAuthentication(
            res.token,
            res.role,
            res.name
          );
        },
        error: (err) => {
          this.isSubmitting = false;

          if (err.status === 404) {
            this.toast.show('User not found. Please register first.', 'error');
            this.isLoginMode = false;
          } else if (err.status === 401) {
            this.toast.show('Invalid password.', 'error');
          } else {
            this.toast.show('Login failed. Please try again.', 'error');
          }

          console.error('Login error:', err);
        }
      });

    } else {
    
      this.http.post(`${AUTH_API_BASE}/register`, {
        name: this.candidateName,
        email: this.email,
        password: this.password,
        role: this.portalAccessLevel
      }).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.toast.show('Registration successful. Please login.', 'success');
          this.isLoginMode = true;
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toast.show(
            err.error?.message || 'Registration failed.',
            'error'
          );
          console.error('Register error:', err);
        }
      });
    }
  }
  enterDashboardAnyway(): void {
    this.auth.handleSuccessfulAuthentication(
      DEMO_TOKEN,
      this.portalAccessLevel,
      this.candidateName || 'Demo User'
    );
  }

  switchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }
}
