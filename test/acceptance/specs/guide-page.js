const GuidePage = require('../pageobjects/guide-page.page');

describe('a guide', () => {
  beforeEach(() => {
    GuidePage.open();
  });

  it('should contain a local header', () => {
    GuidePage.header.isVisible().should.be.true;
  });

  it('should contain a heading level 1', () => {
    GuidePage.h1.isVisible().should.be.true;
  });

  it('should contain guide navigation', () => {
    GuidePage.navigation.isVisible().should.be.true;
  });

  it('<title> should contain guide title and page title', () => {
    const heading1 = GuidePage.h1.getText();
    const stepTitle = GuidePage.currentPage.getText();
    const title = GuidePage.getTitle();

    title.should.startWith(stepTitle);
    title.should.contain(heading1);
  });
});

describe('guide page navigation', () => {
  beforeEach(() => {
    GuidePage.open();
  });

  it('should only have a next navigation item on first page', () => {
    GuidePage.nextLink.isExisting().should.be.true;
    GuidePage.prevLink.isExisting().should.be.false;
  });

  it('should have both next and previous navigation item on middle page', () => {
    GuidePage.nextLink.click();

    browser.pause(500);
    GuidePage.pagination.waitForExist(5000);
    GuidePage.nextLink.isExisting().should.be.true;
    GuidePage.prevLink.isExisting().should.be.true;
  });

  it('should only have a previous navigation item on last page', () => {
    // TODO: Find a robust way to select last item in list to go to last page
    const linkElements = GuidePage.navigationLinks.value;
    const lastLink = linkElements[linkElements.length - 1];

    browser.elementIdClick(lastLink.ELEMENT);

    browser.pause(500);
    GuidePage.pagination.waitForExist(5000);
    GuidePage.nextLink.isExisting().should.be.false;
    GuidePage.prevLink.isExisting().should.be.true;
  });
});
