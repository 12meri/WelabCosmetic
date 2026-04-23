import { Injectable } from '@angular/core';
import { ApiResponse } from './api-response';
import {  MatierePremiere} from "../models/matiere-premiere.model";
import { Observable } from 'rxjs';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Fournisseur } from '../models/fournisseur.model';
import { Distribution } from '../models/distribution.model';
@Injectable({
  providedIn: 'root', // le service est disponible dans toute l’app sans l’enregistrer manuellement
})
export class MatpremService {
private http: HttpClient; // peut ne pas etre declarer ici il suffit de la decalrer dans le parametre du constructeur sans linitialiser this.http ..
private url: string=  'http://localhost:8011/api/mat_premieres';
private headers = new HttpHeaders({ 'Content-Type': 'application/ld+json' });
// comme des etiquette pour transmettre des info : le contenu est format application/id+json suivent le standard JSON-LD (JSON for Linked Data) de APIPLATFORM
private patch_headers = new HttpHeaders({ 'Content-Type': 'application/merge-patch+json' });
   

// pour modification lentete doit etre application/merge-patch+json et pas id+json 
  private fournisseursUrl = '/api/fournirs';  // API des fournisseurs
  private distributeursUrl = '/api/distribues';  // API des distributeurs

// constructeur 
  constructor( http: HttpClient){
    this.http=http;
  }

/**
 * methode pour afficher toutes les matieres premieres
 *  
 * pipe le block de transfert de donne qui encapsule methos=de map
 * map permet de transformer des donnee dun type a un autre map(s,b) 
 * faut preciser ApiResponse pour lavoir de la forme member[leement]
*/
public  mplist(): Observable<Array<MatierePremiere>>{

  return this.http.get<ApiResponse<MatierePremiere>>(this.url, { observe: 'body', responseType: 'json'}).pipe(map((data) => data['member']))

} 


 getFournisseurs(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(this.fournisseursUrl);
  }

  // Récupérer tous les distributeurs (pour le select)
  getDistributeurs(): Observable<Distribution[]> {
    return this.http.get<Distribution[]>(this.distributeursUrl);
  }
    /**
   * Extrait la première lettre alphabétique (A-Z, a-z) du nom.
   * Si aucune lettre n'est trouvée, retourne '?'.
   */
  private extractCategorie(nomMP: string): string {
    const match = nomMP.match(/[A-Za-z]/);
    return match ? match[0].toUpperCase() : '?';
  }

   // Methode publique pour le composant (sans redondance)
  public getCategorieFromNom(nomMP: string): string {
    return this.extractCategorie(nomMP);
  }


/**
 * Créer une matière première
  * Création d'une matière première : on n'envoie que les champs requis.
  * Les fournisseurs,distribution, lots et demandes d'échantillon sont exclus (gérés séparément).
  * Envoyer ces champs, même vides, provoquerait des erreurs de validation.
 */ 
  createMp(mp: MatierePremiere): Observable<boolean> {

    const mpToSend = {
      nomMP: mp.nomMP,
      INCI: mp.INCI,
      NOI: mp.NOI || 0,
      categorie: this.extractCategorie(mp.nomMP), // calcul de la catégorie à partir du nom de la matière première
      fonction: mp.fonction,
      cosmos: mp.cosmos,
      //fournirs: mp.fournirs || [],  // Envoyer les IDs des fournisseurs sélectionnés
      //distribues: mp.distribues || []  // Envoyer les IDs des distributeurs sélectionnés
      // lots et demandeEchantillons ne sont PAS envoyés
    };
    
    return this.http.post(this.url, mpToSend, { 
      headers: this.headers, 
      observe: 'response' 
    }).pipe(
      map((response) => response.status === 201)
    );
  }
  

  // récupérer une matière première par id
  getMpById(id: number): Observable<MatierePremiere> {
    return this.http.get<MatierePremiere>(`${this.url}/${id}`);
  }

  // supprimer une matière première
  deleteMp(id: number): Observable<boolean> {
    return this.http.delete(`${this.url}/${id}`, {
      observe: 'response'
    }).pipe(
      map((response) => response.status === 200 || response.status === 204) 
    );
  }

  /* modifier une matière première
  * pour la modification on utilise patch et pas put car on ne veut pas envoyer tous les champs de la matière première, seulement ceux qui ont été modifiés, et patch permet de faire une mise à jour partielle alors que put nécessite d'envoyer tous les champs même ceux qui n'ont pas été modifiés
  * de plus pour patch l'entete doit etre application/merge-patch+json et pas application/id+json sinon on aura une erreur 415 Unsupported Media Type car le serveur ne reconnaît pas le format de données envoyé
  * Requête PATCH avec l’en‑tête application/merge-patch+json. Retourne true si la modification a réussi.
  */ 
  updateMp(id: number, mp: MatierePremiere): Observable<boolean> {
      const categorieCalculee = this.extractCategorie(mp.nomMP); // calcul de la catégorie à partir du nom de la matière première
      const mpToSend: any = {
        nomMP: mp.nomMP,
        INCI: mp.INCI,
        categorie: categorieCalculee,
        fonction: mp.fonction,
        cosmos: mp.cosmos
      };
        if (mp.NOI) {
        mpToSend.NOI = mp.NOI;
      }

      return this.http.patch(`${this.url}/${id}`, mpToSend, {
        headers: this.patch_headers,
        observe: 'response'
      }).pipe(
  map((response) => response.status === 200 || response.status === 204)    );
    }

  }
