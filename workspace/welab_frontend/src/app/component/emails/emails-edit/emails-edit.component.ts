import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';   // ← ajouter

import { EmailService } from '../../../services/email.service';
import { Email } from '../../../models/email.model';
import { DemandeEchantillonService } from '../../../services/demande-echantillon.service';
import { MatpremService } from '../../../services/matiere-premiere.service';

@Component({
  selector: 'app-emails-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './emails-edit.component.html',
  styleUrl: './emails-edit.component.css',
})
export class EmailsEdit implements OnInit {
  /**
   * Ce composant est responsable de l'affichage du formulaire de modification d'un email existant, ainsi que de la gestion de la logique de chargement des données nécessaires (email à modifier, listes de demandes, fournisseurs et matières premières pour les libellés), et de la soumission du formulaire pour mettre à jour l'email dans le backend.
   * La méthode ngOnInit() utilise forkJoin pour charger en parallèle toutes les données nécessaires (email, demandes, fournisseurs, matières premières) et les assigner aux propriétés du composant une fois que tout est disponible, ce qui permet d'éviter les problèmes de chargement asynchrone et d'afficher le formulaire complet dès que possible.
   * La méthode buildDemandeLabel() est utilisée pour construire un libellé lisible pour la demande associée à l'email, en résolvant les IRIs retournées par l'API Platform en noms de fournisseurs et de matières premières.
   * La méthode update() prépare les données modifiées et appelle le service EmailService pour mettre à jour l'email dans le backend, en gérant les états de chargement et les messages de succès ou d'erreur.
   * La méthode cancel() navigue simplement vers la liste des emails sans enregistrer les modifications.
   */

  email: Email = {
    sujet: '',
    txt: '',
    demandeEchantillon: '',
  };

  demandes: any[] = [];
  fournisseurs: any[] = [];
  matieresPremieres: any[] = [];

  id!: number;
  isLoading = false;
  isLoadingData = true;          // ← indicateur de chargement global
  successMessage = '';
  errorMessage = '';

  // Pour l’affichage texte de la demande
  demandeLabel: string = '';

  constructor(
    private emailService: EmailService,
    private demandeService: DemandeEchantillonService,
    private mpService: MatpremService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.loadAll();
    } else {
      this.errorMessage = '❌ ID introuvable';
      this.isLoadingData = false;
    }
  }

  loadAll(): void {
    this.isLoadingData = true;
    forkJoin({
      email: this.emailService.getById(this.id),
      demandes: this.demandeService.demandeList(),
      fournisseurs: this.http.get<any>('http://localhost:8011/api/fournisseurs'),
      matieres: this.mpService.mplist()
    }).subscribe({
      next: (data) => {
        this.email = data.email;
        this.demandes = data.demandes;
        this.fournisseurs = data.fournisseurs.member || data.fournisseurs['hydra:member'] || [];
        this.matieresPremieres = data.matieres;

        // Construire le libellé de la demande associée
        if (this.email.demandeEchantillon) {
          const demandeIri = this.email.demandeEchantillon;
          const demandeId = parseInt(demandeIri.split('/').pop() || '0', 10);
          const found = this.demandes.find(d => d.id === demandeId);
          if (found) {
            this.demandeLabel = this.buildDemandeLabel(found);
          } else {
            this.demandeLabel = demandeIri;
          }
        }

        this.isLoadingData = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement :', err);
        this.errorMessage = '❌ Erreur lors du chargement des données';
        this.isLoadingData = false;
        this.cdr.markForCheck();
      }
    });
  }

  /**
   * Construit un libellé lisible à partir d’une demande.
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

  update(): void {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    // On n’envoie que le sujet et le message ; la demandeEchantillon reste inchangée
    const payload = {
      sujet: this.email.sujet,
      txt: this.email.txt
    };

    this.emailService.update(this.id, payload as any).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = '✅ Email modifié avec succès !';
          setTimeout(() => {
            this.router.navigate(['/emails']);
          }, 2000);
        } else {
          this.errorMessage = '❌ La modification a échoué';
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erreur modification :', error);
        this.errorMessage = '❌ Erreur lors de la modification';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/emails']);
  }
}