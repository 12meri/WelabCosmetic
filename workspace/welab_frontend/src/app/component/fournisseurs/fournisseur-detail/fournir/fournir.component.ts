import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FournirService } from '../../../../services/fournir.service';
import { MatierePremiere } from '../../../../models/matiere-premiere.model';
import { Distribution } from '../../../../models/distribution.model';

@Component({
  selector: 'app-modal-fournir',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fournir.component.html',
  // styleUrls: ['./modal-fournir.component.css']
})
export class ModalFournirComponent {
  @Input() fournisseurId!: number; 
  @Input() matieres: MatierePremiere[] = [];
  @Input() distributions: Distribution[] = [];
  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  selectedMatPrem: number | null = null;
  selectedDistribution: number | null = null;
  prix: string = '';
  moq: string = '';

  constructor(private fournirService: FournirService) {}

  save(): void {
    if (!this.selectedMatPrem) {
      // Optionnel : afficher une erreur
      return;
    }

    const payload = {
      matPrem: `/api/mat_premieres/${this.selectedMatPrem}`,
      fournisseur: `/api/fournisseurs/${this.fournisseurId}`,
      distribution: this.selectedDistribution ? `/api/distributions/${this.selectedDistribution}` : null,
      prix: this.prix,
      moq: this.moq
    };

    this.fournirService.create(payload).subscribe({
      next: () => {
        this.saved.emit();
      },
      error: (err) => console.error('Erreur création Fournir', err)
    });
  }

  cancel(): void {
    this.closed.emit();
  }
}