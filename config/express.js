const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const nunjucks = require('nunjucks');
const markdown = require('nunjucks-markdown');
const md = require('markdown-it')({
  html: true,
  typographer: true,
});
const markdownItAbbr = require('markdown-it-abbr');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItContainer = require('markdown-it-container');
const enforce = require('express-sslify');
const churchill = require('churchill');
const validator = require('express-validator');
const csrf = require('csurf');
const changeCase = require('change-case');
const logger = require('../lib/logger');
const checkSecure = require('../app/middleware/check-secure');
const locals = require('../app/middleware/locals');
const assetPath = require('../app/middleware/asset-path');
const feedback = require('../app/middleware/feedback');
const csrfToken = require('../app/middleware/csrf-token');
const affinityCookie = require('../app/middleware/affinity-cookie');
const router = require('./routes');

md.use(markdownItAbbr);
md.use(markdownItAttrs);
md.use(markdownItContainer, 'info', {
  marker: '!',
  render: (tokens, idx) => {
    if (tokens[idx].nesting === 1) {
      return '<section class="callout callout__info">\n';
    }
    return '</section>\n';
  },
});
md.use(markdownItContainer, 'warning', {
  marker: '!',
  render: (tokens, idx) => {
    if (tokens[idx].nesting === 1) {
      return '<section class="callout callout__warning">\n';
    }
    return '</section>\n';
  },
});
md.use(markdownItContainer, 'alert', {
  marker: '!',
  render: (tokens, idx) => {
    if (tokens[idx].nesting === 1) {
      return '<section class="callout callout__alert callout__overlap" id="emergency-info">\n';
    }
    return '</section>\n';
  },
});
md.use(markdownItContainer, 'article', {
  marker: '!',
  render: (tokens, idx) => {
    if (tokens[idx].nesting === 1) {
      return '<article class="section-unit">\n';
    }
    return '</article>\n';
  },
});
md.use(markdownItContainer, 'section', {
  marker: ':',
  render: (tokens, idx) => {
    if (tokens[idx].nesting === 1) {
      return '<section>\n';
    }
    return '</section>\n';
  },
});

module.exports = (app, config) => {
  app.set('views', `${config.root}/app/views`);
  app.set('view engine', 'nunjucks');

  const nunjucksEnv = nunjucks.configure(`${config.root}/app/views`, {
    autoescape: true,
    express: app,
  });
  nunjucksEnv.addFilter('split', (str, seperator) => {
    return str.split(seperator);
  });
  nunjucksEnv.addFilter('kebabcase', (str) => {
    return changeCase.paramCase(str);
  });
  nunjucksEnv.addGlobal('loadComponent', function loadComponent(name) {
    return (name) ? this.ctx[name] : this.ctx;
  });

  markdown.register(nunjucksEnv, (body) => {
    return md.render(body);
  });

  if (!config.ci) {
    app.use(churchill(logger));
  }

  app.use(locals(config));

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
  app.use(assetPath(config, nunjucksEnv));
  app.use(feedback());

  app.use(csrf({
    cookie: true,
  }));
  app.use(csrfToken());

  app.use(compress());
  app.use(methodOverride());

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
          config.staticCdn,
        ],
        scriptSrc: [
          '\'self\'',
          '\'unsafe-inline\'',
          'data:',
          'www.google-analytics.com',
          's.webtrends.com',
          'statse.webtrendslive.com',
          'static.hotjar.com',
          'script.hotjar.com',
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
          'fast.fonts.net',
          config.staticCdn,
        ],
        fontSrc: [
          'fast.fonts.net',
          config.fontCdn,
        ],
        connectSrc: [
          '\'self\'',
          'https://*.hotjar.com',
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
  app.use('/', router);

  app.use((req, res, next) => {
    const err = new Error('Page not found');
    err.status = 404;
    next(err);
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    let message = err.message;

    if (err.code === 'EBADCSRFTOKEN') {
      message = 'Invalid form token';
    }

    if (err.message.indexOf('template not found') !== -1) {
      // eslint-disable-next-line no-param-reassign
      err.status = 404;
      message = 'Page not found';
    }

    if (err.status !== 404) {
      logger.error(err);
    }

    res.status(err.status || 500);
    res.render('error', {
      message,
      error: config.env === 'development' ? err : {},
      title: 'Error',
    });
  });
};
