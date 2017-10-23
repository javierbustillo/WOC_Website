import { Routes, RouterModule } from '@angular/router'

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';

const routes:Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
	{	path: '**',	component: ErrorComponent }
];

export const appRouting = RouterModule.forRoot(routes);
