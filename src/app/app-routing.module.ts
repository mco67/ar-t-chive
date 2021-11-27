import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
//import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';

//const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
	{
		path: '', 
		component: MainComponent,
		
		children: [
			{ path: '', component: LandingComponent },
			{ path: 'login', component: LoginComponent }
		]
		//canActivate: [AngularFireAuthGuard],
		//data: { authGuardPipe: redirectUnauthorizedToLogin }
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
