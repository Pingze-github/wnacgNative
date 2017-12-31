
const cmdCtrl = require('../../ctrls/api/cmd');

module.exports = {
  get: {
    '/getcomics': cmdCtrl.getComics,
  },
};