import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatpremService } from '../../../services/matiere-premiere.service';
import { NotificationService } from '../../../services/notification.service';
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
    //categorie: '', sera determiner automatiquement
    fonction: '',
    cosmos: ''
  };

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private matpremService: MatpremService, // Injection correcte
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Pas besoin d'appeler createMp ici, c'est pour créer un nouveau
  }

  
 // Appelle la méthode publique du service – pas de redondance
  getCategorieFromNom(): string {
    return this.matpremService.getCategorieFromNom(this.mp.nomMP);
  }

  // Méthode pour créer une matière première
  createMp(): void {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.matpremService.createMp(this.mp).subscribe({
      next: (success) => {
        if (success) {
          this.notificationService.showMessage('Matière première créée avec succès !');
          this.router.navigate(['/matpremieres']);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = 'Erreur lors de la création';
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