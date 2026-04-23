import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LotService } from '../../../services/lots.service';
import { MatpremService } from '../../../services/matiere-premiere.service';
import { Lot } from '../../../models/lots.model';
import { MatierePremiere } from '../../../models/matiere-premiere.model';

@Component({
  selector: 'app-lots',
  standalone: true,
  imports: [AsyncPipe, CommonModule, RouterLink, DatePipe],
  templateUrl: './lots-list.component.html',
  styleUrl: './lots-list.component.css',
})
export class LotsComponent implements OnInit {

  lots$!: Observable<Array<Lot>>;
  matieresPremieres: MatierePremiere[] = []; // pour stocker les matières premières et les utiliser dans getMpName

  showDeleteModal = false;
  selectedLotId: number | null = null; // pour stocker l'ID du lot sélectionné pour suppression
  successMessage = '';
  errorMessage = '';

  constructor(
    private lotService: LotService,
    private mpservice: MatpremService,
    private cdr: ChangeDetectorRef, // pour forcer la détection après chargement des matières premières
  ) {

  }

  ngOnInit(): void {
    this.loadLots();
    this.loadMatieresPremieres();
  }

  loadLots(): void {
    this.lots$ = this.lotService.lotList();
  }

  /**
   * Charge les matières premières pour pouvoir afficher leur nom dans la liste des lots.
   * On stocke tout en local pour éviter de faire un appel à chaque fois dans getMpName, ce qui serait très coûteux en performance.
   */

  loadMatieresPremieres(): void {
    this.mpservice.mplist().subscribe({
      next: (data) => {
        this.matieresPremieres = data; // stocke les matières premières localement
         this.cdr.markForCheck(); // force la détection après chargement des matières premières
        console.log('Matières premières chargées :', data);
      },
      error: (error) => {
        console.error('Erreur chargement matières premières :', error);
      }
    });
  }


  /**
   * 
   * @param mpIri // selectionner id a partir du IRI de la mp
   * @returns 
   */
  getMpName(mpIri: string | undefined): string {
    if (!mpIri) {
      return '';
    }

    const id = mpIri.split('/').pop(); // extrait l'ID de l'IRI (ex: /api/matieres-premieres/5 => 5)
    const mp = this.matieresPremieres.find(m => String(m.id) === id);

    return mp ? mp.nomMP : mpIri;
  }


  openDeleteModal(id: number): void {
    this.selectedLotId = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedLotId = null;
  }

  confirmDelete(): void {
    if (this.selectedLotId === null) {
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';

    this.lotService.deleteLot(this.selectedLotId).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = ' Lot supprimé avec succès';
          this.loadLots();
        } else {
          this.errorMessage = ' La suppression a échoué';
        }

        this.closeDeleteModal();
      },
      error: (error) => {
        console.error('Erreur suppression lot :', error);
        this.errorMessage =
          error?.error?.detail ||
          error?.error?.message ||
          ' Erreur lors de la suppression';

        this.closeDeleteModal();
      }
    });
  }
}