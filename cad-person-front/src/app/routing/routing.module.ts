import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from '../views/pages/cad-users/list/list.component';
import { RegisterComponent } from '../views/pages/cad-users/register/register.component';

const routes: Routes = [
  {
		path: '',
		component: ListComponent,
	},
	{
		path: 'list',
		component: ListComponent,
	},
	{
		path: 'register',
		component: RegisterComponent,
	},
	{
		path: 'edit/:id',
		component: RegisterComponent
	},
	{path: '', redirectTo: 'list', pathMatch: 'full'},
	{path: '**', redirectTo: 'list', pathMatch: 'full'},

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class RoutingModule { }