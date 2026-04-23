// fournir.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Fournir } from '../models/fournir.model';
import { ApiResponse } from './api-response'; // adapte le chemin si nécessaire

@Injectable({
  providedIn: 'root'
})
export class FournirService {
  private apiUrl = 'http://localhost:8011/api/fournirs'; // adapte ton URL
  private headers = new HttpHeaders({ 'Content-Type': 'application/ld+json' });

  constructor(private http: HttpClient) {}

  // Récupérer toutes les fournitures (optionnel)
  getAll(): Observable<Fournir[]> {
    return this.http.get<ApiResponse<Fournir>>(this.apiUrl)
      .pipe(map(response => response['member']));
  }

  // Récupérer les fournitures d'un fournisseur spécifique
  getByFournisseur(fournisseurId: number): Observable<Fournir[]> {
    // Utilise le filtre de l'API Platform
    const url = `${this.apiUrl}?fournisseur=/api/fournisseurs/${fournisseurId}`;
    return this.http.get<ApiResponse<Fournir>>(url)
      .pipe(map(response => response['member']));
  }

  // Créer une nouvelle fourniture
  create(fournir: Fournir): Observable<Fournir> {
    // Construire le payload avec les IRI
    const payload = this.buildPayload(fournir);
    return this.http.post<Fournir>(this.apiUrl, payload, { headers: this.headers });
  }

  // Mettre à jour une fourniture
  update(id: number, fournir: Fournir): Observable<Fournir> {
    const payload = this.buildPayload(fournir);
    return this.http.patch<Fournir>(`${this.apiUrl}/${id}`, payload, {
      headers: new HttpHeaders({ 'Content-Type': 'application/merge-patch+json' })
    });
  }

  // Supprimer une fourniture
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Helper pour transformer les objets en IRI
  private buildPayload(fournir: Fournir): any {
    const payload: any = {};

    if (fournir.matPrem) {
      payload.matPrem = typeof fournir.matPrem === 'string'
        ? fournir.matPrem
        : `/api/mat_premieres/${fournir.matPrem.id}`;
    }
    if (fournir.fournisseur) {
      payload.fournisseur = typeof fournir.fournisseur === 'string'
        ? fournir.fournisseur
        : `/api/fournisseurs/${fournir.fournisseur.id}`;
    }
    if (fournir.distribution !== undefined) {
      payload.distribution = fournir.distribution
        ? (typeof fournir.distribution === 'string'
            ? fournir.distribution
            : `/api/distributions/${fournir.distribution.id}`)
        : null;
    }
    if (fournir.prix !== undefined) payload.prix = fournir.prix;
    if (fournir.moq !== undefined) payload.moq = fournir.moq;

    return payload;
  }
}