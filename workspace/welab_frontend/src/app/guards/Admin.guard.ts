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

  if (!auth.isAuthentified) {
    return router.createUrlTree(['/login']);
  }

  if (auth.isAdmin) {
    return true;
  }

  // Stagiaire connecté mais sans droits admin → redirigé vers /lots
  return router.createUrlTree(['/lots']);
};