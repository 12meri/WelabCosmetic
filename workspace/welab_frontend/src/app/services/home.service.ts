import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private http = inject(HttpClient);

  // la méthode getHome envoie une requête GET à l'URL "http://localhost:8011/api/home" pour récupérer les données de la page d'accueil. Elle retourne un Observable contenant les données de la réponse.
  getHome() {
    return this.http.get<any>('http://localhost:8011/api/home');
  }
}