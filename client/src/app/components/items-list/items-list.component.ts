import { Component, OnInit } from '@angular/core';
import { ItemsService } from './../../services/items.service';
import { Item } from './../../data-classes/item';

@Component({
    //moduleId: module.id,
    selector: 'bl-items-list',
    templateUrl: './items-list.component.html',
    styleUrls: ['./items-list.component.css'],
    providers: [ItemsService]
})
export class ItemsListComponent implements OnInit {
    
    static ENTER_KEY = 13; // Should be moved to some external library/service
    items: Item[];

    constructor(private _itemsService: ItemsService) { }

    ngOnInit() { 
        this.getItems();
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
        if (event.which === ItemsListComponent.ENTER_KEY) {
            let newText = event.target.value;
            if (!newText) {
                return;
            }
            let updatedItem = new Item(newText, item.isCompleted, item._id);
            /* TODO: Uncomment this later
            this._itemsService.updateItem(updatedItem).subscribe(data => {
                item.text = newText; 
                this.setEditMode(item, false);
            });
            */
        }
    }

    getItems() {
        this._itemsService.getItems().subscribe(items => {
            this.items = items;
        });        
    }

    addItem(event: any, itemText: any) {

        let newItem: Item = new Item(itemText.value, false);

        let result = this._itemsService.saveItem(newItem);
        // TODO: Uncomment this later
        /*
        result.subscribe(x => {
            this.items.push(newItem);
            itemText.value = '';
        });
        */
    }

    toggleCompletion(item: Item) {
        let updatedItem = new Item(item.text, !item.isCompleted, item._id);

        /* TODO: Uncomment this later
        this._itemsService.updateItem(updatedItem).subscribe(data => {
            item.isCompleted = !item.isCompleted;
        })
        */
    }

    deleteItem(item: Item) { // TODO: bring back the getId() usage once done figuring out
        let result = this._itemsService.deleteItem(item._id);
        /*
        TODO: Uncomment this later
        result.subscribe(x => {
            this.items = this.items.filter(checkedItem => checkedItem._id !== item._id);
        })
        */
    }
}

/*
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bl-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
*/