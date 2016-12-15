const Page = require('../pageobjects/page');
const FeedbackPage = require('../pageobjects/feedback.page');

describe('feedback mechanism', () => {
  describe('when not on a content page', () => {
    it('should not be present', () => {
      Page.open();
      FeedbackPage.banner.isVisible().should.be.true;
      FeedbackPage.banner.getText().should.not.contain('Tell us what you think');
      FeedbackPage.feedbackContainer.isExisting().should.be.false;
    });
  });

  describe('when on a content page with javascript enabled', () => {
    it('should be present and hidden', () => {
      FeedbackPage.open();
      FeedbackPage.banner.isVisible().should.be.true;
      FeedbackPage.banner.getText().should.contain('Tell us what you think');
      FeedbackPage.feedbackContainer.isExisting().should.be.true;
      FeedbackPage.feedbackContainer.isVisible().should.be.false;
    });

    it('should toggle show/hide', () => {
      FeedbackPage.open();
      FeedbackPage.feedbackContainer.isVisible().should.be.false;
      FeedbackPage.toggle.click();
      browser.pause(750);
      FeedbackPage.feedbackContainer.isVisible().should.be.true;
      FeedbackPage.cancelBtn.click();
      FeedbackPage.feedbackContainer.isVisible().should.be.false;
    });

    it('should return an error if submitted empty', () => {
      FeedbackPage.open();
      FeedbackPage.toggle.click();
      browser.pause(750);
      FeedbackPage.submit();

      FeedbackPage.errorSummary.waitForExist();
      FeedbackPage.errorSummary.isVisible().should.be.true;
      FeedbackPage.errorSummary.getText().should.contain('feedback wasn\'t complete');
      FeedbackPage.comment.getAttribute('class').should.contain('error');
    });

    it('should receive a thank you message if submitted with content', () => {
      // TODO: Submit form to dev API so can be tested fully
      // FeedbackPage.form.isExisting().should.be.false;
      // FeedbackPage.feedbackContainer.getText().should.contain('Thank you');
    });
  });
});
