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


export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'matpremieres', component: MpList },
  { path: 'matpremieres/add', component: MpAdd },
  { path: 'login', component: LoginComponent },
  { path: 'matpremieres/edit/:id', component: MpEdit },
  { path: 'lots', component: LotsComponent },
  { path: 'lots/add', component: LotAdd },
  { path: 'lots/edit/:id', component: LotEdit },
  { path: 'demande-echantillon/add', component: DemandeEchantillonAdd },
  { path: 'demande-echantillon', component: DemandeEchantillonList },
  { path: 'alertes', component: AlerteList },
 { path: "fournisseurs", component: FournisseursList},
  { path: "fournisseurs/add", component: FournisseursAdd },
  { path: "fournisseurs/edit/:id", component: FournisseursEdit },
  { path: "distributions", component: DistributionsList },
  { path: "distributions/add", component: DistributionsAdd },
  { path: "distributions/edit/:id", component: DistributionsEdit },
  { path: "contact-fournisseurs", component: ContactFournisseursList },
  { path: "contact-fournisseurs/add", component: ContactFournisseursAdd },
  { path: "contact-fournisseurs/edit/:id", component: ContactFournisseursEdit },
  { path: "fournisseurs/:id", component: FournisseurDetailComponent }
];