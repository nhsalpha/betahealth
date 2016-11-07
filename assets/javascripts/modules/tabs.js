const $ = require('jquery');
// eslint-disable-next-line no-unused-vars
const tabs = require('../vendor/jquery.tabs');

module.exports = {
  init: () => {
    $('.js-tabs').tabs({
      updateHash: true,
      scrollOnload: true,
      tabActiveClass: 'is-active',
      navActiveClass: 'is-active',
    });
  },
};
