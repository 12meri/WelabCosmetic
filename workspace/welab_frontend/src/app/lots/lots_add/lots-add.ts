import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LotService } from '../../services/lots.service';
import { Lot } from '../../models/lots.model';

@Component({
  selector: 'app-lot-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lots-add.html',
  styleUrl: './lots-add.css',
})
export class LotAdd {

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

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private lotService: LotService,
    private router: Router
  ) {}

  createLot(): void {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.lotService.createLot(this.lot).subscribe({
      next: (success) => {
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
        this.errorMessage = '❌ Erreur lors de l’ajout';
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/lots']);
  }
}