import { Component, NgZone, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { DocumentService } from '../../../services/document.service';
import { Document } from '../../../models/document.model';
import { LotService } from '../../../services/lots.service';
import { MatpremService } from '../../../services/matiere-premiere.service';
import { FournisseurService } from '../../../services/fournisseur.service';

@Component({
  selector: 'app-documents-list',
  standalone: true,
  imports: [AsyncPipe, CommonModule, RouterLink, DatePipe],
  templateUrl: './documents-list.html',
  styleUrl: './documents-list.css',
})
export class DocumentsList implements OnInit {

  // Liste affichée dans le template, assignée en une seule fois après
  // que toutes les ressources liées (caches d'IRI) soient chargées.
  documents: Document[] = [];

  // Caches locaux pour traduire les IRI ManyToMany en libellés lisibles.
  lots: any[] = [];
  matieres: any[] = [];
  fournisseurs: any[] = [];

  // Préfixe public servi par Symfony (config vich_uploader.yaml :
  // uri_prefix: /uploads/documents). On l'utilise pour construire le
  // lien de téléchargement direct vers le fichier physique.
  // TODO: vérifier qu'au runtime la route /uploads/documents/{fileName}
  //       est bien exposée par le backend (sinon ajuster l'URL ici).
  readonly uploadsBaseUrl = 'http://localhost:8011/uploads/documents';

  // Modale de confirmation de suppression.
  showDeleteModal = false;
  selectedId: number | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(
    private documentService: DocumentService,
    private lotService: LotService,
    private mpService: MatpremService,
    private fournisseurService: FournisseurService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    // setTimeout 0 pour laisser le tour de boucle initial finir
    // (route activée, JWT interceptor prêt, change detection initialisée)
    // avant de lancer les requêtes HTTP. Évite l'effet "page vide au premier clic".
    setTimeout(() => this.loadAll(), 0);
  }

  loadAll(): void {
    // forkJoin attend que TOUS les Observables émettent leur valeur,
    // puis on assigne tout EN UNE FOIS. Comme ça les fonctions de résolution
    // d'IRI ne sont jamais appelées avec des caches vides, et le tableau
    // s'affiche complet d'un coup.
    forkJoin({
      documents: this.documentService.list(),
      lots: this.lotService.lotList(),
      matieres: this.mpService.mplist(),
      fournisseurs: this.fournisseurService.list(),
    }).subscribe({
      next: (data) => {
        this.lots = data.lots;
        this.matieres = data.matieres;
        this.fournisseurs = data.fournisseurs;
        this.documents = data.documents;
      },
      error: (err) => {
        console.error('Erreur chargement :', err);
        this.errorMessage = '❌ Erreur lors du chargement';
      },
    });
  }

  trackById(index: number, item: Document) {
    return item.id;
  }

  /**
   * Résout un tableau d'IRI lots → "Lot1, Lot2".
   * On compare l'IRI reçue ("/api/lots/3") aux entrées du cache local
   * (soit via leur champ '@id', soit en recomposant /api/lots/{id}).
   * Cette double comparaison est nécessaire parce que `@id` n'est pas
   * toujours présent sur toutes les ressources sérialisées.
   */
  getLotsLabels(iris: string[] | undefined): string {
    if (!iris || iris.length === 0) return '-';
    return iris
      .map((iri) => {
        const lot: any = this.lots.find((l: any) =>
          l['@id'] === iri || `/api/lots/${l.id}` === iri
        );
        return lot ? (lot.numLot || `Lot ${lot.id}`) : iri;
      })
      .join(', ');
  }

  /** Résout un tableau d'IRI matières → "Argan, Karité". */
  getMatieresLabels(iris: string[] | undefined): string {
    if (!iris || iris.length === 0) return '-';
    return iris
      .map((iri) => {
        const mp: any = this.matieres.find((m: any) =>
          m['@id'] === iri || `/api/mat_premieres/${m.id}` === iri
        );
        return mp ? (mp.nomMP || `MP ${mp.id}`) : iri;
      })
      .join(', ');
  }

  /** Résout un tableau d'IRI fournisseurs → "Cosmélab, Provence Bio". */
  getFournisseursLabels(iris: string[] | undefined): string {
    if (!iris || iris.length === 0) return '-';
    return iris
      .map((iri) => {
        const f: any = this.fournisseurs.find((x: any) =>
          x['@id'] === iri || `/api/fournisseurs/${x.id}` === iri
        );
        return f ? (f.nomEntr || `Fournisseur ${f.id}`) : iri;
      })
      .join(', ');
  }

  /**
   * Construit l'URL absolue de téléchargement à partir du fileName
   * stocké en base par VichUploader.
   */
  getDownloadUrl(fileName: string | undefined): string {
    if (!fileName) return '#';
    return `${this.uploadsBaseUrl}/${fileName}`;
  }

  // --- Modale de suppression ----------------------------------------

  openDeleteModal(id: number): void {
    this.selectedId = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedId = null;
  }

  confirmDelete(): void {
    if (this.selectedId === null) return;

    this.successMessage = '';
    this.errorMessage = '';

    this.documentService.delete(this.selectedId).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = '✅ Document supprimé avec succès';
          this.loadAll();
        } else {
          this.errorMessage = '❌ La suppression a échoué';
        }
        this.closeDeleteModal();
      },
      error: (error) => {
        console.error('Erreur suppression :', error);
        this.errorMessage = '❌ Erreur lors de la suppression';
        this.closeDeleteModal();
      },
    });
  }
}
