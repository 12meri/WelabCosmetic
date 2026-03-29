import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MatieresPremieresComponent } from './matieres-premieres/matieres-premieres.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'matieres-premieres', component: MatieresPremieresComponent },

  { path: '**', redirectTo: '' }
];