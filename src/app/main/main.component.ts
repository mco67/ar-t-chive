import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from '../models/user.model';
import { AuthenticationService } from '../services/authentication.service';
import { UsersService } from '../services/users.services';

@Component({
	selector: 'main',
	templateUrl: 'main.component.html',
	styleUrls: ['main.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MainComponent {

    constructor(
		private router: Router,
		private authService: AuthenticationService,
		public usersService: UsersService) {
			this.usersService.currentUser.subscribe((currentUser: User | null) => {
				if (currentUser && !currentUser.confirmed) { this.router.navigate(['/profile']); }
				else this.router.navigate(['/']);
			});
	}

	public ngOnInit(): void {
	}

	public signIn() {
		this.router.navigate(['/login']);
	}

	public landing() {
		this.router.navigate(['/']);
	}

	public async signOut() {
		await this.authService.signOut();
		this.router.navigate(['/']);
	}
}