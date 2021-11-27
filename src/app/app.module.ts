import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoggerModule, NgxLoggerLevel } from "ngx-logger";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { WaveButtonComponent } from './widgets/waveButton/waveButton.component';
import { LoginComponent } from './login/login.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TextInputComponent } from './widgets/textInput/textInput.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from './widgets/icon/icon.component';
import { MainComponent } from './main/main.component';
import { LandingComponent } from './landing/landing.component';

export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http);
}
@NgModule({
	declarations: [
		MainComponent,
		IconComponent,
		AppComponent,
		WaveButtonComponent,
		TextInputComponent,
		LoginComponent,
		LandingComponent
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
		AngularFireModule.initializeApp(environment.firebase),
		AngularFireAuthModule,
		AngularFirestoreModule,
		AppRoutingModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
