const page = require('./page');

const feedbackPage = Object.create(page, {
  /**
   * define elements
   */
  banner: {
    get: () => {
      return browser.element('.js-feedback-banner');
    },
  },
  toggle: {
    get: () => {
      return browser.element('.js-feedback-toggle');
    },
  },
  feedbackContainer: {
    get: () => {
      return browser.element('#page-feedback');
    },
  },
  form: {
    get: () => {
      return browser.element('form[name="feedback-form"]');
    },
  },
  cancelBtn: {
    get: () => {
      return browser.element('#page-feedback button[type="reset"]');
    },
  },
  comment: {
    get: () => {
      return browser.element('#feedback-form-comments');
    },
  },
  errorSummary: {
    get: () => {
      return browser.element('#page-feedback .callout--error');
    },
  },


  /**
   * define or overwrite page methods
   */
  open: {
    value: function open() {
      page.open.call(this, 'symptoms/stomach-ache');
    },
  },
  submit: {
    value: function value() {
      this.form.submitForm();
    },
  },
});

module.exports = feedbackPage;
