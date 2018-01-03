
const comicCtrl = require('../../ctrls/api/comic');

module.exports = {
  get: {
    '/': comicCtrl.list,
  },
};