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

  private headers = new HttpHeaders({'Content-Type': 'application/ld+json'});

  private patchHeaders = new HttpHeaders({'Content-Type': 'application/merge-patch+json'});

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

  // Récupérer un lot
  getLotById(id: number): Observable<Lot> {
    return this.http.get<Lot>(`${this.url}/${id}`);
  }

  // Ajouter un lot 
  createLot(lot: Lot): Observable<boolean> {
    const lotToSend: any = {
      numLot: lot.numLot, // est unique
      qtInitiale: String(lot.qtInitiale), // 🔥 IMPORTANT
      etat: lot.etat || 'OK',
      mp: lot.mp // peut pas etre null
    };

    // 
    if (lot.dateArrivee) {
      lotToSend.dateArrivee = lot.dateArrivee;
    }

    if (lot.ddm) {
      lotToSend.ddm = lot.ddm;
    }

    if (lot.qtRestante !== '' && lot.qtRestante !== undefined) {
      lotToSend.qtRestante = String(lot.qtRestante); // 🔥
    }

    if (lot.dateMaj) {
      lotToSend.dateMaj = lot.dateMaj;
    }

    if (lot.qtMin !== '' && lot.qtMin !== undefined) {
      lotToSend.qtMin = String(lot.qtMin); // 🔥
    }

    if (lot.demandeEchantillon) {
      lotToSend.demandeEchantillon = lot.demandeEchantillon;
    }

    // TODO: Ajouter champs document

    console.log('Payload envoyé :', lotToSend);

    return this.http.post(this.url, lotToSend, {
      headers: this.headers,
      observe: 'response'
    }).pipe(
      map((response) => {
        console.log('Réponse POST :', response);
        return response.status === 201;
      })
    );
  }

  // Mettre à jour un lot
  updateLot(id: number, lot: Lot): Observable<boolean> {
    const lotToSend: any = {
      numLot: lot.numLot,
      qtInitiale: String(lot.qtInitiale), // 🔥
      etat: lot.etat || 'OK',
      mp: lot.mp
    };


    // Seuls les champs présents dans lotToSend seront mis à jour, les autres resteront inchangés
    if (lot.dateArrivee) {
      lotToSend.dateArrivee = lot.dateArrivee;
    }

    if (lot.ddm) {
      lotToSend.ddm = lot.ddm;
    }

    if (lot.qtRestante !== '' && lot.qtRestante !== undefined) {
      lotToSend.qtRestante = String(lot.qtRestante); // 🔥
    }

    if (lot.dateMaj) {
      lotToSend.dateMaj = lot.dateMaj;
    }

    if (lot.qtMin !== '' && lot.qtMin !== undefined) {
      lotToSend.qtMin = String(lot.qtMin); // 🔥
    }

    if (lot.demandeEchantillon) {
      lotToSend.demandeEchantillon = lot.demandeEchantillon;
    }

    // TODO: Ajouter champs document

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