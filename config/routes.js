// eslint-disable-next-line new-cap
const router = require('express').Router();
const config = require('../config/config');
const elementsController = require('../app/controllers/elements');
const healthcheckController = require('../app/controllers/healthcheck');
const contentPageController = require('../app/controllers/content-page');

router.get('/', contentPageController.index);

if (config.env === 'development') {
  router.get('/elements', elementsController.index);
}

router.get('/healthcheck', healthcheckController.index);

router.all('/:type(conditions|symptoms|help)/:page', contentPageController.index);

module.exports = router;
