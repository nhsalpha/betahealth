const $ = require('jquery');

const FeedbackForm = function FeedbackForm() {
  this.toggleEl = '.js-feedback-toggle';
};

FeedbackForm.prototype.init = function init() {
  this.cacheEls();
  this.bindEvents();
  this.render();
};

FeedbackForm.prototype.cacheEls = function cacheEls() {
  this.$body = $('body');

  this.$bannerToggle = $(this.toggleEl);
  this.$feedbackBanner = $('.js-feedback-banner');

  this.$formContainer = $('.js-feedback-container');
  this.$form = this.$formContainer.find('form');
};

FeedbackForm.prototype.bindEvents = function bindEvents() {
  this.$body
    .on('click.feedbackForm', this.toggleEl, this.showForm.bind(this))
    .on('click.feedbackForm', 'button[type="reset"]', this.hideForm.bind(this));
};

FeedbackForm.prototype.render = function render() {
  this.$formContainer
    .detach()
    .insertAfter(this.$feedbackBanner);

  if (!this.isSubmitted()) {
    this.$formContainer.hide();
  }
};

FeedbackForm.prototype.showForm = function showForm(e) {
  e.preventDefault();
  this.$formContainer.show();
};

FeedbackForm.prototype.hideForm = function hideForm() {
  this.$formContainer.hide();
};

FeedbackForm.prototype.isSubmitted = function hasErrors() {
  return this.$formContainer.hasClass('is-submitted');
};

module.exports = new FeedbackForm();
