import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DistributionService } from '../../../services/distribution.service';
import { FournisseurService } from '../../../services/fournisseur.service';
import { ContactFournisseurService } from '../../../services/contact-fournisseur.service';
import { Distribution } from '../../../models/distribution.model';
import { Fournisseur } from '../../../models/fournisseur.model';
import { ContactFournisseur } from '../../../models/contact-fournisseur.model';

@Component({
  selector: 'app-distributions-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './distributions-add.component.html',
  styleUrl: './distributions-add.component.css',
})
export class DistributionsAdd implements OnInit {
  /**
   * Modèle du formulaire. Contient les champs texte et la référence au fournisseur.
   */

  distribution: Distribution = {
    nomMarque: '',
    fournisseur: ''
  };

  fournisseurs: Fournisseur[] = [];
  contacts: ContactFournisseur[] = [];

  // État du verrou fournisseur (quand on arrive depuis la page détail)
  fournisseurVerrouille = false;
  fournisseurNomVerrouille = '';
  fournisseurIdVerrouille: number | null = null;

  selectedContactId: number | null = null;

  isLoading = false;
  isLoadingFournisseurs = false;
  isLoadingContacts = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private distributionService: DistributionService,
    private fournisseurService: FournisseurService,
    private contactService: ContactFournisseurService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Lire le fournisseurId éventuel passé en query param
    this.route.queryParams.subscribe(params => {
      const fournisseurId = params['fournisseurId'] ? +params['fournisseurId'] : null;

      if (fournisseurId) {
        // Mode "verrouillé" : le fournisseur est imposé
        this.fournisseurVerrouille = true;
        this.fournisseurIdVerrouille = fournisseurId;
        this.distribution.fournisseur = this.getFournisseurIriById(fournisseurId);

        // Charger le nom du fournisseur pour l'affichage
        this.fournisseurService.getById(fournisseurId).subscribe({
          next: (f) => {
            this.fournisseurNomVerrouille = f.nomEntr;
            this.cdr.markForCheck();
          }
        });

        // Charger les contacts de ce fournisseur
        this.loadContacts(fournisseurId);
      } else {
        // Mode normal : on charge la liste complète des fournisseurs
        this.loadFournisseurs();
      }
    });
  }

  loadFournisseurs(): void {
    this.isLoadingFournisseurs = true;
    this.fournisseurService.list().subscribe({
      next: (data) => {
        this.fournisseurs = data;
        this.isLoadingFournisseurs = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erreur chargement fournisseurs :', error);
        this.errorMessage = ' Impossible de charger les fournisseurs';
        this.isLoadingFournisseurs = false;
      }
    });
  }

  /**
   * Appelé quand l'utilisateur change le fournisseur dans le select (mode non verrouillé).
   * Extrait l'ID depuis l'IRI et charge les contacts correspondants.
   */
  onFournisseurChange(iri: string): void {
    this.contacts = [];
    this.selectedContactId = null;

    if (!iri) return;

    const id = +iri.split('/').pop()!;
    if (id) {
      this.loadContacts(id);
    }
  }

  loadContacts(fournisseurId: number): void {
    this.isLoadingContacts = true;
    // ContactFournisseurService.list() renvoie tous les contacts ;
    // on filtre côté client sur le champ fournisseur (IRI)
    this.contactService.list().subscribe({
      next: (contacts) => {
        const expectedIri = `/api/fournisseurs/${fournisseurId}`;
        this.contacts = contacts.filter(c => {
          const cIri = typeof c.fournisseur === 'string'
            ? c.fournisseur
            : c.fournisseur ? `/api/fournisseurs/${(c.fournisseur as any).id}` : '';
          return cIri === expectedIri;
        });
        this.isLoadingContacts = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoadingContacts = false;
        this.cdr.markForCheck();
      }
    });
  }

  getFournisseurIri(fournisseur: Fournisseur): string {
    return `/api/fournisseurs/${fournisseur.id}`;
  }

  getFournisseurIriById(id: number): string {
    return `/api/fournisseurs/${id}`;
  }

  create(): void {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.distributionService.create(this.distribution).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = ' Distribution créée avec succès !';
          this.resetForm();
          setTimeout(() => {
            // Retourner vers la liste filtrée si on vient d'un fournisseur
            if (this.fournisseurIdVerrouille) {
              this.router.navigate(['/distributions'], {
                queryParams: { fournisseurId: this.fournisseurIdVerrouille }
              });
            } else {
              this.router.navigate(['/distributions']);
            }
          }, 2000);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur création :', error);
        this.errorMessage =
          error?.error?.detail ||
          error?.error?.message ||
          ' Erreur lors de la création';
        this.isLoading = false;
      }
    });
  }

  resetForm(): void {
    this.distribution = { nomMarque: '', fournisseur: '' };
    this.selectedContactId = null;
  }

  cancel(): void {
    if (this.fournisseurIdVerrouille) {
      this.router.navigate(['/distributions'], {
        queryParams: { fournisseurId: this.fournisseurIdVerrouille }
      });
    } else {
      this.router.navigate(['/distributions']);
    }
  }
}