import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Distribue } from '../models/distribue.model';

@Injectable({ providedIn: 'root' })
export class DistribueService {
  private apiUrl = 'http://localhost:8011/api/distribues';

  constructor(private http: HttpClient) {}

  // la méthode getAll récupère tous les enregistrements de distribue à partir du backend Symfony. Elle envoie une requête GET à l'URL de l'API avec le paramètre "pagination=false" pour obtenir tous les résultats sans pagination. La réponse est ensuite transformée pour extraire le tableau de distribue à partir de la propriété "member" de la réponse JSON.
  getAll(): Observable<Distribue[]> {
    return this.http.get<{ member: Distribue[] }>(`${this.apiUrl}?pagination=false`)
      .pipe(map(res => res.member));
  }

  // la méthode getByDistributionAndMp permet de récupérer les enregistrements de distribue en fonction de l'ID de la distribution et de l'ID de la matière première. Elle construit les IRI (Internationalized Resource Identifier) pour la distribution et la matière première en utilisant leurs ID respectifs, puis envoie une requête GET à l'URL de l'API avec les paramètres de filtrage correspondants. La réponse est ensuite transformée pour extraire le tableau de distribue à partir de la propriété "member" de la réponse JSON.
  getByDistributionAndMp(distributionId: number, mpId: number): Observable<Distribue[]> {
    const distIri = `/api/distributions/${distributionId}`;
    const mpIri = `/api/mat_premieres/${mpId}`;
    return this.http.get<{ member: Distribue[] }>(
      `${this.apiUrl}?pagination=false&distribution=${encodeURIComponent(distIri)}&mp=${encodeURIComponent(mpIri)}`
    ).pipe(map(res => res.member));
  }

  // la méthode create permet de créer un nouvel enregistrement de distribue. Elle envoie une requête POST à l'URL de l'API avec les données du distribue dans le corps de la requête. Les données sont envoyées au format JSON avec l'en-tête "Content-Type" défini sur "application/ld+json". Si la création est réussie, elle retourne un Observable contenant le distribue créé.
  create(data: any): Observable<Distribue> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/ld+json' });
    return this.http.post<Distribue>(this.apiUrl, data, { headers });
  }

  //  la méthode update permet de mettre à jour un enregistrement de distribue existant. Elle envoie une requête PATCH à l'URL de l'API avec l'ID du distribue dans l'URL et les données mises à jour dans le corps de la requête. Les données sont envoyées au format JSON avec l'en-tête "Content-Type" défini sur "application/merge-patch+json". Si la mise à jour est réussie, elle retourne un Observable contenant le distribue mis à jour.
  update(id: number, data: any): Observable<Distribue> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/merge-patch+json' });
    return this.http.patch<Distribue>(`${this.apiUrl}/${id}`, data, { headers });
  }

  // la méthode delete permet de supprimer un enregistrement de distribue en fonction de son ID. Elle envoie une requête DELETE à l'URL de l'API avec l'ID du distribue dans l'URL. Si la suppression est réussie, elle retourne un Observable contenant void.
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}