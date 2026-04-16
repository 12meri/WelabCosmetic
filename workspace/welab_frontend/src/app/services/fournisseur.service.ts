import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Fournisseur } from '../models/fournisseur.model';
import { ApiResponse } from './api-response';

@Injectable({
  providedIn: 'root',
})
export class FournisseurService {
  private url = 'http://localhost:8011/api/fournisseurs';
  private headers = new HttpHeaders({ 'Content-Type': 'application/ld+json' });
  private patchHeaders = new HttpHeaders({ 'Content-Type': 'application/merge-patch+json' });

  constructor(private http: HttpClient) {}

  list(): Observable<Fournisseur[]> {
    return this.http
      .get<ApiResponse<Fournisseur>>(this.url, { observe: 'body', responseType: 'json' })
      .pipe(map((data) => data['member']));
  }

  getById(id: number): Observable<Fournisseur> {
    return this.http.get<Fournisseur>(`${this.url}/${id}`);
  }

  create(fournisseur: Fournisseur): Observable<boolean> {
    const toSend = {
      nomEntr: fournisseur.nomEntr,
      adresse: fournisseur.adresse || null,
      emailGen: fournisseur.emailGen || null,
      telFourni: fournisseur.telFourni || null,
    };
    return this.http
      .post(this.url, toSend, { headers: this.headers, observe: 'response' })
      .pipe(map((response) => response.status === 201));
  }

  update(id: number, fournisseur: Fournisseur): Observable<boolean> {
    const toSend = {
      nomEntr: fournisseur.nomEntr,
      adresse: fournisseur.adresse || null,
      emailGen: fournisseur.emailGen || null,
      telFourni: fournisseur.telFourni || null,
    };
    return this.http
      .patch(`${this.url}/${id}`, toSend, { headers: this.patchHeaders, observe: 'response' })
      .pipe(map((response) => response.status === 200 || response.status === 204));
  }

  delete(id: number): Observable<boolean> {
    return this.http
      .delete(`${this.url}/${id}`, { observe: 'response' })
      .pipe(map((response) => response.status === 200 || response.status === 204));
  }
}
