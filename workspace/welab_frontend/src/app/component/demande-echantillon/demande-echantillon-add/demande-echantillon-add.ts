import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { DemandeEchantillonService } from '../../../services/demande-echantillon.service';
import { MatpremService } from '../../../services/matiere-premiere.service';
import { DemandeEchantillon } from '../../../models/demande-echantillon.model';
import { MatierePremiere } from '../../../models/matiere-premiere.model';

@Component({
  selector: 'app-demande-echantillon-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  vientDAlerte: boolean = false;  // ← pour savoir si on vient d'une alerte

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

    // ✅ Lecture du state de navigation
    const state =  history.state;
    const alerte = state?.['alerte'];

    if (alerte) {
      console.log('Alerte reçue :', alerte);
      this.vientDAlerte = true;

      // Lier l'alerte à la demande
      if (alerte.id) {
        this.demande.alerte = `/api/alertes/${alerte.id}`;
      }

      // Cas 1 : lot est une IRI string → on appelle l'API pour récupérer le lot
      if (typeof alerte.lot === 'string') {
        this.http.get<any>('http://localhost:8011' + alerte.lot).subscribe({
          next: (lot) => {
            console.log('Lot récupéré :', lot);
            this.demande.mp = lot.mp || '';
            if (this.demande.mp) {
              this.loadFournisseursByMp(this.demande.mp);
            }
          },
          error: (error) => {
            console.error('Erreur chargement lot :', error);
          }
        });

      // Cas 2 : lot est un objet complet avec mp dedans
      } else if (alerte.lot && alerte.lot.mp) {
        this.demande.mp = alerte.lot.mp;
        if (this.demande.mp) {
          this.loadFournisseursByMp(this.demande.mp);
        }
      }

    } else {
      // Pas d'alerte → formulaire normal, tous les fournisseurs
      this.loadAllFournisseurs();
    }
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

  // Chargement de tous les fournisseurs (formulaire normal)
  loadAllFournisseurs(): void {
    this.http.get<any>('http://localhost:8011/api/fournisseurs').subscribe({
      next: (data) => {
        this.fournisseurs = data.member || data['hydra:member'] || [];
      },
      error: (error) => {
        console.error('Erreur chargement fournisseurs :', error);
      }
    });
  }

  // Chargement des fournisseurs filtrés par MP
  loadFournisseursByMp(mpIri: string): void {
    this.demande.fournisseur = '';
    this.fournisseurs = [];

    this.http.get<any>('http://localhost:8011/api/fournirs').subscribe({
      next: (data) => {
        const fournirs = data.member || data['hydra:member'] || [];

        const fournisseurIris = fournirs
          .filter((f: any) => f.matPrem === mpIri)
          .map((f: any) => f.fournisseur);

        this.http.get<any>('http://localhost:8011/api/fournisseurs').subscribe({
          next: (data) => {
            const allFournisseurs = data.member || data['hydra:member'] || [];
            this.fournisseurs = allFournisseurs.filter((f: any) =>
              fournisseurIris.includes(`/api/fournisseurs/${f.id}`)
            );
            console.log('Fournisseurs filtrés :', this.fournisseurs);
          },
          error: (error) => {
            console.error('Erreur chargement fournisseurs :', error);
          }
        });
      },
      error: (error) => {
        console.error('Erreur chargement fournirs :', error);
      }
    });
  }

  // Nom de la MP depuis son IRI (pour affichage texte)
  getMpNom(mpIri: string): string {
    const mp = this.matieresPremieres.find(m => `/api/mat_premieres/${m.id}` === mpIri);
    return mp ? mp.nomMP : mpIri;
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