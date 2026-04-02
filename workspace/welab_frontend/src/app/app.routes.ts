import { Routes } from '@angular/router';
import { LotAdd } from './lots/lots-add/lots-add';
import { LotEdit } from './lots/lots-edit/lots-edit';
import { HomeComponent } from './home/home.component';
import { MpList } from './mp/mp-list/mp-list.component';
import { MpAdd } from './mp/mp-add/mp-add';
import { LoginComponent } from './login/login.component';
import { MpEdit } from './mp/mp-edit/mp-edit';
import { LotsComponent } from './lots/lots-list/lots-list.component';
import { DemandeEchantillonAdd } from './demande-echantillon/demande-echantillon-add/demande-echantillon-add';
import { DemandeEchantillonList } from './demande-echantillon/demande-echantillon-list/demande-echantillon-list';
import { AlerteList } from './alertes/alerte-list/alerte-list';
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

];