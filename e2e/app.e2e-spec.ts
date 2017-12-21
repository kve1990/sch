import { SchPage } from './app.po';

describe('sch App', () => {
  let page: SchPage;

  beforeEach(() => {
    page = new SchPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
