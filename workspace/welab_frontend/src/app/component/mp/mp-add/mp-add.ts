import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatpremService } from '../../../services/matiere-premiere.service';
import { MatierePremiere } from '../../../models/matiere-premiere.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mp-add',
  standalone: true,
  imports: [CommonModule, FormsModule], // Ajoute les imports nécessaires
  templateUrl: './mp-add.html',
  styleUrl: './mp-add.css',
})
export class MpAdd implements OnInit { // Implémente OnInit
  // Formulaire data
  mp: MatierePremiere = {
    // Ajout d'un id par défaut
    nomMP: '',
    INCI: '',
    NOI: '',
    categorie: '',
    fonction: '',
    cosmos: ''
  };

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private matpremService: MatpremService, // Injection correcte
    private router: Router
  ) {}

  ngOnInit(): void {
    // Pas besoin d'appeler createMp ici, c'est pour créer un nouveau
  }

  // Méthode pour créer une matière première
  createMp(): void {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.matpremService.createMp(this.mp).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = '✅ Matière première créée avec succès !';
          this.resetForm();
          // Redirection après 2 secondes
          setTimeout(() => {
            this.router.navigate(['/matpremieres']);
          }, 2000);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = '❌ Erreur lors de la création';
        this.isLoading = false;
      }
    });
  }

  // Réinitialiser le formulaire
  resetForm(): void {
    this.mp = {
      nomMP: '',
      INCI: '',
      NOI: '',
      categorie: '',
      fonction: '',
      cosmos: ''
    };
  }

  // Annuler et retourner à la liste
  cancel(): void {
    this.router.navigate(['/matpremieres']);
  }
}