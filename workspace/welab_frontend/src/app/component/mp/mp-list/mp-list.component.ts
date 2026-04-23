import { Component,  OnInit,    ChangeDetectorRef} from '@angular/core';
import { Observable } from 'rxjs';
import { MatpremService } from '../../../services/matiere-premiere.service';
import { NotificationService } from '../../../services/notification.service';
import { MatierePremiere } from '../../../models/matiere-premiere.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-mp-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink, CommonModule],
  templateUrl: './mp-list.component.html',
  styleUrl: './mp-list.component.css',
})
export class MpList implements OnInit { // 

  mp$!: Observable<Array<MatierePremiere>>;
  showDeleteModal = false;
  selectedMpId: number | null = null;
  successMessage = ''; // pourrai etre un signal de reussite ou un message de notification 
  errorMessage = '';

  constructor(
    private mpservice: MatpremService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}


  /**
   * Charge la liste des matières premières et s'abonne aux notifications pour afficher les messages de succès.
   * this.cdr.markForCheck() est utilisé pour forcer la détection des changements après la mise à jour des messages, car ils sont mis à jour de manière asynchrone setTimeout s’exécute en dehors de la zone Angular (zone.js).
   * une autre maniere est detectChanges() qui detecte les changements immédiatement sans attendre la fin de la pile d’exécution, mais markForCheck() est plus adapté ici pour éviter des détections redondantes.
   */
  ngOnInit(): void {
    this.mp$ = this.mpservice.mplist();
    this.notificationService.message$.subscribe(msg => {
      this.successMessage = msg;
      setTimeout(() => {this.successMessage = '',this.cdr.markForCheck()}, 3000); // efface après 3s et force la détection
      
    });
  }

  trackById(index: number, item: MatierePremiere) {
    return item.id;
  }

  openDeleteModal(id: number): void {
    this.selectedMpId = id;
    this.showDeleteModal = true;
    this.cdr.markForCheck();
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedMpId = null;
    this.cdr.markForCheck();
  }

  confirmDelete(): void {
    if (this.selectedMpId === null) return;

    this.successMessage = '';
    this.errorMessage = '';

    this.mpservice.deleteMp(this.selectedMpId).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = ' Matière première supprimée avec succès';
          this.mp$ = this.mpservice.mplist();
        } else {
          this.errorMessage = ' La suppression a échoué';
        }

        this.closeDeleteModal();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erreur suppression :', error);
        this.errorMessage = ' Erreur lors de la suppression';
        this.closeDeleteModal();
        this.cdr.markForCheck();
      }
    });
  }
}
