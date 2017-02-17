const $ = require('jquery');
const cookieMessage = require('./modules/cookie-message');
const details = require('./modules/details');
const feedbackForm = require('./modules/feedback-form');
const analytics = require('./modules/analytics');
const labelFocus = require('./modules/label-focus');
const labelSelect = require('./modules/label-select');
const tabs = require('./modules/tabs');
const print = require('./modules/print');

cookieMessage('global-cookies-banner');

$(() => {
  details.init();
  feedbackForm.init();
  analytics.init();
  labelFocus.init();
  labelSelect.init();
  tabs.init();
  print.init();
});
