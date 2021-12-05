import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoggerModule, NgxLoggerLevel } from "ngx-logger";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { WaveButtonComponent } from './widgets/waveButton/waveButton.component';
import { LoginComponent } from './login/login.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TextInputComponent } from './widgets/textInput/textInput.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from './widgets/icon/icon.component';
import { MainComponent } from './main/main.component';
import { LandingComponent } from './landing/landing.component';
import { ForgetPasswordComponent } from './login/forgetPassword/forgetPassword.component';
import { CreateExhibitionComponent } from './admin/exhibition/create/createExhibition.component';
import { initializeApp } from 'firebase/app';
import { AvatarComponent } from './widgets/avatar/avatar.component';
import { ProfileComponent } from './login/profile/profile.component';
import { DropdownComponent, DropdownElemComponent, DropdownItemComponent, DropdownSeparatorComponent, DropdownTitleComponent } from './widgets/dropdown/dropdown.component';

export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http);
}

initializeApp(environment.firebase);
@NgModule({
	declarations: [
		AppComponent,
		MainComponent,
		LandingComponent,

		LoginComponent,
		ForgetPasswordComponent,
		ProfileComponent,

		CreateExhibitionComponent,

		/* Widgets */
		IconComponent,
		AvatarComponent,
		WaveButtonComponent,
		TextInputComponent,
		DropdownComponent, 
		DropdownElemComponent, 
		DropdownItemComponent, 
		DropdownSeparatorComponent, 
		DropdownTitleComponent
	],
	imports: [
		HttpClientModule,
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		TranslateModule.forRoot({
			defaultLanguage: 'en',
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
		LoggerModule.forRoot({ level: NgxLoggerLevel.DEBUG }),
		AppRoutingModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
