import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { EmailService } from '../../../services/email.service';
import { Email } from '../../../models/email.model';
import { DemandeEchantillonService } from '../../../services/demande-echantillon.service';
import { DemandeEchantillon } from '../../../models/demande-echantillon.model';
import { MatpremService } from '../../../services/matiere-premiere.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-emails-list',
  standalone: true,
  imports: [AsyncPipe, CommonModule, RouterLink, DatePipe],
  templateUrl: './emails-list.html',
  styleUrl: './emails-list.css',
})
export class EmailsList implements OnInit {

  // Liste affichée dans le template, assignée en une seule fois après
  // que toutes les ressources liées (caches d'IRI) soient chargées.
  emails: Email[] = [];

  // Caches locaux pour pouvoir traduire les IRIs (string) en données
  // lisibles : nom du fournisseur, nom de la matière, etc.
  demandes: any[] = [];
  fournisseurs: any[] = [];
  matieresPremieres: any[] = [];

  // Etat de la modale de confirmation de suppression.
  showDeleteModal = false;
  selectedId: number | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(
    private emailService: EmailService,
    private demandeService: DemandeEchantillonService,
    private mpService: MatpremService,
    private http: HttpClient
  ) {}

  /**
   * Au chargement du composant : récupère la liste des emails ainsi
   * que toutes les ressources liées (demandes, fournisseurs, matières)
   * pour pouvoir afficher des libellés humains au lieu de simples IRIs.
   */
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
      emails: this.emailService.list(),
      demandes: this.demandeService.demandeList(),
      fournisseurs: this.http.get<any>('http://localhost:8011/api/fournisseurs'),
      matieresPremieres: this.mpService.mplist(),
    }).subscribe({
      next: (data) => {
        this.demandes = data.demandes;
        this.fournisseurs = data.fournisseurs.member || data.fournisseurs['hydra:member'] || [];
        this.matieresPremieres = data.matieresPremieres;
        this.emails = data.emails;
      },
      error: (err) => {
        console.error('Erreur chargement :', err);
        this.errorMessage = '❌ Erreur lors du chargement';
      },
    });
  }

  // `track` pour @for : aide Angular à ré-utiliser les lignes du tableau
  // au lieu de tout recréer quand la liste change.
  trackById(index: number, item: Email) {
    return item.id;
  }

  /**
   * Résout l'IRI de la demande en un libellé lisible :
   * "Demande #ID - Fournisseur - Matière".
   * On doit faire ça manuellement parce qu'API Platform retourne les
   * relations sous forme de chaîne IRI ("/api/demande_echantillons/1")
   * et non pas l'objet complet.
   */
  getDemandeLabel(iri: string | undefined): string {
    if (!iri) return '';

    const demande: any = this.demandes.find((d: any) =>
      d['@id'] === iri || `/api/demande_echantillons/${d.id}` === iri
    );
    if (!demande) return iri;

    const fournisseur = this.fournisseurs.find((f: any) =>
      f['@id'] === demande.fournisseur || `/api/fournisseurs/${f.id}` === demande.fournisseur
    );
    const mp = this.matieresPremieres.find((m: any) =>
      m['@id'] === demande.mp || `/api/mat_premieres/${m.id}` === demande.mp
    );

    const fournLabel = fournisseur ? (fournisseur.nomEntr || `Fournisseur ${fournisseur.id}`) : '';
    const mpLabel = mp ? (mp.nomMP || `MP ${mp.id}`) : '';

    return `Demande #${demande.id} - ${fournLabel} - ${mpLabel}`;
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

  /**
   * Confirme la suppression : appelle le service, puis recharge la liste.
   * `subscribe` déclenche réellement la requête HTTP : sans cet appel,
   * Observable reste "froid" et rien ne part vers le serveur.
   */
  confirmDelete(): void {
    if (this.selectedId === null) return;

    this.successMessage = '';
    this.errorMessage = '';

    this.emailService.delete(this.selectedId).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = '✅ Email supprimé avec succès';
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
