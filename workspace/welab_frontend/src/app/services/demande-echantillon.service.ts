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

  // liste des demandes d'échantillons. Elle envoie une requête GET au backend Symfony pour récupérer la liste des demandes d'échantillons. La réponse est ensuite transformée pour extraire le tableau de demandes d'échantillons à partir de la propriété "member" ou "hydra:member" de la réponse JSON.
  demandeList(): Observable<Array<DemandeEchantillon>> {
    return this.http.get<ApiResponse<DemandeEchantillon>>(this.url, {
      observe: 'body',
      responseType: 'json'
    }).pipe(
      map((data: any) => data['member'] || data['hydra:member'] || [])
    );
  }

  // la méthode deleteDemande permet de supprimer une demande d'échantillon en fonction de son ID. Elle envoie une requête DELETE au backend Symfony avec l'ID de la demande d'échantillon dans l'URL. Si la suppression est réussie, elle retourne un Observable contenant un booléen indiquant si la réponse a un statut HTTP 200 (OK) ou 204 (No Content).
  deleteDemande(id: number): Observable<boolean> {
    return this.http.delete(`${this.url}/${id}`, {
      observe: 'response'
    }).pipe(
      map((response) => response.status === 200 || response.status === 204)
    );
  }

  //  la méthode createDemande permet de créer une nouvelle demande d'échantillon. Elle envoie une requête POST au backend Symfony avec les données de la demande d'échantillon dans le corps de la requête. Si la création est réussie, elle retourne un Observable contenant un booléen indiquant si la réponse a un statut HTTP 201 (Created).
  // ensuite la méthode createDemande construit un objet demandeToSend à partir de l'objet demande passé en paramètre. Elle inclut les propriétés obligatoires (etat, fournisseur, mp) et ajoute les propriétés optionnelles (dateDemande, delaiLivraison, alerte) si elles sont présentes dans l'objet demande. Ensuite, elle envoie la requête POST avec cet objet demandeToSend comme corps de la requête.
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