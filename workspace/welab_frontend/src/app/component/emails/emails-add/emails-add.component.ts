import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';  // ← ajouter

import { EmailService } from '../../../services/email.service';
import { Email } from '../../../models/email.model';
import { DemandeEchantillonService } from '../../../services/demande-echantillon.service';
import { MatpremService } from '../../../services/matiere-premiere.service';

@Component({
  selector: 'app-emails-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './emails-add.component.html',
  styleUrl: './emails-add.component.css',
})
export class EmailsAdd implements OnInit {
    /**
     * Ce composant est responsable de l'affichage du formulaire de création d'un nouvel email lié à une demande d'échantillon, ainsi que de la gestion de la logique de chargement des données nécessaires (listes de demandes, fournisseurs et matières premières pour les libellés), et de la soumission du formulaire pour créer l'email dans le backend.
     * La méthode ngOnInit() utilise forkJoin pour charger en parallèle toutes les données nécessaires (demandes, fournisseurs, matières premières) et les assigner aux propriétés du composant une fois que tout est disponible, ce qui permet d'éviter les problèmes de chargement asynchrone et d'afficher le formulaire complet dès que possible.
     * La méthode buildDemandeLabel() est utilisée pour construire un libellé lisible pour la demande associée à l'email, en résolvant les IRIs retournées par l'API Platform en noms de fournisseurs et de matières premières.
     * La méthode create() prépare les données du nouvel email et appelle le service EmailService pour créer l'email dans le backend, en gérant les états de chargement et les messages de succès ou d'erreur.
     * La méthode cancel() navigue simplement vers la liste des emails sans créer de nouvel email.
     */
    

  email: Email = {
    sujet: '',
    txt: '',
    demandeEchantillon: '',
  };

  demandes: any[] = [];
  fournisseurs: any[] = [];
  matieresPremieres: any[] = [];

  isLoading = false;
  isLoadingData = true;           // ← pour afficher un chargement global
  successMessage = '';
  errorMessage = '';

  preselectedDemandeId: number | null = null;
  preselectedDemandeLabel: string = '';

  constructor(
    private emailService: EmailService,
    private demandeService: DemandeEchantillonService,
    private mpService: MatpremService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupérer l'id de la demande depuis l'URL (au cas où)
    this.route.queryParams.subscribe(params => {
      const demandeId = params['demandeId'];
      if (demandeId) {
        this.preselectedDemandeId = Number(demandeId);
        this.email.demandeEchantillon = `/api/demande_echantillons/${demandeId}`;
      }
      // Une fois le paramètre lu, on lance le chargement groupé
      this.loadAllData();
    });
  }

  loadAllData(): void {
    this.isLoadingData = true;
    forkJoin({
      demandes: this.demandeService.demandeList(),
      fournisseurs: this.http.get<any>('http://localhost:8011/api/fournisseurs'),
      matieres: this.mpService.mplist()
    }).subscribe({
      next: (data) => {
        this.demandes = data.demandes;
        this.fournisseurs = data.fournisseurs.member || data.fournisseurs['hydra:member'] || [];
        this.matieresPremieres = data.matieres;

        // Si une demande est pré‑sélectionnée, construire son libellé maintenant que toutes les données sont chargées
        if (this.preselectedDemandeId) {
          const found = this.demandes.find(d => d.id === this.preselectedDemandeId);
          if (found) {
            this.preselectedDemandeLabel = this.buildDemandeLabel(found);
          } else {
            this.preselectedDemandeLabel = `Demande #${this.preselectedDemandeId}`;
          }
        }

        this.isLoadingData = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement données :', err);
        this.errorMessage = '❌ Impossible de charger les données';
        this.isLoadingData = false;
        this.cdr.markForCheck();
      }
    });
  }

  /**
   * Construit un libellé lisible à partir d'une demande.
   * Utilise les caches déjà remplis (fournisseurs, matières).
   */
  buildDemandeLabel(demande: any): string {
    const fournisseur = this.fournisseurs.find((f: any) =>
      f['@id'] === demande.fournisseur || `/api/fournisseurs/${f.id}` === demande.fournisseur
    );
    const mp = this.matieresPremieres.find((m: any) =>
      m['@id'] === demande.mp || `/api/mat_premieres/${m.id}` === demande.mp
    );
    const fournLabel = fournisseur ? (fournisseur.nomEntr || `Fournisseur ${fournisseur.id}`) : '?';
    const mpLabel = mp ? (mp.nomMP || `MP ${mp.id}`) : '?';
    return `Demande #${demande.id} - ${fournLabel} - ${mpLabel}`;
  }

  // Méthode utilisée dans le <select> pour afficher le libellé de chaque option
  demandeLabel(demande: any): string {
    return this.buildDemandeLabel(demande);
  }

  create(): void {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.emailService.create(this.email).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = '✅ Email envoyé avec succès !';
          this.resetForm();
          setTimeout(() => {
            this.router.navigate(['/emails']);
          }, 2000);
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erreur :', error);
        this.errorMessage = '❌ Erreur lors de l\'envoi';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  resetForm(): void {
    this.email = { sujet: '', txt: '', demandeEchantillon: '' };
  }

  cancel(): void {
    this.router.navigate(['/emails']);
  }
}