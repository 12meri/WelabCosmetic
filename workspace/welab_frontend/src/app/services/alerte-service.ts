import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alerte } from '../models/alerte';
import { ApiResponse } from './api-response';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class AlerteService {

  private url = 'http://localhost:8011/api/alertes'; // URL de votre API
  private headers = new HttpHeaders({ 'Content-Type': 'application/ld+json' });
  private patch_headers = new HttpHeaders({ 'Content-Type': 'application/merge-patch+json' });

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer la liste des alertes
  getAlertes(): Observable<Alerte[]> {
    return this.http.get<ApiResponse<Alerte>>(this.url, { 
      observe: 'body', 
      responseType: 'json' 
    }).pipe( 
      map((data) => {
        console.log('Données reçues:', data); // Debug
        return data.member; // Utiliser data.member au lieu de data['member']
      })
    );
  }
 
  // Récupérer une alerte par son ID
  getAlerteById(id: number): Observable<Alerte> {
    return this.http.get<Alerte>(`${this.url}/${id}`);
  }
  // Modifier une alerte
  updateAlerte(id: number, alerte: Partial<Alerte>): Observable<boolean> {
    return this.http.patch(`${this.url}/${id}`, alerte, {
      headers: this.patch_headers,
      observe: 'response'
    }).pipe(
      map((response) => response.status === 200 || response.status === 204)
    );
  }

// Créer une nouvelle alerte
  createAlerte(alerte: Partial<Alerte>): Observable<boolean> {
    return this.http.post(this.url, alerte, {
      headers: this.headers,
      observe: 'response'
    }).pipe(
      map((response) => response.status === 201)
    );
  }
// Supprimer une alerte
  deleteAlerte(id: number): Observable<boolean> {
    return this.http.delete(`${this.url}/${id}`, {
      observe: 'response'
    }).pipe(
      map((response) => response.status === 200 || response.status === 204)
    );
  }

  



// Récupérer les alertes d'un lot spécifique
  getAlertesByLot(lotId: number): Observable<Alerte[]> {
    return this.http.get<ApiResponse<Alerte>>(`${this.url}?lot=${lotId}`, {
      observe: 'body',
      responseType: 'json'
    }).pipe(
      map((data) => data['member'])
    );
  }
  // Récupérer les alertes par état (ACTIVE, TRAITEE, IGNOREE)
  getAlertesByEtat(etat: string): Observable<Alerte[]> {
    return this.http.get<ApiResponse<Alerte>>(`${this.url}?etatAlerte=${etat}`, {
      observe: 'body',
      responseType: 'json'
    }).pipe(
      map((data) => data['member'])
    );
  }
}
