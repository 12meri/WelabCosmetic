import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DocumentService } from '../../../services/document.service';
import { Document } from '../../../models/document.model';
import { LotService } from '../../../services/lots.service';
import { MatpremService } from '../../../services/matiere-premiere.service';
import { FournisseurService } from '../../../services/fournisseur.service';

@Component({
  selector: 'app-documents-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents-edit.component.html',
  styleUrl: './documents-edit.component.css',
})
export class DocumentsEdit implements OnInit {

  // Modèle du formulaire (sans champ fichier : un PATCH ne change que
  // les métadonnées, pas le fichier physique).
  document: Document = {
    nomFile: '',
    type: '',
  };

  // Tableaux d'IRI sélectionnés (alimentés au chargement de la ressource).
  selectedLots: string[] = [];
  selectedMatieres: string[] = [];
  selectedFournisseurs: string[] = [];

  // Listes auxiliaires pour les <select multiple>.
  lots: any[] = [];
  matieres: any[] = [];
  fournisseurs: any[] = [];

  id!: number;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private documentService: DocumentService,
    private lotService: LotService,
    private mpService: MatpremService,
    private fournisseurService: FournisseurService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.load();
    } else {
      this.errorMessage = ' ID introuvable';
    }
    this.loadLots();
    this.loadMatieres();
    this.loadFournisseurs();
  }

  /**
   * Charge le document depuis le backend et pré-remplit le formulaire.
   * Les relations ManyToMany arrivent sous forme de tableaux d'IRI ;
   * on les recopie dans selectedLots/Matieres/Fournisseurs pour que les
   * <select multiple> les pré-cochent automatiquement.
   */
  load(): void {
    this.isLoading = true;
    this.documentService.getById(this.id).subscribe({
      next: (data) => {
        this.document = data;
        this.selectedLots = data.lots || [];
        this.selectedMatieres = data.matieres || [];
        this.selectedFournisseurs = data.fournisseurs || [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erreur chargement :', error);
        this.errorMessage = ' Erreur lors du chargement';
        this.isLoading = false;
      },
    });
  }

  loadLots(): void {
    this.lotService.lotList().subscribe({
      next: (data) => {this.lots = data ; this.cdr.markForCheck()},
      error: (err) => console.error('Erreur chargement lots :', err),
    });
  }

  loadMatieres(): void {
    this.mpService.mplist().subscribe({
      next: (data) => {this.matieres = data ; this.cdr.markForCheck()},
      error: (err) => console.error('Erreur chargement matières :', err),
    });
  }

  loadFournisseurs(): void {
    this.fournisseurService.list().subscribe({
      next: (data) => {this.fournisseurs = data ; this.cdr.markForCheck()},
      error: (err) => console.error('Erreur chargement fournisseurs :', err),
    });
  }

  /**
   * Soumission : envoie un PATCH JSON (merge-patch+json) au backend.
   * Contrairement au POST qui utilise FormData multipart pour pouvoir
   * uploader le fichier, ici on envoie un objet JSON simple avec les
   * seules métadonnées modifiables. Le fichier physique reste inchangé.
   */
  update(): void {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload: Partial<Document> = {
      nomFile: this.document.nomFile,
      type: this.document.type,
      lots: this.selectedLots,
      matieres: this.selectedMatieres,
      fournisseurs: this.selectedFournisseurs,
    };

    this.documentService.update(this.id, payload).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = ' Document modifié avec succès !';
          setTimeout(() => this.router.navigate(['/documents']), 2000);
        } else {
          this.errorMessage = ' La modification a échoué';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur modification :', error);
        this.errorMessage = ' Erreur lors de la modification';
        this.isLoading = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/documents']);
  }
}
