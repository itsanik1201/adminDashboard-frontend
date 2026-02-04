/**
 * Global Search Component (Spotlight-style)
 * Cmd+K interface for quick navigation and search.
 */

/* External Libraries */
import { Component, output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './global-search.html',
  styleUrls: ['./global-search.css']
})
export class GlobalSearchComponent {
  isOpen = false;
  searchQuery = '';
  selectedIndex = 0;

  // Emit when user selects an item (for future extensibility)
  searchSelect = output<string>();

  private readonly results = [
    { label: 'Dashboard', route: '/dashboard', icon: '📊' },
    { label: 'Placement Trend', route: '/dashboard', icon: '📈' },
    { label: 'Branch-wise Stats', route: '/dashboard', icon: '🏛️' },
    { label: 'Companies', route: '/dashboard', icon: '🏢' }
  ];

  openModal(): void {
    this.isOpen = true;
    this.searchQuery = '';
    this.selectedIndex = 0;
    // Focus input after modal renders
    setTimeout(() => this.focusInput(), 50);
  }

  closeModal(): void {
    this.isOpen = false;
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      this.isOpen ? this.closeModal() : this.openModal();
    }
    if (event.key === 'Escape') {
      this.closeModal();
    }
  }

  private focusInput(): void {
    const input = document.querySelector('.global-search__input') as HTMLInputElement;
    input?.focus();
  }

  getFilteredResults(): typeof this.results {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return this.results;
    return this.results.filter(r => r.label.toLowerCase().includes(query));
  }

  onSelectItem(item: (typeof this.results)[0]): void {
    this.searchSelect.emit(item.route);
    this.closeModal();
    window.location.href = item.route;
  }
}
