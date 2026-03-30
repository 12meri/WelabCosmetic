import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MpList } from './matieres-premieres/matieres-premieres.component';
import { MpAdd } from './mp-add/mp-add';
import { LoginComponent } from './login/login.component';
import { MpEdit } from './mp-edit/mp-edit';
export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'matpremieres', component: MpList},
    { path: 'matpremieres/add', component: MpAdd},
    { path: 'login', component: LoginComponent },
    { path: 'matpremieres/edit/:id', component: MpEdit }
];
