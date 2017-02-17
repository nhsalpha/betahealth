/* globals window, document */

const $ = require('jquery');

const Details = function Details() {
  this.NATIVE = typeof document.createElement('details').open === 'boolean';
};

Details.prototype.init = function init() {
  this.bindEvents();
  this.render();
};

Details.prototype.bindEvents = function bindEvents() {
  $(window).on('hashchange', this.render);
};

Details.prototype.render = function render() {
  const $details = $(window.location.hash);

  if ($details.length > 0) {
    $details
      .attr('open', true)
      .find('summary')
        .attr('aria-expanded', true)
        .focus();

    $details.find('> div')
        .attr('aria-hidden', 'false')
        .attr('role', 'alert');
  }
};

module.exports = new Details();
