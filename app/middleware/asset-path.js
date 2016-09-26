/* eslint-disable no-param-reassign, global-require */
const logger = require('../../lib/logger');

const manifestPath = '../../build/rev-manifest.json';
let manifestFile = {};

try {
  manifestFile = require(manifestPath);
} catch (e) {
  logger.warn(`No asset manifest file found. This is only a concern if running
    in production after revisioning assets.`);
}

function isLocalPath(path) {
  let local = true;

  if (path.indexOf('://') !== -1) {
    local = false;
  }

  if (path.indexOf('/') === 0) {
    local = false;
  }

  return local;
}

module.exports = (config, env) => {
  return function assetPath(req, res, next) {
    env.addGlobal('asset_path', (filename) => {
      let assetRoot = '';

      if (isLocalPath(filename)) {
        assetRoot = '/';

        if (config.staticCdn) {
          assetRoot = config.staticCdn;
        } else if (config.env === 'production') {
          assetRoot = `${(req.isHttps ? 'https' : req.protocol)}://${req.get('host')}/`;
        }

        if (manifestFile[filename]) {
          filename = manifestFile[filename];
        }
      }

      return `${assetRoot}${filename}`;
    });
    next();
  };
};
