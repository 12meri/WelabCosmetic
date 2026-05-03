// comptes-list.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../../../services/authenticationService';

interface Stagiaire {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  fonction: string | null;
  debutStage: string | null;
  finStage: string | null;
}

interface StagiaireForm {
  nom: string;
  prenom: string;
  email: string;
  plainPassword: string;
  fonction: string;
  debutStage: string;
  finStage: string;
}

@Component({
  selector: 'app-comptes-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comptes-list.component.html',
  styleUrl: './comptes-list.component.css'
})
export class ComptesList implements OnInit {
  /**
   * Composant de gestion des comptes stagiaires (affichage, création, suppression)
   * Utilise l'API REST pour interagir avec le backend
   * Affiche une liste de stagiaires, permet d'ajouter un nouveau stagiaire et de supprimer un stagiaire existant
  */
  private api = 'http://localhost:8011/api';

  stagiaires: Stagiaire[] = [];
  loading = true;
  successMessage = '';
  errorMessage = '';

  showAddModal = false;
  showDeleteModal = false;
  selectedStagiaire: Stagiaire | null = null;

  form: StagiaireForm = this.emptyForm();

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStagiaires();
  }

  loadStagiaires(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<any>(`${this.api}/stagiaires`, {
      headers: new HttpHeaders({ Accept: 'application/ld+json' })
    }).subscribe({
      next: (res) => {
        const members = res.member || res['hydra:member'] || [];
        this.stagiaires = members.map((item: any) => ({
          id: this.extractIdFromIri(item['@id']),
          nom: item.nom ?? '',
          prenom: item.prenom ?? '',
          email: item.email ?? '',
          fonction: item.fonction ?? null,
          debutStage: item.debutStage ?? null,
          finStage: item.finStage ?? null
        }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur GET /stagiaires :', err);
        this.errorMessage = `Erreur ${err.status} : impossible de charger les stagiaires.`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private extractIdFromIri(iri: string | undefined): number {
    if (!iri) return 0;
    const match = iri.match(/\/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  }

  get isFormValid(): boolean {
    return !!(this.form.nom && this.form.prenom && this.form.email && this.form.plainPassword);
  }

  openAddModal(): void {
    this.form = this.emptyForm();
    this.showAddModal = true;
  }

  createStagiaire(): void {
    const body = {
      nom: this.form.nom,
      prenom: this.form.prenom,
      email: this.form.email,
      plainPassword: this.form.plainPassword,
      fonction: this.form.fonction || null,
      debutStage: this.form.debutStage || null,
      finStage: this.form.finStage || null,
    };

    this.http.post<Stagiaire>(`${this.api}/stagiaires`, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/ld+json',
        Accept: 'application/ld+json'
      })
    }).subscribe({
      next: () => {
        this.loadStagiaires(); // recharge la liste
        this.showSuccess('Stagiaire créé avec succès.');
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
        let msg = `Erreur ${err.status} lors de la création.`;
        if (err.status === 422 && err.error?.violations) {
          msg = err.error.violations.map((v: any) => v.message).join(', ');
        }
        this.showError(msg);
      }
    });
  }

  confirmDelete(s: Stagiaire): void {
    this.selectedStagiaire = s;
    this.showDeleteModal = true;
  }

  deleteStagiaire(): void {
    if (!this.selectedStagiaire) return;
    const id = this.selectedStagiaire.id;

    this.http.delete(`${this.api}/stagiaires/${id}`).subscribe({
      next: () => {
        this.stagiaires = this.stagiaires.filter(s => s.id !== id);
        this.showSuccess('Compte supprimé.');
        this.closeModal();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.showError(`Erreur ${err.status} lors de la suppression.`);
      }
    });
  }

  closeModal(): void {
    this.showAddModal = false;
    this.showDeleteModal = false;
    this.selectedStagiaire = null;
  }

  private emptyForm(): StagiaireForm {
    return { nom: '', prenom: '', email: '', plainPassword: '', fonction: '', debutStage: '', finStage: '' };
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    this.errorMessage = '';
    setTimeout(() => this.successMessage = '', 4000);
  }

  private showError(msg: string): void {
    this.errorMessage = msg;
    this.successMessage = '';
    setTimeout(() => this.errorMessage = '', 4000);
  }
}