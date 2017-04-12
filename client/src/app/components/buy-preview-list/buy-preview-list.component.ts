import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { List } from '../../stores/buy-list-data.store';

@Component({
  selector: '[bl-buy-preview-list]',
  templateUrl: './buy-preview-list.component.html',
  styleUrls: ['./buy-preview-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuyPreviewListComponent {

  @Input() list: List;

}
