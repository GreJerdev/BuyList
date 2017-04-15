import {Component, Input, OnInit} from '@angular/core';
import {BuyListDataStore, Item, List} from "../../stores/buy-list-data.store";
import { ActivatedRoute } from '@angular/router';
import {computed} from "ng2-mobx";

@Component({
  selector: 'bl-buy-list',
  templateUrl: './buy-list.component.html',
  styleUrls: ['./buy-list.component.css']
})
export class BuyListComponent implements OnInit {

  static ENTER_KEY = 13; // Should be moved to some external library/service

  @Input()
  protected list: List;

  constructor(private route: ActivatedRoute,
              private dataStore: BuyListDataStore) { // TODO: Make sure it's the same instance
  }

  ngOnInit() {
    // console.log(this.list.items);
    this.route.params.subscribe(params => {
      let listId: string = params['id'];
      this.list = this.dataStore.getListById(listId);
    });
  }

  addItem(itemNameInput: any) {

    if (itemNameInput.value.trim() === '') {
      return;
    }

    // TODO: handle quantity later
    this.list.addItem(itemNameInput.value);
    // TODO: Implement this later with an observable, approximately like below
    /*
     result.subscribe(x => {
     this.items.push(newItem);
     itemText.value = '';
     });
     */
    itemNameInput.value = '';
  }

  deleteItem(item: Item) {
    this.list.deleteItem(item);
  }

  setEditMode(item: any, newEditMode: boolean) {

    // TODO: Check what to do with the editMode property
    if (newEditMode) {
      // If the line is marked as complete, we don't want to enter edit mode
      if (item.isDone) {
        return;
      }
      item.isEditMode = newEditMode;
    }
    else {
      delete item.isEditMode;
    }
  }

  handleItemEdit(event: any, item: Item) {
    if (event.which === BuyListComponent.ENTER_KEY) {
      let newText = event.target.value;
      if (!newText) {
        return;
      }
      let updatedItem = new Item(newText, item.quantity, item.isDone, item._id);
      this.list.updateItem(updatedItem);
      this.setEditMode(item, false);
    }
  }

  toggleCompletion(item: Item) {
    let updatedItem = new Item(item.name, item.quantity, !item.isDone, item._id);
    this.list.updateItem(updatedItem);
  }
}
