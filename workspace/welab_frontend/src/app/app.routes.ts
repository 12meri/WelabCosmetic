// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LotAdd } from './component/lots/lots-add/lots-add';
import { LotEdit } from './component/lots/lots-edit/lots-edit';
import { HomeComponent } from './home/home.component';
import { MpList } from './component/mp/mp-list/mp-list.component';
import { MpAdd } from './component/mp/mp-add/mp-add';
import { LoginComponent } from './login/login.component';
import { MpEdit } from './component/mp/mp-edit/mp-edit';
import { LotsComponent } from './component/lots/lots-list/lots-list.component';
import { DemandeEchantillonAdd } from './component/demande-echantillon/demande-echantillon-add/demande-echantillon-add';
import { DemandeEchantillonList } from './component/demande-echantillon/demande-echantillon-list/demande-echantillon-list';
import { AlerteList } from './component/alertes/alerte-list/alerte-list';
import { FournisseursList } from './component/fournisseurs/fournisseurs-list/fournisseurs-list';
import { FournisseursAdd } from './component/fournisseurs/fournisseurs-add/fournisseurs-add';
import { FournisseursEdit } from './component/fournisseurs/fournisseurs-edit/fournisseurs-edit';
import { DistributionsList } from './component/distributions/distributions-list/distributions-list';
import { DistributionsAdd } from './component/distributions/distributions-add/distributions-add';
import { DistributionsEdit } from './component/distributions/distributions-edit/distributions-edit';
import { ContactFournisseursList } from './component/contact-fournisseurs/contact-fournisseurs-list/contact-fournisseurs-list';
import { ContactFournisseursAdd } from './component/contact-fournisseurs/contact-fournisseurs-add/contact-fournisseurs-add';
import { ContactFournisseursEdit } from './component/contact-fournisseurs/contact-fournisseurs-edit/contact-fournisseurs-edit';
import { FournisseurDetailComponent } from './component/fournisseurs/fournisseur-detail/fournisseur-detail.component';
import { authGuard } from './guards/Auth.guard';
import { adminGuard } from './guards/Admin.guard';

export const routes: Routes = [
  // Par défaut → login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // ── Public (pas de guard) ─────────────────────────────────────────────────
  { path: 'login', component: LoginComponent },

  // ── Admin ET Stagiaire (authGuard) ────────────────────────────────────────
  { path: 'home',                          component: HomeComponent,             canActivate: [authGuard] },
  { path: 'lots',                          component: LotsComponent,             canActivate: [authGuard] },
  { path: 'lots/add',                      component: LotAdd,                    canActivate: [authGuard] },
  { path: 'lots/edit/:id',                 component: LotEdit,                   canActivate: [authGuard] },
  { path: 'matpremieres',                  component: MpList,                    canActivate: [authGuard] },
  { path: 'matpremieres/add',              component: MpAdd,                     canActivate: [authGuard] },
  { path: 'matpremieres/edit/:id',         component: MpEdit,                    canActivate: [authGuard] },
  { path: 'fournisseurs',                  component: FournisseursList,          canActivate: [authGuard] },
  { path: 'fournisseurs/add',              component: FournisseursAdd,           canActivate: [authGuard] },
  { path: 'fournisseurs/edit/:id',         component: FournisseursEdit,          canActivate: [authGuard] },
  { path: 'fournisseurs/:id',              component: FournisseurDetailComponent,canActivate: [authGuard] },
  { path: 'distributions',                 component: DistributionsList,         canActivate: [authGuard] },
  { path: 'distributions/add',             component: DistributionsAdd,          canActivate: [authGuard] },
  { path: 'distributions/edit/:id',        component: DistributionsEdit,         canActivate: [authGuard] },
  { path: 'alertes',                       component: AlerteList,                canActivate: [authGuard] },
  { path: 'demande-echantillon',           component: DemandeEchantillonList,    canActivate: [authGuard] },
  { path: 'demande-echantillon/add',       component: DemandeEchantillonAdd,     canActivate: [authGuard] },
  { path: 'contact-fournisseurs',          component: ContactFournisseursList,   canActivate: [authGuard] },
  { path: 'contact-fournisseurs/add',      component: ContactFournisseursAdd,    canActivate: [authGuard] },
  { path: 'contact-fournisseurs/edit/:id', component: ContactFournisseursEdit,   canActivate: [authGuard] },

  // ── Admin seulement (adminGuard) ──────────────────────────────────────────
  // Ajoute ici tes futurs composants de gestion des comptes quand ils seront créés
  // { path: 'admin/comptes', component: ComptesComponent, canActivate: [adminGuard] },

  // Fallback
  { path: '**', redirectTo: '/login' }
];