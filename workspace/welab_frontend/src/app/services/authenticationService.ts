import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface JwtPayload {
  roles: string[];
  email: string;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private server = 'http://localhost:8011/api'; //  URL de backend Symfony
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly EMAIL_KEY = 'jwt_email';

  constructor(private http: HttpClient, private router: Router) {}

  // Getters 
// les getters permettent d'accéder aux informations d'authentification et de rôle de l'utilisateur à partir du token JWT stocké dans le localStorage. Ils vérifient également si le token est valide et non expiré.
  get isAuthentified(): boolean {
    const token = this.token;
    if (!token) return false;
    // Vérifie expiration
    const payload = this.decodeToken(token);
    if (!payload) return false;
    return payload.exp * 1000 > Date.now();
  }

  get token(): string {
    return localStorage.getItem(this.TOKEN_KEY) ?? '';
  }

  get email(): string {
    return localStorage.getItem(this.EMAIL_KEY) ?? '';
  }

  get roles(): string[] {
    const payload = this.decodeToken(this.token);
    return payload?.roles ?? [];
  }

  get isAdmin(): boolean {
    return this.roles.includes('ROLE_ADMIN');
  }

  get isStagiaire(): boolean {
    return this.roles.includes('ROLE_STAGIAIRE');
  }

  // Authentification 
// les méthodes de login et logout permettent de gérer l'authentification de l'utilisateur. La méthode login envoie une requête POST au backend Symfony avec les informations d'identification de l'utilisateur (email et mot de passe). Si la réponse contient un token JWT, celui-ci est stocké dans le localStorage, ainsi que l'email de l'utilisateur. Ensuite, l'utilisateur est redirigé vers la page des lots. La méthode logout supprime le token et l'email du localStorage et redirige l'utilisateur vers la page de login.
  login(email: string, password: string): void {
    // ← "email" et "password" comme attendu par Symfony
    this.http.post<{ token: string }>(this.server + '/login_check', { email, password })
      .subscribe({
        next: (response) => {
          if (response?.token) {
            localStorage.setItem(this.TOKEN_KEY, response.token);
            localStorage.setItem(this.EMAIL_KEY, email);
            this.router.navigate(['/lots']); // ← redirection après login
          }
        },
        error: (err) => {
          console.error('Login failed:', err);
        }
      });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EMAIL_KEY);
    this.router.navigate(['/login']);
  }

  // Utilitaire 
// la méthode decodeToken est une fonction utilitaire qui décode le token JWT pour extraire les informations de charge utile (payload). Elle utilise la fonction atob pour décoder la partie payload du token, puis parse le résultat en JSON. Si le token est invalide ou mal formé, la méthode retourne null.
  private decodeToken(token: string): JwtPayload | null {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }
}