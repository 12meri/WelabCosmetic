import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Document } from '../models/document.model';
import { ApiResponse } from './api-response';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private url = 'http://localhost:8011/api/documents';

  // Header pour PATCH : on n'envoie qu'une partie des champs (seulement
  // les métadonnées, pas le fichier physique), donc on utilise le
  // content-type "merge-patch+json" exigé par API Platform.
  private patchHeaders = new HttpHeaders({ 'Content-Type': 'application/merge-patch+json' });

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les documents depuis l'API.
   * `.pipe(map(...))` extrait le tableau du champ `member` de la
   * réponse JSON-LD (collection Hydra renvoyée par API Platform).
   */
  list(): Observable<Document[]> {
    return this.http
      .get<ApiResponse<Document>>(this.url, { observe: 'body', responseType: 'json' })
      .pipe(map((data) => data['member']));
  }

  /** Récupère un document précis par son id. */
  getById(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.url}/${id}`);
  }

  /**
   * Crée un nouveau document côté serveur en uploadant un fichier physique
   * + des métadonnées + des relations ManyToMany.
   *
   * POURQUOI multipart/form-data au lieu de application/ld+json ?
   * Parce qu'on transmet un FICHIER BINAIRE (PDF, image, etc.) en plus des
   * champs texte. JSON ne peut pas porter de binaire (sauf en base64, ce qui
   * gonfle la taille de ~33 % et n'est pas le standard sur API Platform).
   * Le format multipart sépare chaque champ par un "boundary" et permet de
   * mélanger texte + binaire dans une même requête HTTP.
   *
   * POURQUOI on n'ajoute PAS d'en-tête Content-Type manuellement ?
   * Quand on passe un objet `FormData` à HttpClient, le navigateur génère
   * automatiquement un boundary aléatoire et construit l'en-tête
   * `Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryXXX`.
   * Si on force nous-mêmes un Content-Type, on écrase ce boundary et le
   * serveur ne peut PLUS parser le payload (erreur 400 / 415).
   *
   * L'entité Document côté backend est configurée avec
   * `inputFormats: ['multipart' => ['multipart/form-data']]` pour le POST,
   * ce qui dit à API Platform d'attendre ce format.
   */
  create(formData: FormData): Observable<boolean> {
    return this.http
      .post(this.url, formData, { observe: 'response' })
      .pipe(map((response) => response.status === 201));
  }

  /**
   * Met à jour un document existant via PATCH.
   *
   * IMPORTANT : on utilise application/merge-patch+json (PAS multipart) ici.
   * Pourquoi ? Parce qu'API Platform standard n'accepte pas de réuploader
   * un fichier physique via PATCH multipart : le fichier ne change pas en
   * édition, seules les métadonnées (nomFile, type) et les relations
   * ManyToMany (lots, matieres, fournisseurs) peuvent être modifiées.
   *
   * Si l'utilisateur veut REMPLACER le fichier physique, il faut supprimer
   * le document et en créer un nouveau (workflow standard avec VichUploader).
   */
  update(id: number, document: Partial<Document>): Observable<boolean> {
    const toSend: any = {};
    if (document.nomFile !== undefined) toSend.nomFile = document.nomFile;
    if (document.type !== undefined) toSend.type = document.type || null;
    if (document.lots !== undefined) toSend.lots = document.lots;
    if (document.matieres !== undefined) toSend.matieres = document.matieres;
    if (document.fournisseurs !== undefined) toSend.fournisseurs = document.fournisseurs;

    return this.http
      .patch(`${this.url}/${id}`, toSend, { headers: this.patchHeaders, observe: 'response' })
      .pipe(map((response) => response.status === 200 || response.status === 204));
  }

  /** Supprime un document par son id. */
  delete(id: number): Observable<boolean> {
    return this.http
      .delete(`${this.url}/${id}`, { observe: 'response' })
      .pipe(map((response) => response.status === 200 || response.status === 204));
  }
}
