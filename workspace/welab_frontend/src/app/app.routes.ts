import { Routes } from '@angular/router';
import { LotAdd } from './lots/lots_add/lots-add';
import { LotEdit } from './lots/lots_edit/lots-edit';
import { HomeComponent } from './home/home.component';
import { MpList } from './mp/matieres-premieres/matieres-premieres.component';
import { MpAdd } from './mp/mp-add/mp-add';
import { LoginComponent } from './login/login.component';
import { MpEdit } from './mp/mp-edit/mp-edit';
import { LotsComponent } from './lots/lots_list/lots.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'matpremieres', component: MpList },
  { path: 'matpremieres/add', component: MpAdd },
  { path: 'login', component: LoginComponent },
  { path: 'matpremieres/edit/:id', component: MpEdit },
  { path: 'lots', component: LotsComponent },
  { path: 'lots/add', component: LotAdd },
  { path: 'lots/edit/:id', component: LotEdit },
];