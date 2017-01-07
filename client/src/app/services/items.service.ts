import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../data-classes/item';

@Injectable()
export class ItemsService {

  // TODO: Get actual data
  mockedList = [
    {id: "001",
     text: "Milk",
     isCompleted: false
    },
    {id: "002",
     text: "Bread",
     isCompleted: false
    },
    {id: "001",
     text: "Potatoes",
     isCompleted: true
    },
  ];

  constructor() { }

  getItems() {
    let tmpWrappedMockedList = [];
    tmpWrappedMockedList[0] = this.mockedList;
    return Observable.from(tmpWrappedMockedList);
  }

  saveItem(newItem) {}
  
  updateItem(Item) {}

  deleteItem (itemId) {}
}
