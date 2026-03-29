import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatierePremiere } from '../models/matiere-premiere.model';
import { ApiResponse } from './api-response';


@Injectable({
  providedIn: 'root'
})
export class MatierePremiereService {

  private apiUrl = 'http://localhost:8011/api/mat_premieres';

  constructor(private http: HttpClient) {
    console.log('Connecting to API:', this.apiUrl);
  }

  /** Récupère toutes les matières premières (format Hydra) */
  getAllMatieres(): Observable<ApiResponse<MatierePremiere>> {
    console.log('Fetching all matieres from:', this.apiUrl);
    return this.http.get<ApiResponse<MatierePremiere>>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /** Récupère une matière première par ID */
  getMatiere(id: number): Observable<MatierePremiere> {
    return this.http.get<MatierePremiere>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /** Crée une nouvelle matière première */
  createMatiere(matiere: MatierePremiere): Observable<MatierePremiere> {
    return this.http.post<MatierePremiere>(this.apiUrl, matiere).pipe(
      catchError(this.handleError)
    );
  }

  /** Met à jour une matière première */
  updateMatiere(id: number, matiere: MatierePremiere): Observable<MatierePremiere> {
    return this.http.put<MatierePremiere>(`${this.apiUrl}/${id}`, matiere).pipe(
      catchError(this.handleError)
    );
  }

  /** Supprime une matière première */
  deleteMatiere(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /** Gestion des erreurs API */
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMsg = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      errorMsg = `Erreur: ${error.error.message}`;
    } else {
      errorMsg = `Erreur ${error.status}: ${error.message}`;
    }

    return throwError(() => new Error(errorMsg));
  }
}
