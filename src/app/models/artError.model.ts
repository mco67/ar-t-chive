export class ArtError extends Error {

    public code: string|undefined;
    
    public static create(message?: string, code?: string) {
        return new ArtError(message, code);
    }

    public static createFromFirebaseError(firebaseError: any) {
        return new ArtError(firebaseError.message, firebaseError.code);
    }

    private constructor(message?: string, code?: string) {
        super(message);
        Object.setPrototypeOf(this, ArtError.prototype);
        this.code = code;
    }


}