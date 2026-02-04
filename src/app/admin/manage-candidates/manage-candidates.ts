import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';

interface Student {
  _id: string;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-manage-candidates',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './manage-candidates.html',
  styleUrls: ['./manage-candidates.css']
})
export class ManageCandidatesComponent implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  students: Student[] = [];
  loading = false;
  error = '';

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.loading = true;
    this.error = '';
    // Use dummy data instead of API call
    this.students = this.getDummyStudents();
    this.loading = false;
  }

  getDummyStudents(): Student[] {
    const students: Student[] = [];
    const names = ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Eve Adams', 'Frank Miller', 'Grace Lee', 'Henry Wilson', 'Ivy Chen', 'Jack Davis'];
    const roles = ['Student', 'Candidate', 'Applicant'];
    for (let i = 1; i <= 100; i++) {
      students.push({
        _id: `student_${i}`,
        name: `${names[i % names.length]} ${i}`,
        email: `student${i}@example.com`,
        role: roles[i % roles.length]
      });
    }
    return students;
  }

  isAdminOnly(): boolean {
    return this.auth.isAdminOnly();
  }

  // CRUD operations would be implemented here
  createStudent() {
    // TODO: Implement create modal/form
    alert('Create student functionality to be implemented');
  }

  editStudent(student: Student) {
    // TODO: Implement edit modal/form
    alert(`Edit student: ${student.name}`);
  }

  deleteStudent(student: Student) {
    if (confirm(`Are you sure you want to delete ${student.name}?`)) {
      // TODO: Implement delete API call
      alert('Delete functionality to be implemented');
    }
  }
}
