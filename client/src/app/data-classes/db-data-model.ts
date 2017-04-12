// Questions:
// 1. Date as string?
// 2. About = name?

export class DBListItem {
    public _id: string;
    public listId: string;
    public name:string;
    public quantity: number;
    public isDone: boolean;
}

export class DBList {
    public _id: string;
    public groupId: string;
    public createDate: string;
    public name: string;
}

export class DBGroup {
    public _id: string;
    public name: string;
}
