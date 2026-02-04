/**
 * Toast Component
 * Renders a floating humanized notification message.
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (toast.message(); as msg) {
      <div
        class="toast toast--{{ toast.type() }}"
        role="alert"
      >
        {{ msg }}
      </div>
    }
  `,
  styles: [`
    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      padding: 14px 24px;
      border-radius: 8px;
      font-size: 0.95rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      z-index: 9999;
      max-width: 90vw;
    }
    .toast--error {
      background: #FEF2F2;
      color: #B91C1C;
      border: 1px solid #FECACA;
    }
    .toast--success {
      background: #F0FDF4;
      color: #166534;
      border: 1px solid #BBF7D0;
    }
    .toast {
      animation: toast-fade-in 0.3s ease;
    }
    @keyframes toast-fade-in {
      from { opacity: 0; transform: translateX(-50%) translateY(12px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `],
})
export class ToastComponent {
  readonly toast = inject(ToastService);
}
