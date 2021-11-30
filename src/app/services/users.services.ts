import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { NGXLogger } from "ngx-logger";
import { Subject } from "rxjs";
import { User } from "../models/user.model";
import firebase from 'firebase/compat/';

@Injectable({ providedIn: 'root' })
export class UsersService {

    private _currentUser: User | null = null;
    
    public currentUser: Subject<User | null> = new Subject<User | null>();

    public constructor(
        private logger: NGXLogger,
        private auth: AngularFireAuth
    ) {
        this.auth.user.subscribe((firebaseUser: firebase.User | null) => {
            if (!firebaseUser) { this._currentUser = null; this.currentUser.next(null); return; }
            if (!this._currentUser) { this._currentUser = new User(); }
            this._currentUser.id = firebaseUser?.uid;
            this._currentUser.email = firebaseUser?.email;
            this.currentUser.next(this._currentUser);
        });
    }


    public createUser(): void {
        this.auth.createUserWithEmailAndPassword('cordebard@gmail.com', 'H@f00id@');
    }

    public async deleteUser() {
        const user = await this.auth.currentUser;
        user?.delete();
    }

}