import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DemandeEchantillon } from '../models/demande-echantillon.model';
import { ApiResponse } from './api-response';

@Injectable({
  providedIn: 'root',
})
export class DemandeEchantillonService {

  private url: string = 'http://localhost:8011/api/demande_echantillons';

  private headers = new HttpHeaders({
    'Content-Type': 'application/ld+json'
  });

  constructor(private http: HttpClient) {}

  demandeList(): Observable<Array<DemandeEchantillon>> {
    return this.http.get<ApiResponse<DemandeEchantillon>>(this.url, {
      observe: 'body',
      responseType: 'json'
    }).pipe(
      map((data: any) => data['member'] || data['hydra:member'] || [])
    );
  }

  deleteDemande(id: number): Observable<boolean> {
    return this.http.delete(`${this.url}/${id}`, {
      observe: 'response'
    }).pipe(
      map((response) => response.status === 200 || response.status === 204)
    );
  }

  createDemande(demande: DemandeEchantillon): Observable<boolean> {
    const demandeToSend: any = {
      etat: demande.etat,
      fournisseur: demande.fournisseur,
      mp: demande.mp
    };

    if (demande.dateDemande) {
      demandeToSend.dateDemande = demande.dateDemande;
    }

    if (demande.delaiLivraison) {
      demandeToSend.delaiLivraison = demande.delaiLivraison;
    }

    if (demande.alerte) {
      demandeToSend.alerte = demande.alerte;
    }

    console.log('Payload demande envoyé :', demandeToSend);

    return this.http.post(this.url, demandeToSend, {
      headers: this.headers,
      observe: 'response'
    }).pipe(
      map((response) => response.status === 201)
    );
  }
}