import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DistribueService } from '../../../../services/distribue.service';
import { ContactFournisseurService } from '../../../../services/contact-fournisseur.service';
import { ContactFournisseur } from '../../../../models/contact-fournisseur.model';

@Component({
  selector: 'app-manage-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-contacts.component.html',
  styleUrls: ['./manage-contacts.component.css']
})
export class ManageContactsComponent implements OnInit {
  /**
   * Ce composant est une modale qui permet de gérer les contacts associés à une paire distribution-matière première pour un fournisseur donné.
   * output et input : servent à communiquer avec le composant parent (FournisseurDetailComponent) pour recevoir les données nécessaires et pour notifier des changements (rafraîchissement, fermeture).
   * Il utilise les services DistribueService et ContactFournisseurService pour interagir avec le backend Symfony et effectuer les opérations de création et de suppression des liens entre distribue et contact.
   * Les méthodes du composant sont responsables de charger les contacts disponibles, d'ajouter un contact à la paire distribution-matière première, de supprimer un contact de cette paire, et de rafraîchir les données affichées dans la modale après chaque opération.
   */
  @Input() distributionId!: number;
  @Input() mpId!: number;
  @Input() fournisseurId!: number;
  // Contacts déjà liés à cette paire, fournis par le parent
  @Input() existingContacts: ContactFournisseur[] = [];

  @Output() refresh = new EventEmitter<void>();   // pour rafraîchir le parent
  @Output() closed = new EventEmitter<void>();    // pour fermer le modal

  availableContacts: ContactFournisseur[] = [];
  selectedContactId: number | null = null;
  loading = false;

  constructor(
    private distribueService: DistribueService,
    private contactService: ContactFournisseurService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAvailableContacts();
  }

  // Recharge la liste des contacts disponibles (ceux non encore liés à cette paire)
  loadAvailableContacts(): void {
    const fournisseurIri = `/api/fournisseurs/${this.fournisseurId}`;
    this.contactService.list().subscribe({
      next: (allContacts) => {
        const fournisseurContacts = allContacts.filter(c => {
          const cIri = typeof c.fournisseur === 'string' ? c.fournisseur : (c.fournisseur as any)?.['@id'] || '';
          return cIri === fournisseurIri;
        });
        const existingIds = new Set(this.existingContacts.map(c => c.id));
        this.availableContacts = fournisseurContacts.filter(c => !existingIds.has(c.id));
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur chargement contacts', err)
    });
  }

  // Recharge complètement les données du modal (existingContacts + availableContacts)
  /**
   * La méthode refreshModalData est responsable de recharger les données affichées dans la modale de gestion des contacts après une opération d'ajout ou de suppression. 
   * Elle effectue une nouvelle requête pour obtenir la liste des distribues associés à la paire distribution-matière première, puis utilise cette liste pour déterminer quels contacts sont actuellement liés à cette paire.
   *  Ensuite, elle recharge la liste des contacts disponibles en filtrant ceux qui ne sont pas encore liés. Cette méthode garantit que l'affichage de la modale est toujours à jour avec les données du backend après chaque modification.
   */
  refreshModalData(): void {
    // Récupère la liste actuelle des Distribue pour cette paire
    this.distribueService.getByDistributionAndMp(this.distributionId, this.mpId).subscribe({
      next: (distribues) => {
        const contactIds = distribues
          .map(d => d.contact ? Number(d.contact.split('/').pop()) : null)
          .filter(id => id !== null) as number[];

        // Récupère tous les contacts du fournisseur
        const fournisseurIri = `/api/fournisseurs/${this.fournisseurId}`;
        this.contactService.list().subscribe({
          next: (allContacts) => {
            const fournisseurContacts = allContacts.filter(c => {
              const cIri = typeof c.fournisseur === 'string' ? c.fournisseur : (c.fournisseur as any)?.['@id'] || '';
              return cIri === fournisseurIri;
            });
            this.existingContacts = fournisseurContacts.filter(c => contactIds.includes(c.id!));
            const existingIds = new Set(this.existingContacts.map(c => c.id));
            this.availableContacts = fournisseurContacts.filter(c => !existingIds.has(c.id));
            this.cdr.markForCheck();
          }
        });
      },
      error: (err) => console.error('Erreur rechargement distribues', err)
    });
  }

  // Ajoute un contact à la paire distribution-matière première en créant un lien de type Distribue
  addContact(): void {
    if (!this.selectedContactId) return;
    this.loading = true;

    const payload = {
      distribution: `/api/distributions/${this.distributionId}`,
      mp: `/api/mat_premieres/${this.mpId}`,
      contact: `/api/contact_fournisseurs/${this.selectedContactId}`
    };

    this.distribueService.create(payload).subscribe({
      next: () => {
        // Recharge les données du modal (sans fermer)
        this.refreshModalData();
        this.selectedContactId = null;
        this.loading = false;
        // Prévient le parent pour qu'il rafraîchisse l'affichage principal
        this.refresh.emit();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur création Distribue', err);
        this.loading = false;
      }
    });
  }

  // Supprime le lien entre un contact et la paire distribution-matière première en supprimant l'entité Distribue correspondante
  deleteContact(contactId: number): void {
    this.loading = true;
    // Cherche le Distribue correspondant à cette paire + ce contact
    this.distribueService.getByDistributionAndMp(this.distributionId, this.mpId).subscribe({
      next: (distribues) => {
        const target = distribues.find(d => {
          const cId = d.contact ? Number(d.contact.split('/').pop()) : null;
          return cId === contactId;
        });
        if (target?.id) {
          this.distribueService.delete(target.id).subscribe({
            next: () => {
              this.refreshModalData();
              this.loading = false;
              this.refresh.emit();
              this.cdr.markForCheck();
            },
            error: (err) => {
              console.error('Erreur suppression Distribue', err);
              this.loading = false;
            }
          });
        } else {
          console.warn('Aucun Distribue trouvé pour ce contact');
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Erreur recherche Distribue', err);
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.closed.emit();   // ferme le modal
  }
}