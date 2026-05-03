// fournir.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Fournir } from '../models/fournir.model';
import { ApiResponse } from './api-response';

@Injectable({
  providedIn: 'root'
})
export class FournirService {
  private apiUrl = 'http://localhost:8011/api/fournirs';
  private headers = new HttpHeaders({ 'Content-Type': 'application/ld+json' });

  constructor(private http: HttpClient) {}

  // la méthode getAll récupère tous les enregistrements de fournir à partir du backend Symfony. Elle envoie une requête GET à l'URL de l'API avec le paramètre "pagination=false" pour obtenir tous les résultats sans pagination. La réponse est ensuite transformée pour extraire le tableau de fournir à partir de la propriété "member" de la réponse JSON.
  getAll(): Observable<Fournir[]> {
    return this.http
      .get<ApiResponse<Fournir>>(`${this.apiUrl}?pagination=false`)
      .pipe(map(response => response['member']));
  }

  /**
   * Récupère les fournitures d'un fournisseur.
   * On tente le filtre API Platform ; si l'API renvoie tout (filtre non activé),
   * on filtre côté client sur l'IRI du fournisseur.
   */
  getByFournisseur(fournisseurId: number): Observable<Fournir[]> {
    const expectedIri = `/api/fournisseurs/${fournisseurId}`;
    // ?pagination=false pour tout récupérer, + filtre API Platform si activé
    const url = `${this.apiUrl}?pagination=false&fournisseur=${encodeURIComponent(expectedIri)}`;
    return this.http
      .get<ApiResponse<Fournir>>(url)
      .pipe(
        map(response => response['member']),
        // Filtre côté client en sécurité : couvre le cas où le filtre API n'est pas activé
        map(fournitures => fournitures.filter(f => {
          const fIri = typeof f.fournisseur === 'string'
            ? f.fournisseur
            : `/api/fournisseurs/${(f.fournisseur as any)?.id ?? ''}`;
          return fIri === expectedIri;
        }))
      );
  }

  // la méthode create permet de créer un nouvel enregistrement de fournir. Elle envoie une requête POST à l'URL de l'API avec les données du fournir dans le corps de la requête. Les données sont envoyées au format JSON avec l'en-tête "Content-Type" défini sur "application/ld+json". Si la création est réussie, elle retourne un Observable contenant le fournir créé.
  create(fournir: any): Observable<Fournir> {
    return this.http.post<Fournir>(this.apiUrl, fournir, { headers: this.headers });
  }

  // la méthode update permet de mettre à jour un enregistrement de fournir existant. Elle envoie une requête PATCH à l'URL de l'API avec l'ID du fournir dans l'URL et les données mises à jour dans le corps de la requête. Les données sont envoyées au format JSON avec l'en-tête "Content-Type" défini sur "application/merge-patch+json". Si la mise à jour est réussie, elle retourne un Observable contenant le fournir mis à jour.
  update(id: number, fournir: any): Observable<Fournir> {
    return this.http.patch<Fournir>(`${this.apiUrl}/${id}`, fournir, {
      headers: new HttpHeaders({ 'Content-Type': 'application/merge-patch+json' })
    });
  }
// la méthode delete permet de supprimer un enregistrement de fournir en fonction de son ID. Elle envoie une requête DELETE à l'URL de l'API avec l'ID du fournir dans l'URL. Si la suppression est réussie, elle retourne un Observable contenant void.
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}