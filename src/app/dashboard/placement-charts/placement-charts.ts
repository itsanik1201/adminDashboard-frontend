/**
 * Placement Charts Component
 * Renders Chart.js bar charts with smooth easing on scroll-into-view.
 * Uses Intersection Observer to trigger animation when charts enter viewport.
 */

/* External Libraries */
import { Component, ElementRef, Input, AfterViewInit, OnDestroy } from '@angular/core';
import Chart from 'chart.js/auto';

export interface ChartDataSet {
  labels: string[];
  values: number[];
}

const DEFAULT_TREND: ChartDataSet = { labels: ['2020', '2021', '2022', '2023', '2024'], values: [78, 82, 86, 90, 93] };
const DEFAULT_BRANCH: ChartDataSet = { labels: ['CSE', 'ECE', 'EE', 'ME', 'CE', 'PIE'], values: [98, 95, 92, 88, 85, 90] };

@Component({
  selector: 'app-placement-charts',
  standalone: true,
  templateUrl: './placement-charts.html',
  styleUrls: ['./placement-charts.css']
})
export class PlacementChartsComponent implements AfterViewInit, OnDestroy {
  @Input() trendData: ChartDataSet = DEFAULT_TREND;
  @Input() branchData: ChartDataSet = DEFAULT_BRANCH;

  private trendChart: Chart | null = null;
  private branchChart: Chart | null = null;
  private observer: IntersectionObserver | null = null;

  constructor(private hostRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.setupScrollObserver();
  }

  ngOnDestroy(): void {
    this.trendChart?.destroy();
    this.branchChart?.destroy();
    this.observer?.disconnect();
  }

  private setupScrollObserver(): void {
    this.observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            if (target.id === 'trendChartContainer') {
              this.renderTrendChart();
            } else if (target.id === 'branchChartContainer') {
              this.renderBranchChart();
            }
          }
        }
      },
      { threshold: 0.2 }
    );

    const trendEl = this.hostRef.nativeElement.querySelector('#trendChartContainer');
    const branchEl = this.hostRef.nativeElement.querySelector('#branchChartContainer');
    if (trendEl) this.observer.observe(trendEl);
    if (branchEl) this.observer.observe(branchEl);
  }

  /**
   * Renders the year-over-year placement trend chart.
   * Developer note: Placement % = (Students Placed / Total Eligible) × 100.
   * We filter out students with backlogs to match the placement criteria.
   */
  private renderTrendChart(): void {
    if (this.trendChart) return;

    const canvas = this.hostRef.nativeElement.querySelector('#trendChart') as HTMLCanvasElement;
    if (!canvas) return;

    const labels = this.trendData?.labels ?? DEFAULT_TREND.labels;
    const values = this.trendData?.values ?? DEFAULT_TREND.values;

    this.trendChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Placement %',
            data: values,
            backgroundColor: 'rgba(62, 92, 118, 0.8)'
          }
        ]
      },
      options: {
        responsive: true,
        animation: {
          duration: 900,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            ticks: { color: 'var(--color-text-muted)' },
            grid: { color: 'var(--color-border)' }
          },
          y: {
            ticks: { color: 'var(--color-text-muted)' },
            grid: { color: 'var(--color-border)' }
          }
        }
      }
    });
  }

  /**
   * Renders branch-wise placement percentage chart.
   * Developer note: Each branch's % = (Placed in branch / Eligible in branch) × 100.
   */
  private renderBranchChart(): void {
    if (this.branchChart) return;

    const canvas = this.hostRef.nativeElement.querySelector('#branchChart') as HTMLCanvasElement;
    if (!canvas) return;

    const labels = this.branchData?.labels ?? DEFAULT_BRANCH.labels;
    const values = this.branchData?.values ?? DEFAULT_BRANCH.values;

    this.branchChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Placed (%)',
            data: values,
            backgroundColor: 'rgba(45, 106, 79, 0.8)'
          }
        ]
      },
      options: {
        responsive: true,
        animation: {
          duration: 900,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            ticks: { color: 'var(--color-text-muted)' },
            grid: { color: 'var(--color-border)' }
          },
          y: {
            ticks: { color: 'var(--color-text-muted)' },
            grid: { color: 'var(--color-border)' }
          }
        }
      }
    });
  }
}
