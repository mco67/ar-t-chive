import { DocumentSnapshot } from "firebase/firestore";
export class User {

    public id!: string | null;
    public email!: string | null;
    public firstname!: string | null;
    public lastname!: string | null;

    public static converter = {
        toFirestore: (user: User) => {
            return {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname
            };
        },
        fromFirestore: (snapshot: DocumentSnapshot, options: any) => {
            const data = snapshot.data(options);
            const user = new User();
            user.id = data?.id;
            user.email = data?.email;
            user.firstname = data?.firstname;
            user.lastname = data?.lastname;
            return user;
        }
    };

    public constructor() {}
}