import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Distribution } from '../models/distribution.model';
import { ApiResponse } from './api-response';

@Injectable({
  providedIn: 'root',
})
export class DistributionService {
  private url = 'http://localhost:8011/api/distributions';
  private headers = new HttpHeaders({ 'Content-Type': 'application/ld+json' });
  private patchHeaders = new HttpHeaders({ 'Content-Type': 'application/merge-patch+json' });

  constructor(private http: HttpClient) {}

  
  list(): Observable<Distribution[]> {
    return this.http
      .get<ApiResponse<Distribution>>(`${this.url}?pagination=false`, { observe: 'body', responseType: 'json' })
      .pipe(map((data) => data['member']));
  }

  getById(id: number): Observable<Distribution> {
    return this.http.get<Distribution>(`${this.url}/${id}`);
  }

  // distribution.service.ts - Version debug
create(distribution: Distribution): Observable<boolean> {
  // ✅ Vérifier que fournisseur n'est pas null/undefined/vide
  if (!distribution.fournisseur) {
    console.error('❌ Pas de fournisseur sélectionné !');
    throw new Error('Fournisseur requis');
  }

  const toSend = {
    nomMarque: distribution.nomMarque,
    fournisseur: distribution.fournisseur,
  };
  
  console.log('📤 Envoi à l\'API:', JSON.stringify(toSend, null, 2));

  return this.http
    .post(this.url, toSend, { 
      headers: this.headers, 
      observe: 'response' 
    })
    .pipe(
      map((response) => {
        console.log('✅ Réponse status:', response.status);
        console.log('✅ Réponse body:', response.body);
        return response.status === 201;
      }),
      catchError((error) => {
        console.error('❌ Erreur détaillée:', error);
        if (error.error?.detail) {
          console.error('Détail:', error.error.detail);
        }
        if (error.error?.violations) {
          console.error('Violations:', error.error.violations);
        }
        throw error;
      })
    );
}

  update(id: number, distribution: Distribution): Observable<boolean> {
    const toSend = {
      nomMarque: distribution.nomMarque,
      fournisseur: distribution.fournisseur ,
    };
    return this.http
      .patch(`${this.url}/${id}`, toSend, { headers: this.patchHeaders, observe: 'response' })
      .pipe(map((response) => response.status === 200 || response.status === 204));
  }

  delete(id: number): Observable<boolean> {
    return this.http
      .delete(`${this.url}/${id}`, { observe: 'response' })
      .pipe(map((response) => response.status === 200 || response.status === 204));
  }
}
