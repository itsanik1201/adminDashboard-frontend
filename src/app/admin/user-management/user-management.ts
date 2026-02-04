import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css']
})
export class UserManagementComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  users: User[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    const token = this.authService.token();
    if (!token) return;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<User[]>('http://localhost:5000/api/auth/users', { headers })
      .subscribe({
        next: (users) => {
          this.users = users;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load users';
          this.loading = false;
        }
      });
  }

  updateUserRole(userId: string, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newRole = target.value;

    const token = this.authService.token();
    if (!token) return;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.put(`http://localhost:5000/api/auth/users/role`, { userId, role: newRole }, { headers })
      .subscribe({
        next: () => {
          this.loadUsers(); 
        },
        error: (err) => {
          this.error = 'Failed to update user role';
        }
      });
  }

  deleteUser(userId: string): void {
    if (!confirm('Are you sure you want to delete this user?')) return;

    const token = this.authService.token();
    if (!token) return;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.delete(`http://localhost:5000/api/auth/users/${userId}`, { headers })
      .subscribe({
        next: () => {
          this.loadUsers(); 
        },
        error: (err) => {
          this.error = 'Failed to delete user';
        }
      });
  }
}
