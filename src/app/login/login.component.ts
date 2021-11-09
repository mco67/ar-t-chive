import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
	selector: 'login',
	templateUrl: 'login.component.html',
	styleUrls: ['login.component.scss']
})
export class LoginComponent {

    constructor(private authService: AuthenticationService) {
	}

	public async signIn() {
		try { this.authService.signIn('cordebard@gmail.com', 'H@f00id@'); }
		catch (error: any) {
			console.error("coucou" + error.message);
		}
	}

}