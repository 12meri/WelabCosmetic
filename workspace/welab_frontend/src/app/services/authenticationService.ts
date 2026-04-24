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

  private server = 'http://localhost:8011/api'; // ← port corrigé
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly EMAIL_KEY = 'jwt_email';

  constructor(private http: HttpClient, private router: Router) {}

  // ─── Getters ───────────────────────────────────────────────────────────────

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

  // ─── Auth ──────────────────────────────────────────────────────────────────

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

  // ─── Utilitaire ────────────────────────────────────────────────────────────

  private decodeToken(token: string): JwtPayload | null {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }
}