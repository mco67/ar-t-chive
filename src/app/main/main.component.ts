import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
	selector: 'main',
	templateUrl: 'main.component.html',
	styleUrls: ['main.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MainComponent {

    constructor(
		private router: Router,
		private authService: AuthenticationService) {
	}

	public signIn() {
		this.router.navigate(['/login']);
	}

	public landing() {
		this.router.navigate(['/']);
	}

	public async signOut() {
		try { this.authService.signOut(); }
		catch (error: any) {
			console.error("coucou" + error.message);
		}
	}
}