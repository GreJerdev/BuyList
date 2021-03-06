import { browser, element, by } from 'protractor';

export class ClientPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('bl-root h1')).getText();
  }
}
