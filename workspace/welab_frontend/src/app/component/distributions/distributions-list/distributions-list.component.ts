import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Observable , combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink , ActivatedRoute} from '@angular/router';
import { DistributionService } from '../../../services/distribution.service';
import { FournisseurService } from '../../../services/fournisseur.service';
import { Distribution } from '../../../models/distribution.model';
import { Fournisseur } from '../../../models/fournisseur.model';

@Component({
  selector: 'app-distributions-list',
  standalone: true,
  imports: [AsyncPipe, CommonModule, RouterLink],
  templateUrl: './distributions-list.component.html',
  styleUrl: './distributions-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DistributionsList implements OnInit {
  // Liste affichée dans le template, assignée en une seule fois après
  distributions$!: Observable<Distribution[]>;
  fournisseurs: Fournisseur[] = [];
  fournisseurIdFiltre: number | null = null;  // Stocke l'ID du fournisseur filtré
  fournisseurNom: string = '';                // Pour affichage éventuel


  showDeleteModal = false;
  selectedId: number | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(
    private distributionService: DistributionService,
    private fournisseurService: FournisseurService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // 1. Récupérer le paramètre fournisseurId depuis l'URL
    this.route.queryParams.subscribe(params => {
      const id = params['fournisseurId'];
      this.fournisseurIdFiltre = id ? +id : null;
      if (this.fournisseurIdFiltre) {
        this.loadFournisseurNom(this.fournisseurIdFiltre);
      }
      this.loadDistributions(); // recharge avec le filtre
    });

    this.loadFournisseurs(); // pour résoudre les noms des fournisseurs dans le tableau
  }

  // Charge le nom du fournisseur pour affichage (optionnel, selon besoin dans le template)
  loadFournisseurNom(id: number): void {
    this.fournisseurService.getById(id).subscribe({
      next: (f) => this.fournisseurNom = f.nomEntr,
      error: () => this.fournisseurNom = 'Fournisseur inconnu'
    });
  }

  loadDistributions(): void {
      // Charger toutes les distributions (depuis le service)
    this.distributions$ = this.distributionService.list().pipe(
      map(distributions => {
        if (this.fournisseurIdFiltre) {
          const expectedIri = `/api/fournisseurs/${this.fournisseurIdFiltre}`;
          return distributions.filter(d => {
            // Distribution.fournisseur est typé `string` dans le modèle,
            // mais l'API peut renvoyer un objet — on cast en `any` pour éviter TS2339
            const f = d.fournisseur as any;
            const fIri: string = typeof f === 'string'
              ? f
              : f?.['@id'] ?? (f?.id ? `/api/fournisseurs/${f.id}` : '');
            return fIri === expectedIri;
          });
        }
        return distributions;
      })
    );
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
          this.successMessage = ' Distribution supprimée avec succès';
          this.loadDistributions();
        } else {
          this.errorMessage = ' La suppression a échoué';
        }
        this.closeDeleteModal();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erreur suppression :', error);
        this.errorMessage =
          error?.error?.detail ||
          error?.error?.message ||
          ' Erreur lors de la suppression';
        this.closeDeleteModal();
        this.cdr.markForCheck();
      }
    });
  }
}
