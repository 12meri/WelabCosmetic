import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FournisseurService } from '../../../services/fournisseur.service';
import { FournirService } from '../../../services/fournir.service';
import { MatpremService } from '../../../services/matiere-premiere.service';
import { DistributionService } from '../../../services/distribution.service';
import { DistribueService } from '../../../services/distribue.service';
import { ContactFournisseurService } from '../../../services/contact-fournisseur.service';
import { Fournisseur } from '../../../models/fournisseur.model';
import { Fournir } from '../../../models/fournir.model';
import { MatierePremiere } from '../../../models/matiere-premiere.model';
import { Distribution } from '../../../models/distribution.model';
import { Distribue } from '../../../models/distribue.model';
import { ContactFournisseur } from '../../../models/contact-fournisseur.model';
import { ModalEditFournirComponent } from './fournir-edit/fournir-edit.component';
import { ModalFournirComponent } from './fournir/fournir.component';
import { ModalDistribueComponent } from './distribue/modal-distribue.component';
import { CommonModule } from '@angular/common';
import { ManageContactsComponent } from './manage-contact/manage-contacts.component';

@Component({
  selector: 'app-fournisseur-detail',
  templateUrl: './fournisseur-detail.component.html',
  styleUrls: ['./fournisseur-detail.component.css'],
  imports: [ModalEditFournirComponent, ModalFournirComponent,  RouterModule, CommonModule, ManageContactsComponent]
})
export class FournisseurDetailComponent implements OnInit {
  // Déclaration des propriétés pour stocker les données du fournisseur, des fournitures, des matières premières, des distributions et des contacts associés.
  fournisseur: Fournisseur | null = null;
  fournitures: Fournir[] = [];
  matieres: MatierePremiere[] = [];
  distributions: Distribution[] = [];
  distributionsFournisseur: Distribution[] = [];
  contactsFournisseur: ContactFournisseur[] = [];

  /** Map pour stocker les contacts associés à chaque distribution */
  distribueContactsMap = new Map<string, ContactFournisseur[]>();
  /** Map pour stocker les contacts spécifiques et généraux associés à chaque fournir */
  contactsParFournir = new Map<number, { specifiques: ContactFournisseur[]; general: ContactFournisseur[] }>();

  // Propriétés pour gérer l'affichage des modales et les éléments sélectionnés pour les actions de modification, suppression, etc.
  showModalFournir = false;
  showModalEditFournir = false;
  showDeleteModal = false;
  showModalDistribue = false;

  // Propriétés pour la modale de fourniture
  selectedFournir: Fournir | null = null;
  selectedFournirId: number | null = null;
  selectedMpNameForEdit = '';

  // Propriétés pour la modale de distribution
  distribueModalDistributionId: number | null = null;
  distribueModalMpId: number | null = null;
  distribueModalNomDistribution = '';
  distribueModalNomMatiere = '';
  distribueModalExistingId?: number;
  distribueModalExistingContactId?: number | null;

  // Propriétés pour la modale de gestion des contacts
  showManageContactsModal = false;
  manageContactsDistId: number | null = null;
  manageContactsMpId: number | null = null;
  manageContactsExisting: ContactFournisseur[] = [];

  constructor(
    private route: ActivatedRoute,
    private fournisseurService: FournisseurService,
    private fournirService: FournirService,
    private mpService: MatpremService,
    private distribueService: DistribueService,
    private distributionService: DistributionService,
    private contactService: ContactFournisseurService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadFournisseur(+id);
      this.loadFournitures(+id);
      this.loadMatieres();
    }
  }

  // La méthode loadFournisseur est responsable de charger les données d'un fournisseur spécifique à partir du backend Symfony en utilisant le service FournisseurService.
  loadFournisseur(id: number): void {
    this.fournisseurService.getById(id).subscribe({
      next: (data) => {
        this.fournisseur = data;
        this.loadDistributions();
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err)
    });
  }

  // La méthode loadFournitures est responsable de charger les fournitures associées à un fournisseur spécifique à partir du backend Symfony en utilisant le service FournirService.
  loadFournitures(fournisseurId: number): void {
    this.fournirService.getByFournisseur(fournisseurId).subscribe({
      next: (data) => {
        this.fournitures = data;
        this.rebuildContactsParFournir();
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur chargement fournitures :', err)
    });
  }

  // La méthode loadMatieres est responsable de charger la liste complète des matières premières à partir du backend Symfony en utilisant le service MatpremService.
  loadMatieres(): void {
    this.mpService.mplist().subscribe({
      next: (data) => { this.matieres = data; this.cdr.markForCheck(); },
      error: (err) => console.error(err)
    });
  }

  // La méthode loadDistributions est responsable de charger la liste complète des distributions à partir du backend Symfony en utilisant le service DistributionService, puis de filtrer celles qui sont associées au fournisseur actuel.
  loadDistributions(): void {
    this.distributionService.list().subscribe({
      next: (data) => {
        this.distributions = data;
        if (this.fournisseur) {
          const iri = `/api/fournisseurs/${this.fournisseur.id}`;
          this.distributionsFournisseur = data.filter(d => {
            const fIri = typeof d.fournisseur === 'string' ? d.fournisseur : (d.fournisseur as any)?.['@id'] || '';
            return fIri === iri;
          });
        }
        this.loadContacts();
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err)
    });
  }

  // La méthode loadContacts est responsable de charger les contacts associés au fournisseur actuel en utilisant le service ContactFournisseurService, puis de filtrer ceux qui sont liés au fournisseur en cours d'affichage.
  loadContacts(): void {
    if (!this.fournisseur) return;
    const fournisseurIri = `/api/fournisseurs/${this.fournisseur.id}`;
    this.contactService.list().subscribe({
      next: (allContacts) => {
        this.contactsFournisseur = allContacts.filter(c => {
          const cIri = typeof c.fournisseur === 'string' ? c.fournisseur : (c.fournisseur as any)?.['@id'] || '';
          return cIri === fournisseurIri;
        });
        this.loadDistribueContacts();
      },
      error: (err) => console.error('Erreur contacts', err)
    });
  }

  /**
   * La méthode loadDistribueContacts est responsable de charger les données de distribution et les contacts associés à ces distributions pour le fournisseur actuel.
   * Elle utilise le service DistribueService pour obtenir la liste complète des distribues, puis filtre ceux qui sont liés aux distributions du fournisseur.
   *  Ensuite, elle construit une map pour associer chaque distribution à ses contacts spécifiques, et enfin elle reconstruit la structure de contacts par fournir pour faciliter l'affichage dans le template.
   */
  loadDistribueContacts(): void {
    this.distribueService.getAll().subscribe({
      next: (distribues: Distribue[]) => {
        const distIris = new Set(this.distributionsFournisseur.map(d => d['@id'] || `/api/distributions/${d.id}`));
        const filtered = distribues.filter(d => {
          const dIri = typeof d.distribution === 'string' ? d.distribution : (d.distribution as any)?.['@id'] || '';
          return distIris.has(dIri);
        });

        this.distribueContactsMap.clear();
        filtered.forEach(d => {
          const distId = d.distribution.split('/').pop();
          const mpId = d.mp.split('/').pop();
          if (!distId || !mpId || !d.contact) return;
          const key = `${distId}_${mpId}`;
          const contactId = Number(d.contact.split('/').pop());
          const contact = this.contactsFournisseur.find(c => c.id === contactId);
          if (contact) {
            if (!this.distribueContactsMap.has(key)) this.distribueContactsMap.set(key, []);
            this.distribueContactsMap.get(key)!.push(contact);
          }
        });
        this.rebuildContactsParFournir();
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur distribues', err)
    });
  }

  /**
   * La méthode rebuildContactsParFournir est responsable de reconstruire la structure de données qui associe chaque fournir à ses contacts spécifiques et généraux.
   * Elle parcourt la liste des fournitures du fournisseur, et pour chaque fournir, elle vérifie s'il est associé à une distribution. Si c'est le cas, elle utilise la map des contacts de distribue pour trouver les contacts spécifiques liés à cette distribution et matière première, et les associe au fournir. Les contacts généraux (non spécifiques à une distribution) sont également associés au fournir.
   * Cette méthode est appelée après le chargement des fournitures et des contacts pour s'assurer que les données affichées dans le template sont à jour.
   */
  rebuildContactsParFournir(): void {
    this.contactsParFournir.clear();
    this.fournitures.forEach(f => {
      if (f.id === undefined) return;
      let specifiques: ContactFournisseur[] = [];
      if (f.distribution) {
        const distId = typeof f.distribution === 'string' ? f.distribution.split('/').pop() : (f.distribution as Distribution).id?.toString();
        const mpId = typeof f.matPrem === 'string' ? f.matPrem.split('/').pop() : (f.matPrem as MatierePremiere).id?.toString();
        if (distId && mpId) {
          specifiques = this.distribueContactsMap.get(`${distId}_${mpId}`) ?? [];
        }
      }
      this.contactsParFournir.set(f.id, { specifiques, general: [] });
    });
    this.cdr.markForCheck();
  }

  /**
   *  La méthode openManageContacts est responsable d'ouvrir la modale de gestion des contacts pour une fourniture spécifique.
   * @param fournir  
   * @returns 
   */
  openManageContacts(fournir: Fournir): void {
    if (!fournir.distribution || !this.fournisseur) return;
    const distId = typeof fournir.distribution === 'string' ? Number(fournir.distribution.split('/').pop()) : (fournir.distribution as Distribution).id!;
    const mpId = typeof fournir.matPrem === 'string' ? Number(fournir.matPrem.split('/').pop()) : (fournir.matPrem as MatierePremiere).id!;
    this.manageContactsDistId = distId;
    this.manageContactsMpId = mpId;
    const key = `${distId}_${mpId}`;
    this.manageContactsExisting = this.distribueContactsMap.get(key) || [];
    this.showManageContactsModal = true;
    this.cdr.markForCheck();
  }

  onManageContactsRefresh(): void {
    this.loadDistribueContacts(); // recharge la map et le tableau
  }

  // La méthode getMatPremNom est une fonction utilitaire qui prend en entrée une valeur qui peut être soit une chaîne de caractères représentant l'IRI d'une matière première, soit un objet MatierePremiere, ou undefined. Elle retourne le nom de la matière première correspondant à cette valeur. Si la valeur est une chaîne, elle extrait l'ID de l'IRI et cherche la matière première correspondante dans la liste chargée. Si c'est un objet, elle utilise directement son ID pour trouver le nom. Si aucune correspondance n'est trouvée, elle retourne une indication d'inconnu.
  getMatPremNom(value: string | MatierePremiere | undefined): string {
    if (!value) return '';
    if (typeof value === 'string') {
      const id = value.split('/').pop();
      return this.matieres.find(m => String(m.id) === id)?.nomMP ?? value;
    }
    return this.matieres.find(m => m.id === value.id)?.nomMP ?? value.nomMP ?? 'MP inconnue';
  }

  getDistribNom(value: string | Distribution | null | undefined): string {
    if (!value) return '--';
    if (typeof value === 'string') {
      const id = value.split('/').pop();
      return this.distributions.find(d => String(d.id) === id)?.nomMarque ?? value;
    }
    return this.distributions.find(d => d.id === value.id)?.nomMarque ?? value.nomMarque ?? 'Marque inconnue';
  }

  // La méthode hasDistribution est une fonction utilitaire qui vérifie si une fourniture donnée est associée à une distribution. Elle retourne true si la fourniture a une distribution associée, et false sinon. Cette méthode est utilisée dans le template pour conditionner l'affichage de certaines informations ou actions en fonction de la présence d'une distribution.
  hasDistribution(f: Fournir): boolean {
    return !!f.distribution;
  }

  getContactsForFournir(fournirId: number) {
    return this.contactsParFournir.get(fournirId) ?? { specifiques: [], general: [] };
  }

  openAddFournir(): void {
    this.showModalFournir = true;
    this.cdr.markForCheck();
  }

  openEditFournir(fournir: Fournir): void {
    this.selectedFournir = fournir;
    this.selectedMpNameForEdit = this.getMatPremNom(fournir.matPrem);
    this.showModalEditFournir = true;
    this.cdr.markForCheck();
  }

  openDeleteFournir(id: number): void {
    this.selectedFournirId = id;
    this.showDeleteModal = true;
    this.cdr.markForCheck();
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedFournirId = null;
    this.cdr.markForCheck();
  }

  confirmDelete(): void {
    if (this.selectedFournirId === null) return;
    this.fournirService.delete(this.selectedFournirId).subscribe({
      next: () => {
        this.loadFournitures(this.fournisseur!.id!);
        this.closeDeleteModal();
      },
      error: (err) => console.error(err)
    });
  }

  onFournirSaved(): void {
    this.showModalFournir = false;
    this.showModalEditFournir = false;
    this.loadFournitures(this.fournisseur!.id!);
    this.loadDistributions();
  }
}