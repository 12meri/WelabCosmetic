import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatpremService } from '../../services/matiere-premiere.service';
import { MatierePremiere } from '../../models/matiere-premiere.model';

@Component({
  selector: 'app-mp-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mp-edit.html',
  styleUrl: './mp-edit.css',
})
export class MpEdit implements OnInit {

  mp: MatierePremiere = {
    nomMP: '',
    INCI: '',
    NOI: '',
    categorie: '',
    fonction: '',
    cosmos: ''
  };

  id!: number;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private matpremService: MatpremService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.id = Number(idParam);
      this.loadMp();
    } else {
      this.errorMessage = '❌ ID introuvable';
    }
  }

  loadMp(): void {
    this.isLoading = true;
    this.matpremService.getMpById(this.id).subscribe({
      next: (data) => {
        this.mp = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur chargement :', error);
        this.errorMessage = '❌ Erreur lors du chargement';
        this.isLoading = false;
      }
    });
  }

  updateMp(): void {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.matpremService.updateMp(this.id, this.mp).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = '✅ Matière première modifiée avec succès !';
          setTimeout(() => {
            this.router.navigate(['/matpremieres']);
          }, 2000);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur modification :', error);
        this.errorMessage = '❌ Erreur lors de la modification';
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/matpremieres']);
  }
}