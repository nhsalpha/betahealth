const $ = require('jquery');
const cookieMessage = require('./modules/cookie-message');
const feedbackForm = require('./modules/feedback-form');
const analytics = require('./modules/analytics');
const labelFocus = require('./modules/label-focus');
const labelSelect = require('./modules/label-select');
const tabs = require('./modules/tabs');

cookieMessage('global-cookies-banner');

$(() => {
  feedbackForm.init();
  analytics.init();
  labelFocus.init();
  labelSelect.init();
  tabs.init();
});
