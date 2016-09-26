const contentApi = require('../../lib/content-api');

function index(req, res, next) {
  const type = req.params.type || 'index';
  const view = req.params.page || '';
  const record = contentApi.getRecord(`${type}/${view}`);

  if (record) {
    const data = record;
    data.feedback = true;

    res.render(`_layouts/${record.layout}`, record);
  } else {
    res.render(`${type}/${view}`, {
      feedback: true,
    }, (err, html) => {
      if (err) {
        next(err);
      } else {
        res.send(html);
      }
    });
  }
}

module.exports = {
  index,
};
