import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { DemandeEchantillonService } from '../../../services/demande-echantillon.service';
import { DemandeEchantillon } from '../../../models/demande-echantillon.model';
import { MatpremService } from '../../../services/matiere-premiere.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-demande-echantillon-list',
  standalone: true,
  imports: [AsyncPipe, CommonModule, RouterLink, DatePipe],
  templateUrl: './demande-echantillon-list.html',
  styleUrl: './demande-echantillon-list.css',
})
export class DemandeEchantillonList implements OnInit {

  demandes$!: Observable<Array<DemandeEchantillon>>;
  matieresPremieres: any[] = [];
  fournisseurs: any[] = [];

  showDeleteModal = false;
  selectedDemandeId: number | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(
    private demandeService: DemandeEchantillonService,
    private mpService: MatpremService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadDemandes();
    this.loadMatieresPremieres();
    this.loadFournisseurs();
  }

  loadDemandes(): void {
    this.demandes$ = this.demandeService.demandeList();
  }

  loadMatieresPremieres(): void {
    this.mpService.mplist().subscribe({
      next: (data) => {
        this.matieresPremieres = data;
      },
      error: (error) => {
        console.error('Erreur chargement matières premières :', error);
      }
    });
  }

  loadFournisseurs(): void {
    this.http.get<any>('http://localhost:8011/api/fournisseurs').subscribe({
      next: (data) => {
        this.fournisseurs = data.member || data['hydra:member'] || [];
      },
      error: (error) => {
        console.error('Erreur chargement fournisseurs :', error);
      }
    });
  }

  getMpName(mpIri: string | undefined): string {
    if (!mpIri) return '';

    const mp = this.matieresPremieres.find(m =>
      m['@id'] === mpIri || `/api/mat_premieres/${m.id}` === mpIri
    );

    return mp ? mp.nomMP : mpIri;
  }

  getFournisseurName(fournisseurIri: string | undefined): string {
    if (!fournisseurIri) return '';

    const fournisseur = this.fournisseurs.find((f: any) =>
      f['@id'] === fournisseurIri || `/api/fournisseurs/${f.id}` === fournisseurIri
    );

    return fournisseur
      ? (fournisseur.nomEntr || fournisseur.nomFournisseur || `Fournisseur ${fournisseur.id}`)
      : fournisseurIri;
  }

  openDeleteModal(id: number): void {
    this.selectedDemandeId = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedDemandeId = null;
  }

  confirmDelete(): void {
    if (this.selectedDemandeId === null) return;

    this.successMessage = '';
    this.errorMessage = '';

    this.demandeService.deleteDemande(this.selectedDemandeId).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = '✅ Demande supprimée avec succès';
          this.loadDemandes();
        } else {
          this.errorMessage = '❌ La suppression a échoué';
        }
        this.closeDeleteModal();
      },
      error: (error) => {
        console.error('Erreur suppression demande :', error);
        this.errorMessage =
          error?.error?.detail ||
          error?.error?.message ||
          '❌ Erreur lors de la suppression';
        this.closeDeleteModal();
      }
    });
  }
}