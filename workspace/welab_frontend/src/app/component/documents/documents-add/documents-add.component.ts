import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { DocumentService } from '../../../services/document.service';
import { LotService } from '../../../services/lots.service';
import { MatpremService } from '../../../services/matiere-premiere.service';
import { FournisseurService } from '../../../services/fournisseur.service';

@Component({
  selector: 'app-documents-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents-add.component.html',
  styleUrl: './documents-add.component.css',
})
export class DocumentsAdd implements OnInit {

  // Modèle des champs texte du formulaire (lié via [(ngModel)]).
  // Le fichier physique n'est PAS dans cet objet : il est stocké à part
  // (selectedFile) parce que c'est un binaire qu'on n'envoie pas en JSON.
  document = {
    nomFile: '',
    type: '',
  };

  // Fichier capturé depuis l'<input type="file">. C'est un objet `File`
  // natif du navigateur (descend de Blob). On l'enverra tel quel via
  // FormData.append('file', selectedFile).
  selectedFile: File | null = null;

  // Tableaux d'IRI sélectionnés dans les multi-selects ManyToMany.
  // Format attendu par API Platform : "/api/lots/3", "/api/mat_premieres/5", etc.
  selectedLots: string[] = [];
  selectedMatieres: string[] = [];
  selectedFournisseurs: string[] = [];

  // Listes pour remplir les <select multiple>.
  lots: any[] = [];
  matieres: any[] = [];
  fournisseurs: any[] = [];

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private documentService: DocumentService,
    private lotService: LotService,
    private mpService: MatpremService,
    private fournisseurService: FournisseurService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLots();
    this.loadMatieres();
    this.loadFournisseurs();
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
   * Handler de l'événement (change) sur l'<input type="file">.
   * `event.target` est l'élément DOM input. Sa propriété `files` est une
   * FileList (sorte de tableau read-only). On prend le premier fichier
   * (`files[0]`) parce que l'input n'a pas l'attribut `multiple`.
   * Si l'utilisateur annule la boîte de dialogue, files est vide → null.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  /**
   * Soumission : on construit un FormData et on l'envoie au service.
   *
   * Pourquoi multipart/form-data et pas application/ld+json ?
   * Parce qu'on uploade un FICHIER BINAIRE en plus de champs texte ;
   * JSON ne sait pas porter de binaire. Le format multipart sépare chaque
   * champ par un boundary et permet de mélanger texte + binaire dans une
   * même requête HTTP. L'entité Document côté backend est configurée pour
   * recevoir ce format (inputFormats: ['multipart' => ['multipart/form-data']]).
   */
  create(): void {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.selectedFile) {
      this.errorMessage = ' Veuillez sélectionner un fichier';
      this.isLoading = false;
      return;
    }

    // Construction du FormData étape par étape :
    const formData = new FormData();

    // 1) Le fichier physique sous la clé "file" (correspond à la propriété
    //    Vich `#[Vich\UploadableField(... fileNameProperty: 'fileName')]`
    //    côté Document.php : VichUploader sait qu'il doit lire la partie
    //    multipart nommée "file").
    formData.append('file', this.selectedFile);

    // 2) Les métadonnées texte : un append() par champ.
    formData.append('nomFile', this.document.nomFile);
    if (this.document.type) {
      formData.append('type', this.document.type);
    }

    // 3) Les relations ManyToMany : on append PLUSIEURS FOIS la même clé,
    //    suffixée par "[]". C'est la convention multipart standard pour
    //    transmettre un tableau (PHP/Symfony reconstruit "$data['lots']"
    //    sous forme d'array à partir de cette syntaxe).
    //    Chaque valeur est une IRI au format "/api/lots/3".
    this.selectedLots.forEach((iri) => formData.append('lots[]', iri));
    this.selectedMatieres.forEach((iri) => formData.append('matieres[]', iri));
    this.selectedFournisseurs.forEach((iri) => formData.append('fournisseurs[]', iri));

    // À noter : on n'ajoute PAS d'en-tête Content-Type ici. Le navigateur
    // génère automatiquement un boundary aléatoire et construit l'en-tête
    // multipart/form-data; boundary=----... Si on forçait le Content-Type
    // à la main, on écraserait ce boundary et le serveur ne pourrait plus
    // parser le payload.
    this.documentService.create(formData).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = ' Document uploadé avec succès !';
          this.resetForm();
          setTimeout(() => this.router.navigate(['/documents']), 2000);
        } else {
          this.errorMessage = ' L\'upload a échoué';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur upload :', error);
        this.errorMessage = ' Erreur lors de l\'upload';
        this.isLoading = false;
      },
    });
  }

  resetForm(): void {
    this.document = { nomFile: '', type: '' };
    this.selectedFile = null;
    this.selectedLots = [];
    this.selectedMatieres = [];
    this.selectedFournisseurs = [];
  }

  cancel(): void {
    this.router.navigate(['/documents']);
  }
}
