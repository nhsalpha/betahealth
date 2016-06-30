const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const nunjucks = require('nunjucks');
const enforce = require('express-sslify');
const churchill = require('churchill');
const validator = require('express-validator');

const logger = require('../lib/logger');
const checkSecure = require('../app/middleware/check-secure');
const locals = require('../app/middleware/locals');
const assetPath = require('../app/middleware/asset-path');
const feedback = require('../app/middleware/feedback');
const router = require('./routes');

module.exports = (app, config) => {
  app.set('views', `${config.root}/app/views`);
  app.set('view engine', 'nunjucks');
  nunjucks.configure(`${config.root}/app/views`, {
    autoescape: true,
    express: app,
  });

  if (!config.ci) {
    app.use(churchill(logger));
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(cookieParser());
  app.use(validator());
  app.use(compress());
  app.use(methodOverride());
  app.use(checkSecure({
    trustProtoHeader: config.trustProtoHeader,
    trustAzureHeader: config.trustAzureHeader,
  }));

  app.use(express.static(`${config.root}/public`));
  if (config.env !== 'production') {
    app.use(express.static(`${config.root}/.tmp`));
  }

  if (config.env !== 'development') {
    app.use(express.static(`${config.root}/build`));

    app.use(helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: [
          '\'self\'',
        ],
        scriptSrc: [
          '\'self\'',
          '\'unsafe-inline\'',
          'data:',
          'www.google-analytics.com',
          's.webtrends.com',
          'statse.webtrendslive.com',
        ],
        imgSrc: [
          '\'self\'',
          'www.google-analytics.com',
          'statse.webtrendslive.com',
          'hm.webtrends.com',
        ],
        fontSrc: [
          (config.staticCdn ? config.staticCdn.replace('//', '') : null),
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
  }

  // custom middlewares
  app.use(locals(config));
  app.use(assetPath(config));
  app.use(feedback());

  // router
  app.use('/', router);

  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: config.env === 'development' ? err : {},
      title: 'Error',
    });
  });
};
