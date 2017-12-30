
console.log('Global var loaded');

global.ROOT_PATH = __dirname;

global._ = require('lodash');
global.$config = require('./config');
global.$mdb = require('./models');
global.$utils = require('./utils');
global.$validate = require('./utils/paramValidator')({errorResponse: {code: 9, msg:'参数校验错误', data: '$result'}});
