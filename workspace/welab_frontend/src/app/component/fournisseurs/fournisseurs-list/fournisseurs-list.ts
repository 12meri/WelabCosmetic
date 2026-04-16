import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Observable } from 'rxjs';
import { FournisseurService } from '../../../services/fournisseur.service';
import { Fournisseur } from '../../../models/fournisseur.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-fournisseurs-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink, CommonModule],
  templateUrl: './fournisseurs-list.html',
  styleUrl: './fournisseurs-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FournisseursList implements OnInit {

  fournisseurs$!: Observable<Fournisseur[]>;
  showDeleteModal = false;
  selectedId: number | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fournisseurService: FournisseurService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fournisseurs$ = this.fournisseurService.list();
    this.cdr.markForCheck();
  }

  trackById(index: number, item: Fournisseur) {
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

    this.fournisseurService.delete(this.selectedId).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = '✅ Fournisseur supprimé avec succès';
          this.fournisseurs$ = this.fournisseurService.list();
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
