import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { buyListDataStore, BuyListDataStore } from '../../stores/buy-list-data.store';

@Component({
  selector: 'bl-buy-group',
  templateUrl: './buy-group.component.html',
  styleUrls: ['./buy-group.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuyGroupComponent implements OnInit {

  protected enteringNewList: boolean = false;

  constructor(private store: BuyListDataStore) { }

  ngOnInit() {
    // console.log(this.store.group.lists);
  }

  addNewList(listNameInput: any) {
    let newListName = listNameInput.value.trim();
    if (newListName !== '') {
      this.store.createNewList(newListName);
    }
    listNameInput.value = '';
    this.enteringNewList = false;
  }
}
