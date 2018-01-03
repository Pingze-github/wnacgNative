
const pictureCtrl = require('../../ctrls/api/picture');

module.exports = {
  get: {
    '/': pictureCtrl.list,
  },
};