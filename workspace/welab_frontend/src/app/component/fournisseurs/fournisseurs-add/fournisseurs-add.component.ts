import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FournisseurService } from '../../../services/fournisseur.service';
import { Fournisseur } from '../../../models/fournisseur.model';

@Component({
  selector: 'app-fournisseurs-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fournisseurs-add.component.html',
  styleUrl: './fournisseurs-add.component.css',
})
export class FournisseursAdd {

  fournisseur: Fournisseur = {
    nomEntr: '',
    adresse: '',
    emailGen: '',
    telFourni: ''
  };

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fournisseurService: FournisseurService,
    private router: Router
  ) {}

  create(): void {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.fournisseurService.create(this.fournisseur).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = ' Fournisseur créé avec succès !';
          this.resetForm();
          setTimeout(() => {
            this.router.navigate(['/fournisseurs']);
          }, 2000);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = ' Erreur lors de la création';
        this.isLoading = false;
      }
    });
  }

  resetForm(): void {
    this.fournisseur = { nomEntr: '', adresse: '', emailGen: '', telFourni: '' };
  }

  cancel(): void {
    this.router.navigate(['/fournisseurs']);
  }
}
