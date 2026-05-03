import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DistributionService } from '../../../services/distribution.service';
import { FournisseurService } from '../../../services/fournisseur.service';
import { Distribution } from '../../../models/distribution.model';
import { Fournisseur } from '../../../models/fournisseur.model';

@Component({
  selector: 'app-distributions-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './distributions-edit.component.html',
  styleUrl: './distributions-edit.component.css',
})
export class DistributionsEdit implements OnInit {
  /** 
   * Modèle du formulaire. Contient les champs texte et la référence au fournisseur.
   */

  distribution: Distribution = {
    nomMarque: '',
    fournisseur: ''
  };

  fournisseurs: Fournisseur[] = [];
  id!: number;
  isLoading = false;
  isLoadingData = true;   // ← indicateur de chargement initial
  successMessage = '';
  errorMessage = '';

  constructor(
    private distributionService: DistributionService,
    private fournisseurService: FournisseurService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.errorMessage = ' ID introuvable';
      this.isLoadingData = false;
      return;
    }
    this.id = Number(idParam);
    this.loadAll();
  }

  loadAll(): void {
    this.isLoadingData = true;
    forkJoin({
      distribution: this.distributionService.getById(this.id),
      fournisseurs: this.fournisseurService.list()
    }).subscribe({
      next: (data) => {
        this.distribution = data.distribution;
        this.fournisseurs = data.fournisseurs;
        this.isLoadingData = false;
        this.cdr.detectChanges();   // force l'affichage immédiat
      },
      error: (err) => {
        console.error('Erreur chargement :', err);
        this.errorMessage = ' Erreur lors du chargement des données';
        this.isLoadingData = false;
        this.cdr.detectChanges();
      }
    });
  }

  getFournisseurIri(fournisseur: Fournisseur): string {
    return `/api/fournisseurs/${fournisseur.id}`;
  }

  update(): void {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.distributionService.update(this.id, this.distribution).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = ' Distribution modifiée avec succès !';
          setTimeout(() => {
            this.router.navigate(['/distributions']);
          }, 2000);
        } else {
          this.errorMessage = ' La modification a échoué';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur modification :', error);
        this.errorMessage =
          error?.error?.detail ||
          error?.error?.message ||
          ' Erreur lors de la modification';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/distributions']);
  }
}