import { Component } from '@angular/core';

@Component({
  selector: 'bl-root',
  template: `
  <h1>
    {{title}}
  </h1>
  <div class="container">
    <div class="row">
      <div class="col-md-11 col-md-offset-1">
        <button class="btn btn-normal">This is a bootatrap button</button>
      </div>
    </div>
  </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'BuyList works!';
}
