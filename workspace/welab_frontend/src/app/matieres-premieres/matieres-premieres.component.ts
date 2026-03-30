import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatpremService } from '../services/matiere-premiere.service';
import { MatierePremiere } from '../models/matiere-premiere.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mp-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink, CommonModule],
  templateUrl: './matieres-premieres.component.html',
  styleUrl: './matieres-premieres.component.css',
})
export class MpList implements OnInit {

  mp$!: Observable<Array<MatierePremiere>>;
  showDeleteModal = false;
  selectedMpId: number | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(private mpservice: MatpremService) {}

  ngOnInit(): void {
    this.mp$ = this.mpservice.mplist();
  }

  openDeleteModal(id: number): void {
    this.selectedMpId = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedMpId = null;
  }

  confirmDelete(): void {
    if (this.selectedMpId === null) {
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';

    this.mpservice.deleteMp(this.selectedMpId).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = '✅ Matière première supprimée avec succès';
          this.mp$ = this.mpservice.mplist();
        } else {
          this.errorMessage = '❌ La suppression a échoué';
        }
        this.closeDeleteModal();
      },
      error: (error) => {
        console.error('Erreur suppression :', error);
        this.errorMessage = '❌ Erreur lors de la suppression';
        this.closeDeleteModal();
      }
    });
  }
}