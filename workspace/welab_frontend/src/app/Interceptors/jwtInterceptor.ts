import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authenticationService';
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthenticationService)
  /**
   * Le jwtInterceptor est une fonction qui intercepte les requêtes HTTP sortantes et ajoute un en-tête Authorization contenant le token JWT de l'utilisateur 
   * si celui-ci est authentifié. Cela permet d'assurer que les requêtes envoyées au backend Symfony contiennent les informations d'authentification nécessaires pour accéder aux ressources protégées.
   * Bearer ${auth.token} : ajoute le token JWT dans l'en-tête Authorization de chaque requête HTTP sortante, ce qui permet au backend de vérifier l'authentification de l'utilisateur et d'autoriser ou refuser l'accès aux ressources en conséquence.
   * 
   */
  if (auth.isAuthentified) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${auth.token}` } 
    })
  }
  return next(req) // continue le traitement de la requête (envoi au serveur ou passage au prochain interceptor)
}