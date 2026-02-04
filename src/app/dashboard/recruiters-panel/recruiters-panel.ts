/**
 * Recruiters Panel Component
 * Displays prominent recruiter names with staggered entrance.
 */

/* External Libraries */
import { Component, Input, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-recruiters-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recruiters-panel.html',
  styleUrls: ['./recruiters-panel.css']
})
export class RecruitersPanelComponent implements AfterViewInit {
  @Input() recruiters: string[] = [];

  constructor(private hostRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.animateEntrance();
  }

  private animateEntrance(): void {
    const items = this.hostRef.nativeElement.querySelectorAll('.recruiters-panel__item');
    gsap.fromTo(
      items,
      { opacity: 0, x: 16 },
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.05
      }
    );
  }
}
