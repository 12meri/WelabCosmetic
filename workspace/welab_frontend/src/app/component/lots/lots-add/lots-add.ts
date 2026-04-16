import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LotService } from '../../../services/lots.service';
import { Lot } from '../../../models/lots.model';
import { MatpremService } from '../../../services/matiere-premiere.service';
import { MatierePremiere } from '../../../models/matiere-premiere.model';

@Component({
  selector: 'app-lot-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lots-add.html',
  styleUrls: ['./lots-add.css'],
})
export class LotAdd implements OnInit {

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
  isLoadingMp = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private lotService: LotService,
    private mpService: MatpremService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMatieresPremieres();
  }

  loadMatieresPremieres(): void {
    this.isLoadingMp = true;

    this.mpService.mplist().subscribe({
      next: (data) => {
        console.log('Matières premières reçues :', data);
        this.matieresPremieres = data;
        this.isLoadingMp = false;
      },
      error: (error) => {
        console.error('Erreur chargement MP :', error);
        this.errorMessage = '❌ Impossible de charger les matières premières';
        this.isLoadingMp = false;
      }
    });
  }

  getMpIri(mp: MatierePremiere): string {
    return `/api/mat_premieres/${mp.id}`;
  }

  createLot(): void {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    console.log('createLot lancé');
    console.log('Valeur mp choisie :', this.lot.mp);
    console.log('Données du formulaire :', this.lot);

    this.lotService.createLot(this.lot).subscribe({
      next: (success) => {
        console.log('Réponse serveur :', success);

        if (success) {
          this.successMessage = '✅ Lot ajouté avec succès';
          setTimeout(() => {
            this.router.navigate(['/lots']);
          }, 1500);
        } else {
          this.errorMessage = '❌ Ajout échoué';
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur ajout lot :', error);
        console.error('Status :', error.status);
        console.error('Body :', error.error);

        this.errorMessage =
          error?.error?.detail ||
          error?.error?.message ||
          '❌ Erreur lors de l’ajout du lot';

        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/lots']);
  }
}