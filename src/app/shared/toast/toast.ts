/**
 * Toast Service
 * Shows humanized notification messages (e.g. registration failures).
 */

import { Injectable, signal } from '@angular/core';

export type ToastType = 'error' | 'success' | 'info';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly message = signal<string | null>(null);
  readonly type = signal<ToastType>('info');

  show(msg: string, type: ToastType = 'info'): void {
    this.message.set(msg);
    this.type.set(type);
    setTimeout(() => this.message.set(null), 4500);
  }

  hide(): void {
    this.message.set(null);
  }
}
