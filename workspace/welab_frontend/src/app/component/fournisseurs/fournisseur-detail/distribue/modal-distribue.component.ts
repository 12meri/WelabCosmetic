import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DistribueService } from '../../../../services/distribue.service';
import { ContactFournisseurService } from '../../../../services/contact-fournisseur.service';
import { ContactFournisseur } from '../../../../models/contact-fournisseur.model';

@Component({
  selector: 'app-modal-distribue',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-distribue.component.html',
  styleUrls: ['./modal-distribue.component.css']
})
export class ModalDistribueComponent implements OnInit {
  /**
   * Ce composant est une modale qui permet de gérer le contact associé à une paire distribution-matière première pour un fournisseur donné.
   * output et input : servent à communiquer avec le composant parent (FournisseurDetailComponent) pour recevoir les données nécessaires et pour notifier des changements (rafraîchissement, fermeture).
   * Il utilise les services DistribueService et ContactFournisseurService pour interagir avec le backend Symfony et effectuer les opérations de création et de suppression des liens entre distribue et contact.
   * Les méthodes du composant sont responsables de charger les contacts disponibles, d'ajouter un contact à la paire distribution-matière première, de supprimer un contact de cette paire, et de rafraîchir les données affichées dans la modale après chaque opération.
   */
  @Input() distributionId: number | null = null;
  @Input() mpId: number | null = null;
  @Input() nomDistribution = '';
  @Input() nomMatiere = '';
  @Input() existingContactId: number | null = null;
  @Input() fournisseurId!: number;

  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  contacts: ContactFournisseur[] = [];
  selectedContactId: number | null = null;

  constructor(
    private distribueService: DistribueService,
    private contactService: ContactFournisseurService
  ) {}

  ngOnInit(): void {
    this.selectedContactId = this.existingContactId;
    this.loadContactsForFournisseur();
  }

  loadContactsForFournisseur(): void {
    const expectedIri = `/api/fournisseurs/${this.fournisseurId}`;
    this.contactService.list().subscribe({
      next: (allContacts) => {
        this.contacts = allContacts.filter(c => {
          const cIri = typeof c.fournisseur === 'string'
            ? c.fournisseur
            : (c.fournisseur as any)?.['@id'] || '';
          return cIri === expectedIri;
        });
      },
      error: (err) => console.error('Erreur chargement contacts', err)
    });
  }

  save(): void {
    if (!this.distributionId || !this.mpId) return; // sécurité

    this.distribueService.getByDistributionAndMp(this.distributionId, this.mpId).subscribe({
      next: (existingDistribues) => {
        const existingDistribue = existingDistribues[0];
        const payload = {
          distribution: `/api/distributions/${this.distributionId}`,
          mp: `/api/mat_premieres/${this.mpId}`,
          contact: this.selectedContactId ? `/api/contact_fournisseurs/${this.selectedContactId}` : null
        };
        if (existingDistribue?.id) {
          this.distribueService.update(existingDistribue.id, payload).subscribe({
            next: () => this.saved.emit(),
            error: (err) => console.error('Erreur modification Distribue', err)
          });
        } else {
          this.distribueService.create(payload).subscribe({
            next: () => this.saved.emit(),
            error: (err) => console.error('Erreur création Distribue', err)
          });
        }
      },
      error: (err) => console.error('Erreur recherche Distribue', err)
    });
  }

  cancel(): void {
    this.closed.emit();
  }
}