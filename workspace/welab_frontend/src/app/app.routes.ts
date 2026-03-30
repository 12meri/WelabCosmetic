import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MpList } from './mp-list/mp-list';
import { MpAdd } from './mp-add/mp-add';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'matpremieres', component: MpList},
    { path: 'matpremieres/add', component: MpAdd}

];
