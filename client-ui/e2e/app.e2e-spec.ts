import { ClientUiPage } from './app.po';

describe('client-ui App', function() {
  let page: ClientUiPage;

  beforeEach(() => {
    page = new ClientUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
