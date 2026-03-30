import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Lot } from '../models/lots.model';
import { ApiResponse } from './api-response';

@Injectable({
  providedIn: 'root',
})
export class LotService {

  private url: string = 'http://localhost:8011/api/lots';

  private headers = new HttpHeaders({
    'Content-Type': 'application/ld+json'
  });

  private patchHeaders = new HttpHeaders({
    'Content-Type': 'application/merge-patch+json'
  });

  constructor(private http: HttpClient) {}

  // Liste des lots
  lotList(): Observable<Array<Lot>> {
    return this.http.get<ApiResponse<Lot>>(this.url, {
      observe: 'body',
      responseType: 'json'
    }).pipe(
      map((data) => data['member'])
    );
  }

  // Récupérer un lot par id
  getLotById(id: number): Observable<Lot> {
    return this.http.get<Lot>(`${this.url}/${id}`);
  }

  // Ajouter un lot
  createLot(lot: Lot): Observable<boolean> {
    const lotToSend = {
      numLot: lot.numLot,
      dateArrivee: lot.dateArrivee || null,
      ddm: lot.ddm || null,
      qtInitiale: lot.qtInitiale,
      qtRestante: lot.qtRestante || null,
      dateMaj: lot.dateMaj || null,
      qtMin: lot.qtMin || null,
      etat: lot.etat || 'OK',
      mp: lot.mp,
      demandeEchantillon: lot.demandeEchantillon || null
    };

    return this.http.post(this.url, lotToSend, {
      headers: this.headers,
      observe: 'response'
    }).pipe(
      map((response) => response.status === 201)
    );
  }

  // Modifier un lot
  updateLot(id: number, lot: Lot): Observable<boolean> {
    const lotToSend = {
      numLot: lot.numLot,
      dateArrivee: lot.dateArrivee || null,
      ddm: lot.ddm || null,
      qtInitiale: lot.qtInitiale,
      qtRestante: lot.qtRestante || null,
      dateMaj: lot.dateMaj || null,
      qtMin: lot.qtMin || null,
      etat: lot.etat || 'OK',
      mp: lot.mp,
      demandeEchantillon: lot.demandeEchantillon || null
    };

    return this.http.patch(`${this.url}/${id}`, lotToSend, {
      headers: this.patchHeaders,
      observe: 'response'
    }).pipe(
      map((response) => response.status === 200 || response.status === 204)
    );
  }

  // Supprimer un lot
  deleteLot(id: number): Observable<boolean> {
    return this.http.delete(`${this.url}/${id}`, {
      observe: 'response'
    }).pipe(
      map((response) => response.status === 200 || response.status === 204)
    );
  }
}