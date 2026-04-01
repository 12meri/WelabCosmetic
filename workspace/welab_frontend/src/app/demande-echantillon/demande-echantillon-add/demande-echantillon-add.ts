import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { DemandeEchantillonService } from '../../services/demande-echantillon.service';
import { MatpremService } from '../../services/matiere-premiere.service';
import { DemandeEchantillon } from '../../models/demande-echantillon.model';
import { MatierePremiere } from '../../models/matiere-premiere.model';

@Component({
  selector: 'app-demande-echantillon-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './demande-echantillon-add.html',
  styleUrls: ['./demande-echantillon-add.css'],
})
export class DemandeEchantillonAdd implements OnInit {

  demande: DemandeEchantillon = {
    dateDemande: '',
    delaiLivraison: '',
    etat: 'EN_COURS',
    fournisseur: '',
    mp: '',
    alerte: ''
  };

  matieresPremieres: MatierePremiere[] = [];
  fournisseurs: any[] = [];

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private demandeService: DemandeEchantillonService,
    private mpService: MatpremService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMatieresPremieres();
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

  loadFournisseursByMp(mpIri: string): void {
  this.http.get<any>('http://localhost:8011/api/fournirs').subscribe({
    next: (data) => {
      const fournirs = data.member || data['hydra:member'] || [];

      const fournisseurIris = fournirs
        .filter((f: any) => f.matPrem === mpIri)
        .map((f: any) => f.fournisseur);

      // charger les vrais fournisseurs
      this.http.get<any>('http://localhost:8011/api/fournisseurs').subscribe({
        next: (data) => {
          const allFournisseurs = data.member || data['hydra:member'] || [];

          this.fournisseurs = allFournisseurs.filter((f: any) =>
            fournisseurIris.includes(`/api/fournisseurs/${f.id}`)
          );
        }
      });
    }
  });
}

  getMpIri(mp: MatierePremiere): string {
    return `/api/mat_premieres/${mp.id}`;
  }

  getFournisseurIri(fournisseur: any): string {
    return `/api/fournisseurs/${fournisseur.id}`;
  }

  createDemande(): void {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    console.log('Demande envoyée :', this.demande);

    this.demandeService.createDemande(this.demande).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = '✅ Demande créée avec succès';
          setTimeout(() => {
            this.router.navigate(['/demande-echantillon']);
          }, 1500);
        } else {
          this.errorMessage = '❌ Création échouée';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur création demande :', error);
        console.error('Body :', error.error);

        this.errorMessage =
          error?.error?.detail ||
          error?.error?.message ||
          '❌ Erreur lors de la création';

        this.isLoading = false;
      }
    });
  }
  

  cancel(): void {
    this.router.navigate(['/demande-echantillon']);
  }
}