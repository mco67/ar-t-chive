import { DocumentSnapshot } from "firebase/firestore";
export class User {

    public static ROLE_VISITOR: string = 'ROLE_VISITOR'
    public static ROLE_ADMIN: string = 'ROLE_ADMIN'
    public static ROLE_SUPERADMIN: string = 'ROLE_SUPERADMIN'

    public id: string;
    public email: string | null = null;
    public phoneNumber: string | null = null;
    public firstname: string | null = null;
    public lastname: string | null = null;
    public displayName: string | null = null;
    public photoURL: string | null = null;
    public role: string = User.ROLE_VISITOR;
    public confirmed: boolean = false;

    public static converter = {
        toFirestore: (user: User) => {
            return {
                id: user.id,
                email: user?.email,
                phoneNumber: user?.phoneNumber,
                firstname: user?.firstname,
                lastname: user?.lastname,
                displayName: user?.displayName,
                photoURL: user?.photoURL,
                role: user?.role,
                confirmed: user?.confirmed
            };
        },
        fromFirestore: (snapshot: DocumentSnapshot, options: any) => {
            const data = snapshot.data(options);
            const user = new User(data?.id);
            user.id = data?.id;
            user.email = data?.email;
            user.phoneNumber = data?.phoneNumber;
            user.firstname = data?.firstname;
            user.lastname = data?.lastname;
            user.displayName = data?.displayName;
            user.photoURL = data?.photoURL;
            user.role = data?.role;
            user.confirmed = data?.confirmed;
            return user;
        }
    };

    public constructor(id: string) {
        this.id = id;
    }
}