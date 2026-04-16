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

  list(): Observable<ContactFournisseur[]> {
    return this.http
      .get<ApiResponse<ContactFournisseur>>(this.url, { observe: "body", responseType: "json" })
      .pipe(map((data) => data["member"]));
  }

  getById(id: number): Observable<ContactFournisseur> {
    return this.http.get<ContactFournisseur>(`${this.url}/${id}`);
  }

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

  delete(id: number): Observable<boolean> {
    return this.http
      .delete(`${this.url}/${id}`, { observe: "response" })
      .pipe(map((response) => response.status === 200 || response.status === 204));
  }
}
