import { Component, Input, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

export interface KpiMetric {
  value: string;
  label: string;
  isHighlight?: boolean;
}

@Component({
  selector: 'app-kpi-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-cards.html',
  styleUrls: ['./kpi-cards.css']
})
export class KpiCardsComponent implements AfterViewInit {
  @Input() metrics: KpiMetric[] = [];

  constructor(private hostRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.animateEntrance();
  }

  private animateEntrance(): void {
    const cards = this.hostRef.nativeElement.querySelectorAll('.kpi-cards__card');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.1
      }
    );
  }
}
