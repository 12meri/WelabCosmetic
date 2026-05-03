import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ContactFournisseur } from "../models/contact-fournisseur.model";
import { ApiResponse } from "./api-response";

@Injectable({
  providedIn: "root",
})
export class ContactFournisseurService {
  private url = "http://localhost:8011/api/contact_fournisseurs";
  private headers = new HttpHeaders({ "Content-Type": "application/ld+json" });
  private patchHeaders = new HttpHeaders({ "Content-Type": "application/merge-patch+json" });

  constructor(private http: HttpClient) {}

  // les méthodes list, getById, create, update et delete permettent de gérer les opérations CRUD (Create, Read, Update, Delete) pour les contacts fournisseurs. La méthode list récupère la liste des contacts fournisseurs à partir du backend Symfony et retourne un Observable contenant un tableau de ContactFournisseur. La méthode getById récupère un contact fournisseur spécifique en fonction de son ID. Les méthodes create, update et delete permettent respectivement de créer un nouveau contact fournisseur, de mettre à jour un contact fournisseur existant et de supprimer un contact fournisseur en fonction de son ID.
  list(): Observable<ContactFournisseur[]> {
    return this.http
      .get<ApiResponse<ContactFournisseur>>(this.url, { observe: "body", responseType: "json" })
      .pipe(map((data) => data["member"]));
  }

  // la méthode getById permet de récupérer un contact fournisseur spécifique en fonction de son ID. Elle envoie une requête GET au backend Symfony avec l'ID du contact fournisseur dans l'URL et retourne un Observable contenant le contact fournisseur correspondant.
  getById(id: number): Observable<ContactFournisseur> {
    return this.http.get<ContactFournisseur>(`${this.url}/${id}`);
  }

  // la méthode create permet de créer un nouveau contact fournisseur. Elle envoie une requête POST au backend Symfony avec les données du contact fournisseur dans le corps de la requête. Si la création est réussie, elle retourne un Observable contenant un booléen indiquant si la réponse a un statut HTTP 201 (Created).
  create(contact: ContactFournisseur): Observable<boolean> {
    const toSend = {
      nom: contact.nom,
      prenom: contact.prenom || null,
      fonction: contact.fonction || null,
      email: contact.email || null,
      telContact: contact.telContact || null,
      fournisseur: contact.fournisseur || null,
    };
    return this.http
      .post(this.url, toSend, { headers: this.headers, observe: "response" })
      .pipe(map((response) => response.status === 201));
  }

  // la méthode update permet de mettre à jour un contact fournisseur existant. Elle envoie une requête PATCH au backend Symfony avec l'ID du contact fournisseur dans l'URL et les données mises à jour dans le corps de la requête. Si la mise à jour est réussie, elle retourne un Observable contenant un booléen indiquant si la réponse a un statut HTTP 200 (OK) ou 204 (No Content).
  update(id: number, contact: ContactFournisseur): Observable<boolean> {
    const toSend = {
      nom: contact.nom,
      prenom: contact.prenom || null,
      fonction: contact.fonction || null,
      email: contact.email || null,
      telContact: contact.telContact || null,
      fournisseur: contact.fournisseur || null,
    };
    return this.http
      .patch(`${this.url}/${id}`, toSend, { headers: this.patchHeaders, observe: "response" })
      .pipe(map((response) => response.status === 200 || response.status === 204));
  }

  // la méthode delete permet de supprimer un contact fournisseur en fonction de son ID. Elle envoie une requête DELETE au backend Symfony avec l'ID du contact fournisseur dans l'URL. Si la suppression est réussie, elle retourne un Observable contenant un booléen indiquant si la réponse a un statut HTTP 200 (OK) ou 204 (No Content).
  delete(id: number): Observable<boolean> {
    return this.http
      .delete(`${this.url}/${id}`, { observe: "response" })
      .pipe(map((response) => response.status === 200 || response.status === 204));
  }
}
