import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DistributionService } from '../../../services/distribution.service';
import { FournisseurService } from '../../../services/fournisseur.service';
import { Distribution } from '../../../models/distribution.model';
import { Fournisseur } from '../../../models/fournisseur.model';

@Component({
  selector: 'app-distributions-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './distributions-edit.html',
  styleUrl: './distributions-edit.css',
})
export class DistributionsEdit implements OnInit {

  distribution: Distribution = {
    nomMarque: '',
    fournisseur: ''
  };

  fournisseurs: Fournisseur[] = [];
  id!: number;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private distributionService: DistributionService,
    private fournisseurService: FournisseurService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.load();
    } else {
      this.errorMessage = '❌ ID introuvable';
    }
    this.loadFournisseurs();
  }

  load(): void {
    this.isLoading = true;
    this.distributionService.getById(this.id).subscribe({
      next: (data) => {
        this.distribution = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur chargement :', error);
        this.errorMessage = '❌ Erreur lors du chargement';
        this.isLoading = false;
      }
    });
  }

  loadFournisseurs(): void {
    this.fournisseurService.list().subscribe({
      next: (data) => {
        this.fournisseurs = data;
      },
      error: (error) => {
        console.error('Erreur chargement fournisseurs :', error);
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
          this.successMessage = '✅ Distribution modifiée avec succès !';
          setTimeout(() => {
            this.router.navigate(['/distributions']);
          }, 2000);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur modification :', error);
        this.errorMessage =
          error?.error?.detail ||
          error?.error?.message ||
          '❌ Erreur lors de la modification';
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/distributions']);
  }
}
