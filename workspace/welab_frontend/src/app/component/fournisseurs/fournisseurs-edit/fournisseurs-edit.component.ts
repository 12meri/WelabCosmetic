import {  ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FournisseurService } from '../../../services/fournisseur.service';
import { Fournisseur } from '../../../models/fournisseur.model';

@Component({
  selector: 'app-fournisseurs-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fournisseurs-edit.component.html',
  styleUrl: './fournisseurs-edit.component.css',
})
export class FournisseursEdit implements OnInit {

  fournisseur: Fournisseur = {
    nomEntr: '',
    adresse: '',
    emailGen: '',
    telFourni: ''
  };

  id!: number;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fournisseurService: FournisseurService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.load();
    } else {
      this.errorMessage = ' ID introuvable';
    }
  }

  load(): void {
    this.isLoading = true;
    this.fournisseurService.getById(this.id).subscribe({
      next: (data) => {
        this.fournisseur = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erreur chargement :', error);
        this.errorMessage = ' Erreur lors du chargement';
        this.isLoading = false;
      }
    });
  }

  update(): void {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.fournisseurService.update(this.id, this.fournisseur).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = ' Fournisseur modifié avec succès !';
          setTimeout(() => {
            this.router.navigate(['/fournisseurs']);
          }, 2000);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur modification :', error);
        this.errorMessage = ' Erreur lors de la modification';
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/fournisseurs']);
  }
}
