import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ShoppingListData } from '../../stores/lists-data.store';
import { Item } from '../../data-classes/item';

@Component({
  selector: 'bl-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShoppingListComponent implements OnInit {

  static ENTER_KEY = 13; // Should be moved to some external library/service

  constructor(private shoppingListData: ShoppingListData) { }

  ngOnInit() {
    console.log(this.shoppingListData.items);
  }

  addItem(itemText: any) {

    if (itemText.value.trim() === '') {
      return;
    }

    // TODO: handle quantity later
    let newItem: Item = new Item(itemText.value);
    this.shoppingListData.addItem(newItem);
    // TODO: Uncomment this later
    /*
    result.subscribe(x => {
        this.items.push(newItem);
        itemText.value = '';
    });
    */
    itemText.value = '';
  }

  deleteItem(item: Item) {
    (item._id) ? this.shoppingListData.deleteItemById(item._id) : this.shoppingListData.deleteItemByText(item.text);
  }

  setEditMode(item: any, newEditMode: boolean) {
    if (newEditMode) {
      // If the line is marked as complete, we don't want to enter edit mode
      if (item.isCompleted) {
        return;
      }
      item.isEditMode = newEditMode;
    }
    else {
      delete item.isEditMode;
    }
  }

  handleItemEdit(event: any, item: Item) {
    if (event.which === ShoppingListComponent.ENTER_KEY) {
      let newText = event.target.value;
      if (!newText) {
        return;
      }
      let updatedItem = new Item(newText, item.quantity, item.isCompleted, item._id);
      /* TODO: Move this to the store later
      this._itemsService.updateItem(updatedItem).subscribe(data => {
          item.text = newText; 
          this.setEditMode(item, false);
      });
      */
      this.shoppingListData.updateItem(updatedItem);
      this.setEditMode(item, false);
    }
  }

  toggleCompletion(item: Item) {
    let updatedItem = new Item(item.text, item.quantity, !item.isCompleted, item._id);

    /* TODO: Move this to the store later
    this._itemsService.updateItem(updatedItem).subscribe(data => {
        item.isCompleted = !item.isCompleted;
    })
    */
    this.shoppingListData.updateItem(updatedItem);
  }
}
