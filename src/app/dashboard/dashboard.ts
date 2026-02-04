/**
 * Dashboard Component
 * Loads placement data from mock JSON (with inline fallback) and shows welcome message.
 */

/* External Libraries */
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

/* Internal Components */
import { KpiCardsComponent, KpiMetric } from './kpi-cards/kpi-cards';
import { PlacementChartsComponent } from './placement-charts/placement-charts';
import { RecruitersPanelComponent } from './recruiters-panel/recruiters-panel';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

const MOCK_DATA_URL = '/mock-placements.json';

const DEFAULT_METRICS: KpiMetric[] = [
  { value: '725+', label: 'Offers' },
  { value: '260+', label: 'Companies Visited' },
  { value: '100+', label: 'New Recruiters' },
  { value: '82 LPA', label: 'Highest CTC' },
  { value: '12.63 LPA', label: 'Average CTC' },
  { value: '93.7%', label: 'Placement %', isHighlight: true }
];

const DEFAULT_RECRUITERS = [
  'Amazon', 'Microsoft', 'Google', 'Goldman Sachs', 'Flipkart', 'Adobe',
  'Intel', 'Qualcomm', 'Uber', 'PayPal', 'JP Morgan', 'Deloitte',
  'Apple', 'Meta', 'Netflix', 'Tesla', 'Cisco', 'Oracle', 'SAP',
  'Accenture', 'TCS', 'Infosys', 'Wipro', 'HCL', 'IBM', 'Capgemini',
  'Morgan Stanley', 'BlackRock', 'Citigroup', 'Wells Fargo', 'Barclays',
  'Samsung', 'Sony', 'LG', 'Micron', 'Texas Instruments', 'Broadcom'
];

const DEFAULT_COMPANY_PLACEMENTS = [
  { company: 'Amazon', students: 75, avgSalary: 28.5 },
  { company: 'Microsoft', students: 62, avgSalary: 32.0 },
  { company: 'Google', students: 45, avgSalary: 35.2 },
  { company: 'Goldman Sachs', students: 32, avgSalary: 22.8 },
  { company: 'Flipkart', students: 68, avgSalary: 18.5 },
  { company: 'Adobe', students: 38, avgSalary: 24.6 },
  { company: 'TCS', students: 140, avgSalary: 8.2 },
  { company: 'Infosys', students: 125, avgSalary: 7.8 },
  { company: 'Wipro', students: 110, avgSalary: 6.9 },
  { company: 'Accenture', students: 85, avgSalary: 9.5 }
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    KpiCardsComponent,
    PlacementChartsComponent,
    RecruitersPanelComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('placementBarChartCanvas', { static: false }) placementBarChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('salaryDistributionCanvas', { static: false }) salaryDistributionCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('monthlyPlacementsCanvas', { static: false }) monthlyPlacementsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('branchPieChartCanvas', { static: false }) branchPieChartCanvas!: ElementRef<HTMLCanvasElement>;

  isFetching = false;
  activeTab = 'placements';
  placementMetrics: KpiMetric[] = [...DEFAULT_METRICS];
  recruitersList = [...DEFAULT_RECRUITERS];
  trendData = { labels: ['2020', '2021', '2022', '2023', '2024'], values: [78, 82, 86, 90, 93] };
  branchData = { labels: ['CSE', 'ECE', 'EE', 'ME', 'CE', 'PIE'], values: [98, 95, 92, 88, 85, 90] };
  currentDate = new Date().toLocaleDateString();

  // Analytics data properties
  salaryDistribution: any = { labels: [], values: [] };
  companyWisePlacements: any[] = [...DEFAULT_COMPANY_PLACEMENTS];
  branchTrends: any = {};
  monthlyPlacements: any = { labels: [], values: [] };
  topBranches: any[] = [];
  genderStats: any = { male: 0, female: 0 };
  internationalOffers: number = 0;
  ppoStats: any = { ppoReceived: 0, ppoAccepted: 0 };

  // Admin properties
  isAdmin = false;
  showAddForm = false;
  newPlacement = { company: '', students: 0, avgSalary: 0, branch: '' };

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef, private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdminView();
    this.loadPlacementData();
    this.setActiveTabFromRoute();
  }

  ngAfterViewInit(): void {
    // Humanized animation: Bar graph grows from bottom when page loads
    setTimeout(() => {
      this.initializePlacementBarChart();
    }, 1000); // Delay to ensure data is loaded
  }

  /** Sets the active tab. */
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'analytics') {
      // Re-initialize charts if switching to analytics tab
      setTimeout(() => {
        this.initializePlacementBarChart();
        this.initializeSalaryDistributionChart();
        this.initializeMonthlyPlacementsChart();
      }, 100);
    }
    if (tab === 'dashboard') {
      // Re-initialize charts if switching to dashboard tab
      setTimeout(() => {
        this.initializePlacementBarChart();
        this.initializeBranchPieChart();
      }, 100);
    }
  }

  /** Sets the active tab based on the current route. */
  private setActiveTabFromRoute(): void {
    this.route.url.subscribe(url => {
      const path = url[0]?.path;
      if (path === 'analytics') {
        this.activeTab = 'analytics';
        this.loadPlacementData(); // Reload data when switching to analytics
      } else if (path === 'placements') {
        this.activeTab = 'placements';
        this.loadPlacementData(); // Reload data when switching to placements
      } else {
        this.activeTab = 'dashboard';
        this.loadPlacementData(); // Reload data when switching to dashboard
      }
      this.cdr.detectChanges(); // Force change detection to update the view immediately
      if (this.activeTab === 'analytics') {
        setTimeout(() => {
          this.initializePlacementBarChart();
          this.initializeSalaryDistributionChart();
          this.initializeMonthlyPlacementsChart();
        }, 100);
      }
    });
  }

  /** Loads placement data from mock JSON; falls back to defaults if fetch fails. */
  private async loadPlacementData(): Promise<void> {
    try {
      const res = await fetch(MOCK_DATA_URL);
      if (res.ok) {
        const data = await res.json();
        if (data.metrics?.length) this.placementMetrics = data.metrics;
        if (data.recruiters?.length) this.recruitersList = data.recruiters;
        if (data.trend) {
          this.trendData = { labels: data.trend.labels || this.trendData.labels, values: data.trend.values || this.trendData.values };
        }
        if (data.branchWise) {
          this.branchData = { labels: data.branchWise.labels || this.branchData.labels, values: data.branchWise.values || this.branchData.values };
        }
        if (data.analytics) {
          if (data.analytics.salaryDistribution) {
            this.salaryDistribution = data.analytics.salaryDistribution;
          }
          if (data.analytics.companyWisePlacements) {
            this.companyWisePlacements = data.analytics.companyWisePlacements;
          }
          if (data.analytics.branchTrends) {
            this.branchTrends = data.analytics.branchTrends;
          }
          if (data.analytics.monthlyPlacements) {
            this.monthlyPlacements = data.analytics.monthlyPlacements;
          }
          if (data.analytics.topBranches) {
            this.topBranches = data.analytics.topBranches;
          }
          if (data.analytics.genderStats) {
            this.genderStats = data.analytics.genderStats;
          }
          if (data.analytics.internationalOffers) {
            this.internationalOffers = data.analytics.internationalOffers;
          }
          if (data.analytics.ppoStats) {
            this.ppoStats = data.analytics.ppoStats;
          }
        }
      }
    } catch {
      // Use defaults; UI stays eye-catching
    } finally {
      // Brief delay so "Welcome back" message is visible
      setTimeout(() => { this.isFetching = false; }, 800);
    }
  }

  /** Initializes the placement bar chart with NITJ Branch Analytics. */
  private initializePlacementBarChart(): void {
    if (!this.placementBarChartCanvas) return;

    const ctx = this.placementBarChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.branchData.labels,
        datasets: [{
          label: 'Placement Percentage (%)',
          data: this.branchData.values,
          backgroundColor: '#003366', // NITJ Blue
          borderColor: '#003366',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        },
        animation: {
          duration: 2000,
          easing: 'easeOutBounce'
        }
      }
    });
  }

  /** Initializes the salary distribution chart. */
  private initializeSalaryDistributionChart(): void {
    if (!this.salaryDistributionCanvas) return;

    const ctx = this.salaryDistributionCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.salaryDistribution.labels || [],
        datasets: [{
          label: 'Number of Students',
          data: this.salaryDistribution.values || [],
          backgroundColor: '#28a745', // Green
          borderColor: '#28a745',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        animation: {
          duration: 2000,
          easing: 'easeOutBounce'
        }
      }
    });
  }

  /** Initializes the monthly placements chart. */
  private initializeMonthlyPlacementsChart(): void {
    if (!this.monthlyPlacementsCanvas) return;

    const ctx = this.monthlyPlacementsCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.monthlyPlacements.labels || [],
        datasets: [{
          label: 'Placements',
          data: this.monthlyPlacements.values || [],
          backgroundColor: 'rgba(0, 51, 102, 0.2)', // NITJ Blue with transparency
          borderColor: '#003366',
          borderWidth: 2,
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        animation: {
          duration: 2000,
          easing: 'easeOutBounce'
        }
      }
    });
  }

  /** Initializes the branch pie chart. */
  private initializeBranchPieChart(): void {
    if (!this.branchPieChartCanvas) return;

    const ctx = this.branchPieChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.branchData.labels,
        datasets: [{
          label: 'Placement Percentage (%)',
          data: this.branchData.values,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FF6384',
            '#C9CBCF'
          ],
          borderColor: '#FFFFFF',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        animation: {
          duration: 2000,
          easing: 'easeOutBounce'
        }
      }
    });
  }

  /** Adds a new placement. */
  addPlacement(): void {
    if (!this.newPlacement.company || !this.newPlacement.students || !this.newPlacement.avgSalary || !this.newPlacement.branch) {
      alert('Please fill all fields');
      return;
    }

    this.http.post('/api/placements', this.newPlacement).subscribe({
      next: (response: any) => {
        this.companyWisePlacements.push(response.placement);
        this.newPlacement = { company: '', students: 0, avgSalary: 0, branch: '' };
        this.showAddForm = false;
        alert('Placement added successfully');
      },
      error: (error) => {
        console.error('Error adding placement:', error);
        alert('Failed to add placement');
      }
    });
  }

  /** Deletes a placement. */
  deletePlacement(placement: any): void {
    if (!confirm(`Are you sure you want to delete placement for ${placement.company}?`)) {
      return;
    }

    // For now, just remove from local array since we don't have IDs in mock data
    const index = this.companyWisePlacements.indexOf(placement);
    if (index > -1) {
      this.companyWisePlacements.splice(index, 1);
      alert('Placement deleted successfully');
    }
  }
}
