import { Component } from '@angular/core';

@Component({
  selector: 'bl-root',
  template: `
  <h1>
    {{title}}
  </h1>
  `,
  styles: []
})
export class AppComponent {
  title = 'BuyList works!';
}
