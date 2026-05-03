import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FournirService } from '../../../../services/fournir.service';
import { ContactFournisseurService } from '../../../../services/contact-fournisseur.service';
import { MatierePremiere } from '../../../../models/matiere-premiere.model';
import { Distribution } from '../../../../models/distribution.model';
import { ContactFournisseur } from '../../../../models/contact-fournisseur.model';

@Component({
  selector: 'app-modal-fournir',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fournir.component.html',
  styleUrl: './fournir.component.css'   // ← ajouté
})
export class ModalFournirComponent implements OnInit {
  /**
   * Ce composant est une modale utilisée pour ajouter une nouvelle fourniture (Fournir) à un fournisseur spécifique.
   * Les inputs sont utilisés pour recevoir l'ID du fournisseur, la liste des matières premières disponibles, et la liste des distributions associées à ce fournisseur. 
   * Les outputs sont utilisés pour notifier le composant parent (FournisseurDetailComponent) lorsque la fourniture a été ajoutée avec succès ou lorsque la modale doit être fermée.
   * La méthode save() est responsable de préparer les données de la nouvelle fourniture et d'appeler le service FournirService pour créer cette fourniture dans le backend. En cas de succès, elle émet l'événement saved, et en cas d'erreur, elle affiche une alerte avec le message d'erreur.
   * La méthode cancel() émet simplement l'événement closed pour fermer la modale sans ajouter de fourniture.
   * La méthode ngOnInit() filtre les distributions pour ne garder que celles qui sont associées au fournisseur concerné, afin de les proposer dans le formulaire d'ajout.
   */
  @Input() fournisseurId!: number;
  @Input() matieres: MatierePremiere[] = [];
  @Input() distributions: Distribution[] = [];

  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  distributionsFournisseur: Distribution[] = [];
  // contacts: ContactFournisseur[] = [];

  selectedMatPrem: number | null = null;
  selectedDistribution: number | null = null;
  selectedContactId: number | null = null;
  prix: string = '';
  moq: string = '';

  constructor(
    private fournirService: FournirService,
 
  ) {}

  ngOnInit(): void {
    const expectedIri = `/api/fournisseurs/${this.fournisseurId}`;
    this.distributionsFournisseur = this.distributions.filter(d => {
      const iri = typeof d.fournisseur === 'string'
        ? d.fournisseur
        : d.fournisseur ? `/api/fournisseurs/${(d.fournisseur as any).id}` : '';
      return iri === expectedIri;
    });
    // this.loadContacts();
  }

  // loadContacts(): void {
  //   const expectedIri = `/api/fournisseurs/${this.fournisseurId}`;
  //   this.contactService.list().subscribe({
  //     next: (contacts) => {
  //       this.contacts = contacts.filter(c => {
  //         const cIri = typeof c.fournisseur === 'string'
  //           ? c.fournisseur
  //           : c.fournisseur ? `/api/fournisseurs/${(c.fournisseur as any).id}` : '';
  //         return cIri === expectedIri;
  //       });
  //     },
  //     error: (err) => console.error('Erreur chargement contacts :', err)
  //   });
  // }

  save(): void {
  if (!this.selectedMatPrem) return;

  const payload: any = {
    matPrem: `/api/mat_premieres/${this.selectedMatPrem}`,
    fournisseur: `/api/fournisseurs/${this.fournisseurId}`,
    distribution: this.selectedDistribution
      ? `/api/distributions/${this.selectedDistribution}`
      : null,
    prix: this.prix !== '' && this.prix != null ? String(this.prix) : null,
    moq: this.moq !== '' && this.moq != null ? String(this.moq) : null,
  };

  this.fournirService.create(payload).subscribe({
    next: () => this.saved.emit(),
    error: (err) => {
      console.error('Erreur création Fournir', err);
      if (err.error?.violations) console.error('Violations', err.error.violations);
      if (err.error?.detail) console.error('Détail', err.error.detail);
    }
  });
}

  cancel(): void {
    this.closed.emit();
  }
}