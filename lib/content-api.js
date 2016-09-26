const path = require('path');
const fs = require('fs');

const ContentApi = function ContentApi() {
  this.CONTENT_ROOT = path.resolve(__dirname, '..', 'content');
};

function loadFile(filepath) {
  let filecontents;

  try {
    fs.accessSync(filepath, fs.F_OK);
    filecontents = fs.readFileSync(filepath, 'utf8').trim();
  } catch (e) {
    filecontents = false;
  }

  return filecontents;
}

function transformData(obj, dirpath) {
  return Object.keys(obj).reduce((previous, key) => {
    const value = obj[key];
    const prevObj = previous;

    if (Array.isArray(value)) {
      Object.keys(value).forEach((item) => {
        if (value.hasOwnProperty(item) && typeof value[item] === 'object') {
          value[item] = transformData(value[item], dirpath);
        }
      });

      prevObj[key] = value;
    } else if (typeof value === 'object') {
      prevObj[key] = transformData(value, dirpath);
    } else if (typeof value === 'string' && value.indexOf('!file=') !== -1) {
      const filepath = value.replace('!file=', '');
      prevObj[key] = loadFile(path.resolve(dirpath, filepath));
    } else {
      prevObj[key] = value;
    }

    return prevObj;
  }, {});
}

ContentApi.prototype.getRecord = function getRecord(slug) {
  const dirpath = path.resolve(this.CONTENT_ROOT, slug);
  const filepath = path.resolve(dirpath, 'manifest.json');
  const record = loadFile(filepath);

  if (!record) {
    return false;
  }
  return transformData(JSON.parse(record), dirpath);
};

module.exports = new ContentApi();
