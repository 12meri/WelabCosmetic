import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Email } from '../models/email.model';
import { ApiResponse } from './api-response';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private url = 'http://localhost:8011/api/emails';

  // Header pour POST : API Platform attend du JSON-LD à la création.
  private headers = new HttpHeaders({ 'Content-Type': 'application/ld+json' });

  // Header pour PATCH : on n'envoie qu'une partie des champs, donc on
  // utilise le content-type "merge-patch+json" exigé par API Platform.
  private patchHeaders = new HttpHeaders({ 'Content-Type': 'application/merge-patch+json' });

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les emails depuis l'API.
   * Retourne un Observable d'un tableau d'Email.
   * Le `.pipe(map(...))` extrait le tableau du champ `member` de la
   * réponse JSON-LD (collection Hydra renvoyée par API Platform).
   */
  list(): Observable<Email[]> {
    return this.http
      .get<ApiResponse<Email>>(this.url, { observe: 'body', responseType: 'json' })
      .pipe(map((data) => data['member']));
  }

  /**
   * Récupère un email précis par son id.
   * Retourne un Observable d'un seul Email.
   */
  getById(id: number): Observable<Email> {
    return this.http.get<Email>(`${this.url}/${id}`);
  }

  /**
   * Crée un nouvel email côté serveur.
   * Retourne un Observable<boolean> qui vaut `true` si la réponse HTTP
   * a le statut 201 (Created), `false` sinon.
   * On ne transmet pas `dateEnvoie` : le backend la met automatiquement
   * dans le constructeur de l'entité Email.
   */
  create(email: Email): Observable<boolean> {
    const toSend = {
      sujet: email.sujet || null,
      txt: email.txt || null,
      demandeEchantillon: email.demandeEchantillon,
    };
    return this.http
      .post(this.url, toSend, { headers: this.headers, observe: 'response' })
      .pipe(map((response) => response.status === 201));
  }

  /**
   * Met à jour un email existant via PATCH.
   * On n'envoie que les champs réellement modifiés (merge-patch).
   * Retourne `true` si le statut HTTP est 200 ou 204.
   */
  update(id: number, email: Email): Observable<boolean> {
    const toSend: any = {};
    if (email.sujet !== undefined) toSend.sujet = email.sujet || null;
    if (email.txt !== undefined) toSend.txt = email.txt || null;
    if (email.demandeEchantillon !== undefined) toSend.demandeEchantillon = email.demandeEchantillon;

    return this.http
      .patch(`${this.url}/${id}`, toSend, { headers: this.patchHeaders, observe: 'response' })
      .pipe(map((response) => response.status === 200 || response.status === 204));
  }

  /**
   * Supprime un email par son id.
   * Retourne `true` si la suppression a renvoyé 200 ou 204.
   */
  delete(id: number): Observable<boolean> {
    return this.http
      .delete(`${this.url}/${id}`, { observe: 'response' })
      .pipe(map((response) => response.status === 200 || response.status === 204));
  }
}
