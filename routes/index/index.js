
const homeCtrl = require('../../ctrls/home');

module.exports = {
  get: {
    '/': homeCtrl.index
  }
};