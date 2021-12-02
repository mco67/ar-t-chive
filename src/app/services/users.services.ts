import { Injectable } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { Subject } from "rxjs";
import { User } from "../models/user.model";

import firebase from 'firebase/compat/';
import { doc, Firestore, getDoc, getFirestore } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth";


@Injectable({ providedIn: 'root' })
export class UsersService {

    private store!: Firestore;

    private _currentUser!: User | null;

    public currentUser: Subject<User | null> = new Subject<User | null>();

    public constructor(
        private logger: NGXLogger,
    ) {
        this.store = getFirestore();

        /*onAuthStateChanged(this.auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              const uid = user.uid;
              // ...
            } else {
              // User is signed out
              // ...
            }
          });

        this.auth.user.subscribe((firebaseUser: firebase.User | null) => {
            if (!firebaseUser) { this._currentUser = null; this.currentUser.next(null); return; }
            if (!this._currentUser) {
                this._currentUser = new User();
            }
            this._currentUser.id = firebaseUser?.uid;
            this._currentUser.email = firebaseUser?.email;
            this.currentUser.next(this._currentUser);

        });*/
    }

    public async getUserFromDB(userId: string): Promise<User | null> {
        const docRef = doc(this.store, 'users', userId).withConverter(User.converter);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) { return docSnap.data(); }
        return null;
    }

}