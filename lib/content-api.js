const request = require('request');
const config = require('../config/config');
const fsContentApi = require('./fs-content-api');

const ContentApi = function ContentApi() {
  this.API_BASEURL = config.contentApi.baseUrl || 'http://localhost:8000';
};


function transformData(obj) {
  function transformComponents(components) {
    return components.map((component) => {
      const cloned = Object.assign({}, component);

      if (cloned.value !== undefined) {
        cloned.content = cloned.value;
      }

      return cloned;
    });
  }

  return {
    layout: 'content-sidebar-last',
    title: obj.title,
    nonEmergencyCallout: true,
    choicesOrigin: '',
    localHeader: [
      {
        type: 'markdown',
        content: obj.intro,
      },
    ],
    main: transformComponents(obj.body),
    sidebar: transformComponents(obj.aside),
  };
}

ContentApi.prototype.getRecordById = function getRecordById(pk) {
  return new Promise((resolve, reject) => {
    return request({
      method: 'GET',
      uri: `${this.API_BASEURL}/api/v2/pages/${pk}/`,
      headers: {
        'Content-Type': 'application/json',
      },
    }, (error, response, body) => {
      if (error) {
        return reject(error);
      }

      if (response.statusCode === 200) {
        const obj = transformData(JSON.parse(body));
        return resolve(obj);
      }

      return reject(new Error(response));
    });
  });
};

ContentApi.prototype.getRecord = function getRecord(slug) {
  return new Promise((resolve, reject) => {
    return request({
      method: 'GET',
      uri: `${this.API_BASEURL}/api/v2/pages/?url_path=/home/${slug}/`,
      headers: {
        'Content-Type': 'application/json',
      },
    }, (error, response, body) => {
      if (error) {
        return reject(error);
      }

      if (response.statusCode === 200) {
        const jsonBody = JSON.parse(body);

        if (!jsonBody.items.length) {
          return resolve(
            fsContentApi.getRecord(slug)
          );
        }

        return resolve(this.getRecordById(jsonBody.items[0].id));
      }

      return reject(new Error(response));
    });
  });
};

module.exports = new ContentApi();
