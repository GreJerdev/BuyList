///<reference path="../../../node_modules/mobx/lib/mobx.d.ts"/>
import {observable, action, computed} from 'mobx';
import {Injectable} from '@angular/core';
import {DBGroup, DBList, DBListItem} from '../data-classes/db-data-model';

export class Item extends DBListItem { // This class is only for naming convenience

  constructor(name: string,
              quantity: number = 1,
              isDone: boolean = false,
              id?) {
    super();
    this.name = name;
    this.quantity = quantity;
    this.isDone = isDone;
    if (id) {
      this._id = id;
    }
    // TODO: Leave this to the DB later
    else {
      this._id = Item.generateUUID()
    }
  }

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

export class List extends DBList {
  @observable public items: Item[];
  //public items: Item[];

  //TODO: write method for retrieving non-completed items

  @action addItem(name: string, quantity: number = 1, isDone: boolean = false) {

    let newItem: Item = new Item(name, quantity, isDone);
    // TODO: Call API
    this.items.push(newItem);
  }

  @action deleteItem(itemToDelete: Item) {
    // TODO: Call API
    this.items = this.items.filter(checkedItem => checkedItem._id !== itemToDelete._id);
  }

  @action updateItem(itemWithUpdatedValues: Item) {

    if (!itemWithUpdatedValues._id) {
      console.log('Item with no ID was passed. Cannot update: ' + itemWithUpdatedValues);
      return;
    }

    let filteredListById: Item[] = this.items
      .filter(checkedItem => checkedItem._id === itemWithUpdatedValues._id);

    if (filteredListById.length === 0) {
      console.log("Failed finding an item by id " +
        itemWithUpdatedValues._id + " for updating, in list with name " + this.name);
    }
    else {
      //TODO: Call API
      filteredListById[0].name = itemWithUpdatedValues.name;
      filteredListById[0].isDone = itemWithUpdatedValues.isDone;
      filteredListById[0].quantity = itemWithUpdatedValues.quantity;
    }
  }

  @computed get unfinishedItems(): Item[] {
    return this.items.filter(item => !item.isDone);
  }
}

export class Group extends DBGroup {
  public lists: List[] = [];

  addList(newList: List) {
    // TODO: Call API
    this.lists.push(newList);
  }

  //TODO: Implement list deletion
}

@Injectable()
export class BuyListDataStore {
  @observable group: Group;

  //@observable filter:string = '';

  constructor() {
// TODO: Add data service instead
    this.group = new Group();
    this.group._id = BuyListDataStore.generateUUID();
    this.group.name = 'Group 1';

    let list1 = this.createNewList('List 1');
    list1.addItem('Bread');
    list1.addItem('Butter');

    let list2 = this.createNewList('List 2');
    list2.addItem('Milk');
    list2.addItem('Dog food');
    list2.addItem('Cheese', 1, true);

    //debug
    console.log('BuyListDataStore initialized')
  }

  @action createNewList(listName: string): List {
    let newList: List = new List();
    newList.name = listName;
    newList.createDate = Date.now().toString(); // TODO: Treat this as date eventually
    newList.groupId = this.group._id;
    newList.items = [];

    // TODO: persist to DB and get the actual _id...
    newList._id = BuyListDataStore.generateUUID();
    this.group.addList(newList);

    return newList;
  }

  public getListById(id: string): List {
    let resultList = this.group.lists.filter((checkedList) => checkedList._id === id);
    return resultList.length > 0 ? resultList[0] : null;
  }

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

export const buyListDataStore = new BuyListDataStore();
window['state'] = buyListDataStore;
