
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ArtError } from '../models/artError.model';
import { getAuth, Auth, signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged, GoogleAuthProvider, User as AuthUser } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private auth: Auth;
    public currentAuthUser: BehaviorSubject<AuthUser | null> = new BehaviorSubject<AuthUser | null>(null);

    public constructor(private logger: NGXLogger) {
        this.auth = getAuth();
        onAuthStateChanged(this.auth, (firebaseUser) => { this.currentAuthUser.next(firebaseUser); });
    }

    public async signIn(login: string, password: string) {
        try {
            signInWithEmailAndPassword(this.auth, login, password);
            this.logger.info(`[authenticationService] signIn -- ${login} -- SUCCESS`);
        }
        catch (error: any) {
            this.logger.error(`[authenticationService] signIn -- ${login} -- ERROR -- ${error.code} -- ${error.message}`);
            throw ArtError.createFromFirebaseError(error);
        }
    }

    public async signInWithGoogle() {
        await signInWithPopup(this.auth, new GoogleAuthProvider());
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
