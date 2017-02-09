import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../data-classes/item';

@Injectable()
export class ItemsService {

  // TODO: Get actual data
  mockedList = [
    {_id: "001",
     text: "Milk",
     isCompleted: false
    },
    {_id: "002",
     text: "Bread",
     isCompleted: false
    },
    {_id: "003",
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
