import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LotService } from '../../../services/lots.service';
import { MatpremService } from '../../../services/matiere-premiere.service';
import { Lot } from '../../../models/lots.model';
import { MatierePremiere } from '../../../models/matiere-premiere.model';

@Component({
  selector: 'app-lot-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lots-edit.html',
  styleUrls: ['./lots-edit.css'],
})
export class LotEdit implements OnInit {

  lot: Lot = {
    numLot: '',
    dateArrivee: '',
    ddm: '',
    qtInitiale: '',
    qtRestante: '',
    dateMaj: '',
    qtMin: '',
    etat: 'OK',
    mp: ''
  };

  matieresPremieres: MatierePremiere[] = [];

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lotService: LotService,
    private mpService: MatpremService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadLot(+id);
    }

    this.loadMatieresPremieres();
  }

  loadLot(id: number): void {
    this.lotService.getLotById(id).subscribe({
      next: (data) => {
        this.lot = data;
      },
      error: (error) => {
        console.error('Erreur chargement lot :', error);
        this.errorMessage = '❌ Erreur chargement lot';
      }
    });
  }

  loadMatieresPremieres(): void {
    this.mpService.mplist().subscribe({
      next: (data) => {
        this.matieresPremieres = data;
      },
      error: (error) => {
        console.error('Erreur chargement MP :', error);
      }
    });
  }

  getMpIri(mp: MatierePremiere): string {
    return `/api/mat_premieres/${mp.id}`;
  }

  updateLot(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = '❌ ID du lot introuvable';
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    console.log('Lot à modifier :', this.lot);

    this.lotService.updateLot(+id, this.lot).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = '✅ Lot modifié avec succès';
          setTimeout(() => {
            this.router.navigate(['/lots']);
          }, 1500);
        } else {
          this.errorMessage = '❌ Modification échouée';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur modification lot :', error);
        this.errorMessage =
          error?.error?.detail ||
          error?.error?.message ||
          '❌ Erreur lors de la modification';
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/lots']);
  }
}