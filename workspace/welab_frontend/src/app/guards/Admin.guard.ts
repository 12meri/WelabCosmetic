// src/app/guards/admin.guard.ts
// Réservé aux admins uniquement
// - Non connecté → /login
// - Connecté mais stagiaire → /lots (accès refusé)
// - Admin → OK
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authenticationService';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthenticationService);
  const router = inject(Router);

  // Si l'utilisateur n'est pas authentifié, redirige vers la page de login
  if (!auth.isAuthentified) {
    return router.createUrlTree(['/login']);
  }

  // Si l'utilisateur est authentifié et a le rôle admin, autorise l'accès
  if (auth.isAdmin) {
    return true;
  }

  // Stagiaire connecté mais sans droits admin → redirigé vers /lots
  return router.createUrlTree(['/lots']);
};