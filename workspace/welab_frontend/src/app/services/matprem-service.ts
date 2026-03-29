import { Injectable } from '@angular/core';
import { ApiResponse } from './apiresponse';
import {  MatPre} from "../entity/mat-pre";
import { Observable } from 'rxjs';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
@Injectable({
  providedIn: 'root',
})
export class MatpremService {

  private http: HttpClient; // peut ne pas etre declarer ici il suffit de la decalrer dans le parametre du constructeur sans linitialiser this.http ..
private url: string=  'http://localhost:8011/api/mat_premieres';

private headers = new HttpHeaders({ 'Content-Type': 'application/ld+json' });
// comme des etiquette pour transmettre des info : le contenu est format application/id+json suivent le standard JSON-LD (JSON for Linked Data) de APIPLATFORM
 private patch_headers =
    new HttpHeaders({ 'Content-Type': 'application/merge-patch+json' });
    // pour modification lentete doit etre application/merge-patch+json et pas id+json 


// constructeur 
  constructor( http: HttpClient){
    this.http=http;
  }

//methode pour afficher tous les livres
public  mplist(): Observable<Array<MatPre>>{

  return this.http.get<ApiResponse<MatPre>>(this.url, { observe: 'body', responseType: 'json'}).pipe(map((data) => data['member']))
// pipe le block de transfert de donne qui encapsule methos=de map
// map permet de transformer des donnee dun type a un autre map(s,b) 
// faut preciser ApiResponse pour lavoir de la forme member[leement]
  
} 
}
