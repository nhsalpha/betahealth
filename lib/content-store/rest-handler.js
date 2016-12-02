const request = require('request');
const crypto = require('crypto');
const _ = require('lodash');

const config = require('../../config/config');

const BASEURL = config.contentStore.baseUrl;
const AUTH_TOKEN = config.contentStore.authToken;
const TIMEOUT = config.contentStore.timeout;
const IMAGE_PROXY_PATH = config.contentStore.imageProxyPath;
const IMAGE_SIGNATURE_KEY = config.contentStore.imageSignatureKey;
const DEFAULT_IMAGE_SIZES = [400, 640, 800, 1280];
const FIGURE_IMAGE_SIZES = [300, 600];

function transformImage(obj, sizes) {
  if (!IMAGE_SIGNATURE_KEY) {
    return obj;
  }

  const image = obj;
  image.srcset = image.srcset || [];

  sizes.forEach((size) => {
    const imgString = `${image.id}/width-${size}/`;
    const hmacSha1 = crypto.createHmac('sha1', IMAGE_SIGNATURE_KEY).update(imgString).digest('base64');
    const signature = hmacSha1.replace(/\+/, '-').replace(/\//, '_');

    image.srcset.push(`${IMAGE_PROXY_PATH}/${signature}/${imgString}${image.version}/${image.slug} ${size}w`);
  });

  return image;
}

function transform(obj) {
  if (!_.isPlainObject(obj)) {
    return null;
  }

  return Object.keys(obj).reduce((previous, key) => {
    const value = obj[key];
    const prevObj = previous;

    if (_.isArray(value)) {
      Object.keys(value).forEach((item) => {
        if (_.isPlainObject(value[item])) {
          if (value[item].hasOwnProperty('meta') && value[item].meta.type === 'images.Image') {
            value[item] = transformImage(value[item], FIGURE_IMAGE_SIZES);
          } else {
            value[item] = transform(value[item]);
          }
        }
      });

      prevObj[key] = value;
    } else if (_.isPlainObject(value)) {
      if (value.hasOwnProperty('meta') && value.meta.type === 'images.Image') {
        prevObj[key] = transformImage(value, DEFAULT_IMAGE_SIZES);
      } else {
        prevObj[key] = transform(value);
      }
    } else {
      prevObj[key] = value;
    }

    return prevObj;
  }, {});
}

const RestHandler = {
  name: 'HTTP REST',
  get(pathname) {
    return new Promise((resolve, reject) => {
      if (!BASEURL) {
        return reject(new Error('Content store base URL not set'));
      }

      return request({
        method: 'GET',
        json: true,
        timeout: TIMEOUT,
        uri: `${BASEURL}/api/pages/with-path/${pathname}/`,
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }, (error, response, body) => {
        if (error) {
          return reject(error);
        }

        if (response.statusCode === 200) {
          const record = body;
          let layout = 'content-simple';

          if (record.sidebarOrder && record.sidebar.length && record.sidebar.length > 0) {
            layout = `content-sidebar-${record.sidebarOrder}`;
          }

          record.layout = layout;
          return resolve(transform(record));
        }

        return reject(new Error(response));
      });
    });
  },
};

module.exports = RestHandler;