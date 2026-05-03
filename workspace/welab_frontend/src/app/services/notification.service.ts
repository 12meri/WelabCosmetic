import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private messageSource = new ReplaySubject<string>(1);
  message$ = this.messageSource.asObservable();

  // permet d'afficher un message de notification en émettant une nouvelle valeur dans le ReplaySubject. Les composants abonnés à message$ recevront cette valeur et pourront l'afficher à l'utilisateur.
  showMessage(message: string) {
    this.messageSource.next(message);
  }
}