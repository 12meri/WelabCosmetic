import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { EmailService } from '../../../services/email.service';
import { Email } from '../../../models/email.model';
import { DemandeEchantillonService } from '../../../services/demande-echantillon.service';
import { MatpremService } from '../../../services/matiere-premiere.service';

@Component({
  selector: 'app-emails-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './emails-edit.html',
  styleUrl: './emails-edit.css',
})
export class EmailsEdit implements OnInit {

  // Modèle du formulaire (lié au DOM via [(ngModel)]).
  email: Email = {
    sujet: '',
    txt: '',
    demandeEchantillon: '',
  };

  // Listes auxiliaires pour le <select> et l'affichage des libellés.
  demandes: any[] = [];
  fournisseurs: any[] = [];
  matieresPremieres: any[] = [];

  id!: number;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private emailService: EmailService,
    private demandeService: DemandeEchantillonService,
    private mpService: MatpremService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Au chargement : on récupère l'id de l'email depuis la route
   * (paramètre :id), puis on charge à la fois l'email à modifier
   * et les listes nécessaires au formulaire.
   */
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.load();
    } else {
      this.errorMessage = '❌ ID introuvable';
    }
    this.loadDemandes();
    this.loadFournisseurs();
    this.loadMatieresPremieres();
  }

  // Récupère l'email courant et pré-remplit le formulaire.
  load(): void {
    this.isLoading = true;
    this.emailService.getById(this.id).subscribe({
      next: (data) => {
        this.email = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erreur chargement :', error);
        this.errorMessage = '❌ Erreur lors du chargement';
        this.isLoading = false;
      },
    });
  }

  loadDemandes(): void {
    this.demandeService.demandeList().subscribe({
      next: (data) => (this.demandes = data),
      error: (err) => console.error('Erreur chargement demandes :', err),
    });
  }

  loadFournisseurs(): void {
    this.http.get<any>('http://localhost:8011/api/fournisseurs').subscribe({
      next: (data) => (this.fournisseurs = data.member || data['hydra:member'] || []),
      error: (err) => console.error('Erreur chargement fournisseurs :', err),
    });
  }

  loadMatieresPremieres(): void {
    this.mpService.mplist().subscribe({
      next: (data) => (this.matieresPremieres = data),
      error: (err) => console.error('Erreur chargement matières :', err),
    });
  }

  /**
   * Construit le libellé d'une demande pour le <select>.
   */
  demandeLabel(demande: any): string {
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

  /**
   * Soumission du formulaire : envoie un PATCH au serveur via le service.
   * Si succès : message + redirection vers /emails après 2 s.
   */
  update(): void {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.emailService.update(this.id, this.email).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = '✅ Email modifié avec succès !';
          setTimeout(() => {
            this.router.navigate(['/emails']);
          }, 2000);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur modification :', error);
        this.errorMessage = '❌ Erreur lors de la modification';
        this.isLoading = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/emails']);
  }
}
