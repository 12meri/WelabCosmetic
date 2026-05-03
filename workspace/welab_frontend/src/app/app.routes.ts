// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LotAdd } from './component/lots/lots-add/lots-add.component';
import { LotEdit } from './component/lots/lots-edit/lots-edit.component';
import { HomeComponent } from './component/home/home.component';
import { MpList } from './component/mp/mp-list/mp-list.component';
import { MpAdd } from './component/mp/mp-add/mp-add.component';
import { LoginComponent } from './component/login/login.component';
import { MpEdit } from './component/mp/mp-edit/mp-edit.component';
import { LotsComponent } from './component/lots/lots-list/lots-list.component';
import { DemandeEchantillonAdd } from './component/demande-echantillon/demande-echantillon-add/demande-echantillon-add.component';
import { DemandeEchantillonList } from './component/demande-echantillon/demande-echantillon-list/demande-echantillon-list.component';
import { AlerteList } from './component/alertes/alerte-list/alerte-list.component';
import { FournisseursList } from './component/fournisseurs/fournisseurs-list/fournisseurs-list.component';
import { FournisseursAdd } from './component/fournisseurs/fournisseurs-add/fournisseurs-add.component';
import { FournisseursEdit } from './component/fournisseurs/fournisseurs-edit/fournisseurs-edit.component';
import { DistributionsList } from './component/distributions/distributions-list/distributions-list.component';
import { DistributionsAdd } from './component/distributions/distributions-add/distributions-add.component';
import { DistributionsEdit } from './component/distributions/distributions-edit/distributions-edit.component';
import { ContactFournisseursList } from './component/contact-fournisseurs/contact-fournisseurs-list/contact-fournisseurs-list.component';
import { ContactFournisseursAdd } from './component/contact-fournisseurs/contact-fournisseurs-add/contact-fournisseurs-add.component';
import { ContactFournisseursEdit } from './component/contact-fournisseurs/contact-fournisseurs-edit/contact-fournisseurs-edit.component';
import { EmailsList } from './component/emails/emails-list/emails-list.component';
import { EmailsAdd } from './component/emails/emails-add/emails-add.component';
import { EmailsEdit } from './component/emails/emails-edit/emails-edit.component';
import { DocumentsList } from './component/documents/documents-list/documents-list.component';
import { DocumentsAdd } from './component/documents/documents-add/documents-add.component';
import { DocumentsEdit } from './component/documents/documents-edit/documents-edit.component';
import { FournisseurDetailComponent } from './component/fournisseurs/fournisseur-detail/fournisseur-detail.component';
import { authGuard } from './guards/Auth.guard';
import { adminGuard } from './guards/Admin.guard';
import { ComptesList } from './component/admin/comptes-list/comptes-list.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';

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
  { path: 'emails',                        component: EmailsList,                canActivate: [authGuard] },
  { path: 'emails/add',                    component: EmailsAdd,                 canActivate: [authGuard] },
  { path: 'emails/edit/:id',               component: EmailsEdit,                canActivate: [authGuard] },
  { path: 'documents',                     component: DocumentsList,             canActivate: [authGuard] },
  { path: 'documents/add',                 component: DocumentsAdd,              canActivate: [authGuard] },
  { path: 'documents/edit/:id',            component: DocumentsEdit,             canActivate: [authGuard] },

  // ── Admin seulement (adminGuard) ──────────────────────────────────────────
  // Ajoute ici tes futurs composants de gestion des comptes quand ils seront créés
  // { path: 'admin/comptes', component: ComptesComponent, canActivate: [adminGuard] },
  { path: 'admin/comptes', component: ComptesList, canActivate: [adminGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  // Fallback
  { path: '**', redirectTo: '/login' }
];