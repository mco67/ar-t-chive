
import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { NGXLogger } from 'ngx-logger';
import { ArtError } from '../models/artError.model';
import { getAuth, Auth, signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { Subject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private auth: Auth;
    public currentUserId: Subject<string | null> = new Subject<string | null>();

    public constructor(private logger: NGXLogger) {
        this.auth = getAuth();
        onAuthStateChanged(this.auth, (firebaseUser) => {
            this.currentUserId.next(firebaseUser ? firebaseUser.uid : null);            
        });
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
        await signInWithPopup(this.auth, new firebase.auth.GoogleAuthProvider());
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
