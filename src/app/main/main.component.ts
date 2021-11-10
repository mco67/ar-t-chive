import { Component, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
	selector: 'main',
	templateUrl: 'main.component.html',
	styleUrls: ['main.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MainComponent {

    constructor(private authService: AuthenticationService) {
	}

	public async signOut() {
		try { this.authService.signOut(); }
		catch (error: any) {
			console.error("coucou" + error.message);
		}
	}
}