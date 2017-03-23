const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const enforce = require('express-sslify');
const churchill = require('churchill');
const validator = require('express-validator');
const csrf = require('csurf');
const slashify = require('slashify');

const logger = require('../lib/logger');
const checkSecure = require('../app/middleware/check-secure');
const locals = require('../app/middleware/locals');
const feedback = require('../app/middleware/feedback');
const csrfToken = require('../app/middleware/csrf-token');
const affinityCookie = require('../app/middleware/affinity-cookie');

const nunjucks = require('./nunjucks');
const router = require('./routes');

module.exports = (app, config) => {
  app.set('views', `${config.root}/app/views`);
  app.set('view engine', 'nunjucks');

  if (!config.ci) {
    app.use(churchill(logger));
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(cookieParser());
  app.use(validator());
  app.use(checkSecure({
    trustProtoHeader: config.trustProtoHeader,
    trustAzureHeader: config.trustAzureHeader,
  }));
  app.use(locals(config));
  app.use(feedback());

  app.use(csrf({
    cookie: true,
  }));
  app.use(csrfToken());

  app.use(compress());
  app.use(methodOverride());

  // Needs to be registered after checkSecure for asset_path middleware
  nunjucks(app, config);

  app.use(favicon(path.join(__dirname, '..', 'assets', 'images', 'favicon.ico')));
  app.use(express.static(`${config.root}/public`));
  if (config.env !== 'production') {
    app.use(express.static(`${config.root}/.tmp`));
  }

  if (config.env !== 'development') {
    app.use(express.static(`${config.root}/build`));

    app.use(helmet.contentSecurityPolicy({
      loose: true,
      directives: {
        defaultSrc: [
          '\'self\'',
          config.staticCdn,
        ],
        frameSrc: [
          '\'self\'',
          '*.hotjar.com',
        ],
        scriptSrc: [
          '\'self\'',
          '\'unsafe-inline\'',
          'data:',
          'www.google-analytics.com',
          's.webtrends.com',
          'statse.webtrendslive.com',
          '*.hotjar.com',
          'cdn.jsdelivr.net',
          config.staticCdn,
        ],
        imgSrc: [
          '\'self\'',
          'data:',
          'www.google-analytics.com',
          'statse.webtrendslive.com',
          'hm.webtrends.com',
          config.staticCdn,
        ],
        styleSrc: [
          '\'self\'',
          '\'unsafe-inline\'',
          'fast.fonts.net',
          config.staticCdn,
        ],
        fontSrc: [
          'fast.fonts.net',
        ],
        connectSrc: [
          '\'self\'',
          'https://*.hotjar.com:*',
          'wss://*.hotjar.com',
        ],
      },
    }));
    app.use(helmet.xssFilter());
    app.use(helmet({
      frameguard: {
        action: 'deny',
      },
    }));
    app.use(helmet.hidePoweredBy());
    app.use(helmet.ieNoOpen());
    app.use(helmet.noSniff());

    // eslint-disable-next-line new-cap
    app.use(enforce.HTTPS({
      trustProtoHeader: config.trustProtoHeader,
      trustAzureHeader: config.trustAzureHeader,
    }));

    if (config.trustAzureHeader) {
      app.use(affinityCookie());
    }
  }

  // router
  app.use(slashify());
  app.use('/', router);

  app.use((req, res, next) => {
    const err = new Error('Page not found');
    err.status = 404;
    next(err);
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const error = err;
    let template = 'error';
    let title = 'Something went wrong';

    if (error.code === 'EBADCSRFTOKEN') {
      title = 'Invalid form token';
    }

    if (error.message.indexOf('template not found') !== -1) {
      error.status = 404;
    }

    if (error.status !== 404) {
      logger.error(error);
    }

    if (error.status === 404) {
      template = 'page-not-found';
      title = 'Page not found';
    }

    res.status(error.status || 500);
    res.render(template, {
      title,
      message: error.message,
      error: config.env === 'development' ? error : {},
    });
  });
};
