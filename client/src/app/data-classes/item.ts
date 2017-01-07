export class Item {
    constructor(public text: string,
                public isCompleted: boolean,
                public _id?: any) {}

    public getId():any {
        return this._id;
    }
}
