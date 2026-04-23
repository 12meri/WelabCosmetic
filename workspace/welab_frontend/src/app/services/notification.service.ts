import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private messageSource = new ReplaySubject<string>(1);
  message$ = this.messageSource.asObservable();

  showMessage(message: string) {
    this.messageSource.next(message);
  }
}