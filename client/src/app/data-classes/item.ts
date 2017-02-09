export class Item {

    public text: string;
    public quantity: number;
    public isCompleted: boolean;
    public _id: any;

    constructor(text: string,
        quantity: number = 1,
        isCompleted: boolean = false,
        id = Item.generateUUID()) {

        this.text = text;
        this.quantity = quantity;
        this.isCompleted = isCompleted;
        if (id) {
            this._id = id;
        }
    }

    // public getId():any {
    //     return this._id;
    // }

    private static generateUUID() {
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
}
