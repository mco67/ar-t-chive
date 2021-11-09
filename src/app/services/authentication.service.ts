
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { NGXLogger } from 'ngx-logger';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private userCredential: firebase.auth.UserCredential | undefined;

    public constructor(
        private logger: NGXLogger,
        private auth: AngularFireAuth
    ) { }

    public async signIn(login: string, password: string): Promise<any> {
        try {
            this.userCredential = await this.auth.signInWithEmailAndPassword(login, password)
            this.logger.info(`[authenticationService] signIn -- ${login} -- SUCCESS`);
        }
        catch (error: any) {
            this.logger.error(`[authenticationService] signIn -- ${login} -- ERROR -- ${error.message}`);
        }
    }

    public async signOut(): Promise<any> {
        try {
            await this.auth.signOut();
            this.logger.info(`[authenticationService] signOut -- SUCCESS`);
        }
        catch (error: any) {
            this.logger.error(`[authenticationService] signOut -- ERROR -- ${error.message}`);
        }
    }

    public createUser(): void {
        this.auth.createUserWithEmailAndPassword('cordebard@gmail.com', 'H@f00id@');
    }

    public async deleteUser() {
        const user = await this.auth.currentUser;
        user?.delete();
    }

}
