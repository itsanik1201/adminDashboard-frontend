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

interface Placement {
  _id: string;
  company: string;
  students: string[]; 
  avgSalary: number;
  branch: string;
  year: number;
}

interface ReportItem {
  student: Student;
  placements: Placement[];
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class ReportsComponent implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  reports: ReportItem[] = [];
  loading = false;
  error = '';

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.loading = true;
    this.error = '';
   
    const students = this.getDummyStudents();
    const placements = this.getDummyPlacements();
    this.reports = students.map(student => ({
      student,
      placements: placements.filter(p => p.students.includes(student._id))
    }));
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

  getDummyPlacements(): Placement[] {
    const placements: Placement[] = [];
    const companies = ['Amazon', 'Microsoft', 'Google', 'TCS', 'Infosys'];
    for (let i = 1; i <= 50; i++) {
      placements.push({
        _id: `placement_${i}`,
        company: companies[i % companies.length],
        students: [`student_${(i % 100) + 1}`, `student_${((i + 1) % 100) + 1}`], // Link to some students
        avgSalary: 10000 + (i * 1000),
        branch: 'CSE',
        year: 2023
      });
    }
    return placements;
  }

  isAdminView(): boolean {
    return this.auth.isAdminView();
  }

  createReport() { 
   
    alert('Create report functionality to be implemented');
  }

  editReport(report: ReportItem) {
  
    alert(`Edit report for: ${report.student.name}`);
  }

  deleteReport(report: ReportItem) {
    if (confirm(`Are you sure you want to delete report for ${report.student.name}?`)) {
     
      alert('Delete functionality to be implemented');
    }
  }
}
