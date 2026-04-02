import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Observable } from 'rxjs';
import { MatpremService } from '../../services/matiere-premiere.service';
import { MatierePremiere } from '../../models/matiere-premiere.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mp-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink, CommonModule],
  templateUrl: './mp-list.component.html',
  styleUrl: './mp-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MpList implements OnInit {

  mp$!: Observable<Array<MatierePremiere>>;
  showDeleteModal = false;
  selectedMpId: number | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(
    private mpservice: MatpremService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.mp$ = this.mpservice.mplist();
    this.cdr.markForCheck();
  }

  trackById(index: number, item: MatierePremiere) {
    return item.id;
  }

  openDeleteModal(id: number): void {
    this.selectedMpId = id;
    this.showDeleteModal = true;
    this.cdr.markForCheck();
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedMpId = null;
    this.cdr.markForCheck();
  }

  confirmDelete(): void {
    if (this.selectedMpId === null) return;

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
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erreur suppression :', error);
        this.errorMessage = '❌ Erreur lors de la suppression';
        this.closeDeleteModal();
        this.cdr.markForCheck();
      }
    });
  }
}
