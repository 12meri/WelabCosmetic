import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LotService } from '../../services/lots.service';
import { MatpremService } from '../../services/matiere-premiere.service';
import { Lot } from '../../models/lots.model';
import { MatierePremiere } from '../../models/matiere-premiere.model';

@Component({
  selector: 'app-lots',
  standalone: true,
  imports: [AsyncPipe, CommonModule, RouterLink, DatePipe],
  templateUrl: './lots.component.html',
  styleUrl: './lots.component.css',
})
export class LotsComponent implements OnInit {

  lots$!: Observable<Array<Lot>>;
  matieresPremieres: any[] = [];

  showDeleteModal = false;
  selectedLotId: number | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(
    private lotService: LotService,
    private mpservice: MatpremService
  ) {}

  ngOnInit(): void {
    this.lots$ = this.lotService.lotList();

    this.mpservice.mplist().subscribe({
      next: (data) => {
        console.log('Matières premières reçues :', data);
        this.matieresPremieres = data;
      },
      error: (error) => {
        console.error('Erreur chargement matières premières :', error);
      }
    });
  }

  getMpName(mpIri: any): string {
    if (!mpIri) {
      return '';
    }

    const mp = this.matieresPremieres.find(m =>
      m['@id'] === mpIri ||
      `/api/mat_premieres/${m.id}` === mpIri
    );

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
          this.successMessage = '✅ Lot supprimé avec succès';
          this.lots$ = this.lotService.lotList();
        } else {
          this.errorMessage = '❌ La suppression a échoué';
        }
        this.closeDeleteModal();
      },
      error: (error) => {
        console.error('Erreur suppression lot :', error);
        this.errorMessage = '❌ Erreur lors de la suppression';
        this.closeDeleteModal();
      }
    });
  }
}