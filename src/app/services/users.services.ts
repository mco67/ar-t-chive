import { Injectable } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/user.model";
import { doc, Firestore, getDoc, getFirestore, setDoc } from "firebase/firestore"
import { AuthenticationService } from "./authentication.service";
import { User as AuthUser } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class UsersService {

    private store!: Firestore;
    public currentUser: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

    public constructor(
        private logger: NGXLogger,
        private authService: AuthenticationService
    ) {
        this.store = getFirestore();
        this.authService.currentAuthUser.subscribe((currentAuthUser: AuthUser | null) => { 
            this.currentAuthUserObserver(currentAuthUser); 
        });
    }

    public async createBDUser(user: User): Promise<User> {
        await setDoc(doc(this.store, 'users', user.id).withConverter(User.converter), user);
        return user;
    }

    public async retreiveDBUser(userId: string): Promise<User | null> {
        const docRef = doc(this.store, 'users', userId).withConverter(User.converter);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) { return docSnap.data(); }
        return null;
    }

    private async currentAuthUserObserver(currentAuthUser: AuthUser | null) {
        if (!currentAuthUser) { this.currentUser.next(null); return; }
        let currentUser = await this.retreiveDBUser(currentAuthUser.uid);
        if (!currentUser) {
            currentUser = new User(currentAuthUser.uid);
            currentUser.displayName = currentAuthUser.displayName;
            currentUser.email = currentAuthUser.email;
            currentUser.phoneNumber = currentAuthUser.phoneNumber;
            currentUser.photoURL = currentAuthUser.photoURL;
            await this.createBDUser(currentUser);
        }
        this.currentUser.next(currentUser);
    }

}