export class ArtEvent {

    public id: string|null = null;
    public data: any|null = null;

    public static create(id: string, data?: any) {
        return new ArtEvent(id, data);
    }

    private constructor(id: string, data?: any) {
        this.id = id;
        this.data = data;
    }
}