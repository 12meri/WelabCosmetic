import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import { DemandeEchantillonService } from '../../../services/demande-echantillon.service';
import { AlerteService } from '../../../services/alerte.service';
import { MatpremService } from '../../../services/matiere-premiere.service';
import { DemandeEchantillon } from '../../../models/demande-echantillon.model';
import { MatierePremiere } from '../../../models/matiere-premiere.model';

@Component({
  selector: 'app-demande-echantillon-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './demande-echantillon-add.component.html',
  styleUrls: ['./demande-echantillon-add.component.css'],
})
export class DemandeEchantillonAdd implements OnInit {
  // Modèle du formulaire. Contient les champs texte et les références au fournisseur, à la matière première et à l'alerte éventuelle.
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
  vientDAlerte = false;
  alerteObjet: any = null;

  isLoading = false;
  isLoadingFournisseurs = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private demandeService: DemandeEchantillonService,
    private alerteService: AlerteService,
    private mpService: MatpremService,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef   // ← injection
  ) {}

  /**
   * Logique d'initialisation : si on arrive depuis une alerte, pré-remplir le formulaire avec les données de l'alerte (matière première + fournisseur) et verrouiller ces champs. Sinon, charger la liste complète des matières premières et des fournisseurs.
   * La méthode loadMatieresPremieres() retourne une Promise pour s'assurer que les matières premières sont chargées avant de tenter de pré-remplir le champ matière première à partir de l'alerte.
   * La méthode loadFournisseursByMp() est appelée si on a pu pré-remplir la matière première, pour charger uniquement les fournisseurs associés à cette matière première, ce qui permet de pré-remplir et verrouiller le champ fournisseur également.
   * Si on n'arrive pas depuis une alerte, on charge simplement tous les fournisseurs pour permettre à l'utilisateur de faire son choix librement.
   */
  ngOnInit(): void {
    const state = history.state;
    const alerte = state?.['alerte'];

    if (alerte) {
      this.vientDAlerte = true;
      this.alerteObjet = alerte;
      if (alerte.id) this.demande.alerte = `/api/alertes/${alerte.id}`;
      this.loadMatieresPremieres().then(() => {
        if (typeof alerte.lot === 'string') {
          this.http.get<any>('http://localhost:8011' + alerte.lot).subscribe({
            next: (lot) => {
              this.demande.mp = lot.mp || '';
              if (this.demande.mp) this.loadFournisseursByMp(this.demande.mp);
            },
            error: (err) => console.error(err)
          });
        } else if (alerte.lot?.mp) {
          this.demande.mp = alerte.lot.mp;
          if (this.demande.mp) this.loadFournisseursByMp(this.demande.mp);
        }
      });
    } else {
      this.loadMatieresPremieres();
      this.loadAllFournisseurs();
    }
  }

  loadMatieresPremieres(): Promise<void> {
    return new Promise((resolve) => {
      this.mpService.mplist().subscribe({
        next: (data) => { this.matieresPremieres = data; resolve(); },
        error: (err) => { console.error(err); resolve(); }
      });
    });
  }

  loadAllFournisseurs(): void {
    this.isLoadingFournisseurs = true;
    this.http.get<any>('http://localhost:8011/api/fournisseurs').subscribe({
      next: (data) => {
        this.fournisseurs = data.member || data['hydra:member'] || [];
        this.isLoadingFournisseurs = false;
        this.cdr.detectChanges();   // ← force l'affichage immédiat
      },
      error: (err) => {
        console.error(err);
        this.isLoadingFournisseurs = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadFournisseursByMp(mpIri: string): void {
    this.isLoadingFournisseurs = true;
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
            const all = data.member || data['hydra:member'] || [];
            this.fournisseurs = all.filter((f: any) =>
              fournisseurIris.includes(`/api/fournisseurs/${f.id}`)
            );
            this.isLoadingFournisseurs = false;
            this.cdr.detectChanges();   // ← force l'affichage immédiat
          },
          error: (err) => {
            console.error(err);
            this.isLoadingFournisseurs = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.isLoadingFournisseurs = false;
        this.cdr.detectChanges();
      }
    });
  }

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

    this.demandeService.createDemande(this.demande).subscribe({
      next: (success) => {
        if (success) {
          if (this.alerteObjet?.id) {
            this.alerteService.updateAlerte(this.alerteObjet.id, { etatAlerte: 'TRAITEE' }).subscribe({
              next: () => console.log('Alerte marquée traitée'),
              error: (err) => console.error('Erreur mise à jour alerte', err)
            });
          }
          this.successMessage = ' Demande créée avec succès';
          setTimeout(() => this.router.navigate(['/demande-echantillon']), 1500);
        } else {
          this.errorMessage = ' Création échouée';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = error?.error?.detail || error?.error?.message || '❌ Erreur lors de la création';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/demande-echantillon']);
  }
}