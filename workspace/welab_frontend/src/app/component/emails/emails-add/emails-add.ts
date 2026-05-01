import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { EmailService } from '../../../services/email.service';
import { Email } from '../../../models/email.model';
import { DemandeEchantillonService } from '../../../services/demande-echantillon.service';
import { MatpremService } from '../../../services/matiere-premiere.service';

@Component({
  selector: 'app-emails-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './emails-add.html',
  styleUrl: './emails-add.css',
})
export class EmailsAdd implements OnInit {

  // Objet "modèle" du formulaire. Lié au DOM via [(ngModel)] (two-way
  // binding) : modifier le champ dans l'UI met à jour cette propriété,
  // et inversement.
  email: Email = {
    sujet: '',
    txt: '',
    demandeEchantillon: '',
  };

  // Listes locales utilisées pour afficher des libellés humains dans
  // le <select> des demandes (au lieu d'afficher juste les IRIs).
  demandes: any[] = [];
  fournisseurs: any[] = [];
  matieresPremieres: any[] = [];

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private emailService: EmailService,
    private demandeService: DemandeEchantillonService,
    private mpService: MatpremService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // On charge les demandes (pour remplir le dropdown) ainsi que
    // les fournisseurs et matières premières pour pouvoir afficher
    // un libellé lisible "Demande #X - Fournisseur - MP".
    this.loadDemandes();
    this.loadFournisseurs();
    this.loadMatieresPremieres();
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
   * Format : "Demande #ID - <fournisseur> - <matière>".
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
   * Méthode appelée lors de la soumission du formulaire (`(ngSubmit)`).
   * Elle envoie l'email au serveur via le service. Si succès :
   * affiche un message puis redirige vers /emails après 2 s.
   */
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
      },
      error: (error) => {
        console.error('Erreur :', error);
        this.errorMessage = '❌ Erreur lors de l\'envoi';
        this.isLoading = false;
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
