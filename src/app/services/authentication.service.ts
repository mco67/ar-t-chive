
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { NGXLogger } from 'ngx-logger';
import { ArtError } from '../models/artError.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    public constructor(
        private logger: NGXLogger,
        private auth: AngularFireAuth
    ) {
    }

    public async signIn(login: string, password: string) {
        try {
            await this.auth.signInWithEmailAndPassword(login, password);
            this.logger.info(`[authenticationService] signIn -- ${login} -- SUCCESS`);
        }
        catch (error: any) {
            this.logger.error(`[authenticationService] signIn -- ${login} -- ERROR -- ${error.code} -- ${error.message}`);
            throw ArtError.createFromFirebaseError(error);
        }
    }

    public async signInWithGoogle() {
        await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }

    public async signOut() {
        try {
            await this.auth.signOut();
            this.logger.info(`[authenticationService] signOut -- SUCCESS`);
        }
        catch (error: any) {
            this.logger.error(`[authenticationService] signOut -- ERROR -- ${error.message}`);
            throw ArtError.createFromFirebaseError(error);
        }
    }
}
