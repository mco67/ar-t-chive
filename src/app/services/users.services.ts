import { Injectable } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { BehaviorSubject, Subject } from "rxjs";
import { User } from "../models/user.model";

import firebase from 'firebase/compat/';
import { doc, Firestore, getDoc, getFirestore } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth";
import { AuthenticationService } from "./authentication.service";


@Injectable({ providedIn: 'root' })
export class UsersService {

    private store!: Firestore;
    public currentUser: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

    public constructor(
        private logger: NGXLogger,
        private authService: AuthenticationService
    ) {
        this.store = getFirestore();
        this.authService.currentUserId.subscribe(async (currentUserId: string | null) => {
            this.currentUser.next(currentUserId ? await this.getUserFromDB(currentUserId) : null);
        });
    }

    public async getUserFromDB(userId: string): Promise<User | null> {
        const docRef = doc(this.store, 'users', userId).withConverter(User.converter);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) { return docSnap.data(); }
        return null;
    }

}