import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlerteService } from '../../services/alerte-service';
import { Alerte } from '../../models/alerte';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alerte-list',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './alerte-list.html',
  styleUrl: './alerte-list.css',
})
export class AlerteList implements OnInit {
  alertes: Alerte[] = [];
  error: string | null = null;
  successMessage: string | null = null;
  showDeleteModal: boolean = false;
  alerteIdToDelete: number | null = null;

  constructor(
    private alerteService: AlerteService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAlertes();
  }

  loadAlertes(): void {
    this.alerteService.getAlertes().subscribe({
      next: (data) => {
        console.log('Alertes reçues:', data);
        this.alertes = [...data];
        this.cdr.detectChanges();
        this.error = null;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.error = 'Impossible de charger les alertes';
      }
    });
  }

  getLotId(alerte: Alerte): string {
    if (!alerte.lot) return 'N/A';

    if (typeof alerte.lot === 'string') {
      const match = alerte.lot.match(/\/lots\/(\d+)/);
      return match ? `Lot #${match[1]}` : 'N/A';
    }

    return `Lot #${alerte.lot.id}`;
  }

  openDeleteModal(id: number): void {
    this.alerteIdToDelete = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.alerteIdToDelete = null;
  }

  confirmDelete(): void {
    if (this.alerteIdToDelete) {
      this.alerteService.deleteAlerte(this.alerteIdToDelete).subscribe({
        next: (success) => {
          if (success) {
            this.alertes = this.alertes.filter(a => a.id !== this.alerteIdToDelete);
            this.successMessage = 'Alerte supprimée avec succès';
            this.error = null;

            setTimeout(() => {
              this.successMessage = null;
            }, 3000);
          }
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error('Erreur suppression:', err);
          this.error = 'Impossible de supprimer l\'alerte';
          this.closeDeleteModal();
        }
      });
    }
  }

  ignorerAlerte(id: number): void {
    this.alerteService.updateAlerte(id, { etatAlerte: 'IGNOREE' }).subscribe({
      next: (success) => {
        if (success) {
          const alerte = this.alertes.find(a => a.id === id);
          if (alerte) {
            alerte.etatAlerte = 'IGNOREE';
            this.cdr.detectChanges();
          }
        }
      },
      error: () => {
        this.error = 'Impossible d\'ignorer l\'alerte';
      }
    });
  }

  demanderEchantillon(alerte: Alerte): void {
    this.alerteService.updateAlerte(alerte.id, { etatAlerte: 'TRAITEE' }).subscribe({
      next: (success) => {
        if (success) {
          alerte.etatAlerte = 'TRAITEE';
          this.cdr.detectChanges();

          this.router.navigate(['/demande-echantillon/add'], {
            state: { alerte: alerte }
          });
        }
      },
      error: () => {
        this.error = 'Impossible de mettre à jour l\'alerte';
      }
    });
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'STOCK_BAS': return 'badge-warning';
      case 'DDM_PROCHE': return 'badge-info';
      case 'PERIME': return 'badge-danger';
      default: return '';
    }
  }
}