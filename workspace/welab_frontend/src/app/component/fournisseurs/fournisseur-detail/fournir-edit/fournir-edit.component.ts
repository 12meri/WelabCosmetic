import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FournirService } from '../../../../services/fournir.service';
import { Fournir } from '../../../../models/fournir.model';

@Component({
  selector: 'app-modal-edit-fournir',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fournir-edit.component.html',
//   styleUrls: ['']
})
export class ModalEditFournirComponent implements OnInit {
  @Input() fournir!: Fournir; // l'objet Fournir à modifier
  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  prix: string = '';
  moq: string = '';

  constructor(private fournirService: FournirService) {}

  ngOnInit(): void {
    // Initialiser les champs avec les valeurs existantes
    this.prix = this.fournir.prix || '';
    this.moq = this.fournir.moq || '';
  }

  save(): void {
    const updatedData: any = {};
    if (this.prix !== this.fournir.prix) updatedData.prix = this.prix;
    if (this.moq !== this.fournir.moq) updatedData.moq = this.moq;

    if (Object.keys(updatedData).length === 0) {
      this.closed.emit(); // rien à modifier
      return;
    }

    this.fournirService.update(this.fournir.id!, updatedData).subscribe({
      next: () => {
        this.saved.emit();
      },
      error: (err) => console.error('Erreur modification Fournir', err)
    });
  }

  cancel(): void {
    this.closed.emit();
  }
}