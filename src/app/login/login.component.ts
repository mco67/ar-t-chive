import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';

@Component({
	selector: 'login',
	templateUrl: 'login.component.html',
	styleUrls: ['login.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class LoginComponent {

	public loginForm: FormGroup;
	public controls: any;

	constructor(
		private formBuilder: FormBuilder,
		private authService: AuthenticationService) {

		this.loginForm = this.formBuilder.group({
			login: ['', [Validators.required, Validators.email]],
			password: ['', Validators.compose([
				Validators.minLength(5), Validators.required]
				/*Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]*/
			)]
		});
		this.controls = this.loginForm.controls;
	}

	public ngOnInit() {

	}
	public async signIn() {
		try {
			this.authService.signIn(this.controls.login.value, this.controls.password.value);
		}
		catch (error: any) {
			console.error("coucou" + error.message);
		}
	}

}