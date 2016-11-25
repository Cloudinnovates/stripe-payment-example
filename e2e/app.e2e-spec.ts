import { PaymentApiExamplePage } from './app.po';

describe('payment-api-example App', function() {
  let page: PaymentApiExamplePage;

  beforeEach(() => {
    page = new PaymentApiExamplePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
