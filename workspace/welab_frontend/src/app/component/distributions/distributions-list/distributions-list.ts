import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DistributionService } from '../../../services/distribution.service';
import { FournisseurService } from '../../../services/fournisseur.service';
import { Distribution } from '../../../models/distribution.model';
import { Fournisseur } from '../../../models/fournisseur.model';

@Component({
  selector: 'app-distributions-list',
  standalone: true,
  imports: [AsyncPipe, CommonModule, RouterLink],
  templateUrl: './distributions-list.html',
  styleUrl: './distributions-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DistributionsList implements OnInit {

  distributions$!: Observable<Distribution[]>;
  fournisseurs: Fournisseur[] = [];

  showDeleteModal = false;
  selectedId: number | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(
    private distributionService: DistributionService,
    private fournisseurService: FournisseurService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDistributions();
    this.loadFournisseurs();
  }

  loadDistributions(): void {
    this.distributions$ = this.distributionService.list();
    this.cdr.markForCheck();
  }

  loadFournisseurs(): void {
    this.fournisseurService.list().subscribe({
      next: (data) => {
        this.fournisseurs = data;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erreur chargement fournisseurs :', error);
      }
    });
  }

  getFournisseurName(iri: string | undefined): string {
    if (!iri) return '';
    const id = iri.split('/').pop();
    const found = this.fournisseurs.find(f => String(f.id) === id);
    return found ? found.nomEntr : iri;
  }

  trackById(index: number, item: Distribution) {
    return item.id;
  }

  openDeleteModal(id: number): void {
    this.selectedId = id;
    this.showDeleteModal = true;
    this.cdr.markForCheck();
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedId = null;
    this.cdr.markForCheck();
  }

  confirmDelete(): void {
    if (this.selectedId === null) return;

    this.successMessage = '';
    this.errorMessage = '';

    this.distributionService.delete(this.selectedId).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = '✅ Distribution supprimée avec succès';
          this.loadDistributions();
        } else {
          this.errorMessage = '❌ La suppression a échoué';
        }
        this.closeDeleteModal();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erreur suppression :', error);
        this.errorMessage =
          error?.error?.detail ||
          error?.error?.message ||
          '❌ Erreur lors de la suppression';
        this.closeDeleteModal();
        this.cdr.markForCheck();
      }
    });
  }
}
