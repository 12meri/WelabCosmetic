import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FournirService } from '../../../../services/fournir.service';
import { Fournir } from '../../../../models/fournir.model';
import { Distribution } from '../../../../models/distribution.model';
import { MatierePremiere } from '../../../../models/matiere-premiere.model';

@Component({
  selector: 'app-modal-edit-fournir',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fournir-edit.component.html',
  styleUrls: ['./fournir-edit.component.css']
})
export class ModalEditFournirComponent implements OnInit {
  /**
   * Ce composant est une modale qui permet de modifier les détails d'une fourniture spécifique (Fournir) pour un fournisseur donné.
   * Les inputs sont utilisés pour recevoir la fourniture à modifier, la liste des distributions du fournisseur, et le nom de la matière première associée. 
   * Les outputs sont utilisés pour notifier le composant parent (FournisseurDetailComponent) lorsque la fourniture a été modifiée avec succès ou lorsque la modale doit être fermée.
   * La méthode save() est responsable de préparer les données modifiées et d'appeler le service FournirService pour mettre à jour la fourniture dans le backend. En cas de succès, elle émet l'événement saved, et en cas d'erreur, elle affiche une alerte avec le message d'erreur.
   * La méthode cancel() émet simplement l'événement closed pour fermer la modale sans enregistrer les modifications.
   * Les champs prix, moq et distributionId sont liés aux champs du formulaire dans le template et sont initialisés avec les valeurs actuelles de la fourniture lors de l'initial
   */
  @Input() fournir!: Fournir;
  @Input() distributions: Distribution[] = [];      // toutes les distributions du fournisseur
  @Input() matiereNom: string = '';                 // nom de la matière première (affichage)
  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  prix: string = '';
  moq: string = '';
  distributionId: number | null = null;

  constructor(private fournirService: FournirService) {}

  ngOnInit(): void {
    this.prix = this.fournir.prix || '';
    this.moq = this.fournir.moq || '';
    // extraire l'ID de la distribution actuelle
    if (this.fournir.distribution) {
      const dist = this.fournir.distribution;
      this.distributionId = typeof dist === 'object' ? dist.id! : parseInt(dist.split('/').pop()!);
    } else {
      this.distributionId = null;
    }
  }

  save(): void {
    const updatedData: any = {};

    // Prix / MOQ
    const prixToSend = this.prix === '' ? null : String(this.prix);
    const moqToSend = this.moq === '' ? null : String(this.moq);
    if (prixToSend !== this.fournir.prix) updatedData.prix = prixToSend;
    if (moqToSend !== this.fournir.moq) updatedData.moq = moqToSend;

    // Distribution
    const oldDistId = this.fournir.distribution ? 
      (typeof this.fournir.distribution === 'object' ? this.fournir.distribution.id : parseInt(this.fournir.distribution.split('/').pop()!)) 
      : null;
    if (this.distributionId !== oldDistId) {
      updatedData.distribution = this.distributionId ? `/api/distributions/${this.distributionId}` : null;
    }

    if (Object.keys(updatedData).length === 0) {
      this.closed.emit();
      return;
    }

    this.fournirService.update(this.fournir.id!, updatedData).subscribe({
      next: () => this.saved.emit(),
      error: (err) => {
        console.error('Erreur modification Fournir', err);
        if (err.error?.detail?.includes('Duplicate entry')) {
          alert('Ce triplet (matière première, fournisseur, distribution) existe déjà. Modifiez la distribution ou supprimez l’ancienne entrée.');
        } else {
          alert('Erreur lors de la modification : ' + (err.error?.detail || 'Vérifiez les champs.'));
        }
      }
    });
  }

  cancel(): void {
    this.closed.emit();
  }
}