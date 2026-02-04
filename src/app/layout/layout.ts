 /**
 * Layout Component
 * Glassmorphism sidebar with role-based navigation.
 * Admin (TPC, Dept Head) sees extra options; Student sees a simpler nav.
 */

/* External Libraries */
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { gsap } from 'gsap';
import { isPlatformBrowser } from '@angular/common';

/* Internal Services */
import { AuthService } from '../auth/auth.service';

/* Internal Components */
import { GlobalSearchComponent } from '../shared/global-search/global-search';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, GlobalSearchComponent],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class LayoutComponent implements OnInit {
  constructor(public auth: AuthService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Humanized animation: Sidebar slides in with subtle bounce (spring physics)
      gsap.from('.layout__sidebar', {
        x: -300,
        duration: 1,
        ease: 'back.out(1.7)'
      });
    }
  }

  handleLogout(): void {
    this.auth.clearSession();
    window.location.href = '/login';
  }
}
