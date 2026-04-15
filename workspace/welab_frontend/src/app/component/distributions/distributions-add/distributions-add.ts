import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DistributionService } from '../../../services/distribution.service';
import { FournisseurService } from '../../../services/fournisseur.service';
import { Distribution } from '../../../models/distribution.model';
import { Fournisseur } from '../../../models/fournisseur.model';

@Component({
  selector: 'app-distributions-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './distributions-add.html',
  styleUrl: './distributions-add.css',
})
export class DistributionsAdd implements OnInit {

  distribution: Distribution = {
    nomMarque: '',
    fournisseur: ''
  };

  fournisseurs: Fournisseur[] = [];
  isLoading = false;
  isLoadingFournisseurs = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private distributionService: DistributionService,
    private fournisseurService: FournisseurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFournisseurs();
  }

  loadFournisseurs(): void {
    this.isLoadingFournisseurs = true;
    this.fournisseurService.list().subscribe({
      next: (data) => {
        this.fournisseurs = data;
        this.isLoadingFournisseurs = false;
      },
      error: (error) => {
        console.error('Erreur chargement fournisseurs :', error);
        this.errorMessage = '❌ Impossible de charger les fournisseurs';
        this.isLoadingFournisseurs = false;
      }
    });
  }

  getFournisseurIri(fournisseur: Fournisseur): string {
    return `/api/fournisseurs/${fournisseur.id}`;
  }

  create(): void {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.distributionService.create(this.distribution).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = '✅ Distribution créée avec succès !';
          this.resetForm();
          setTimeout(() => {
            this.router.navigate(['/distributions']);
          }, 2000);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur création :', error);
        this.errorMessage =
          error?.error?.detail ||
          error?.error?.message ||
          '❌ Erreur lors de la création';
        this.isLoading = false;
      }
    });
  }

  resetForm(): void {
    this.distribution = { nomMarque: '', fournisseur: '' };
  }

  cancel(): void {
    this.router.navigate(['/distributions']);
  }
}
