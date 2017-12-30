
const senderCtrl = require('../../ctrls/api/sender');

module.exports = {
  get: {
    '/': senderCtrl.list,

  },
  post: {
    '/add': senderCtrl.add,
    '/del': senderCtrl.del,
    '/edit': senderCtrl.edit,
  }
};