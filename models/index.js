
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Schema = mongoose.Schema;

const mdb = {};

const options = {
  useMongoClient : true,
  autoReconnect: true,
  poolSize: 10,
  keepAlive: true
};

mongoose.connect($config.mongo.url, options, (err) => {
  if (err) return console.log(err);
  console.log(`Mongoose connected @ ${$config.mongo.url} !`)
});

function buildModel(modelSet) {
  modelSet.schema = new Schema(modelSet.schema, modelSet.option);
  if (modelSet.index) modelSet.index.forEach(index => {
    if (Array.isArray(index)) modelSet.schema.index(index[0], index[1]);
    else modelSet.schema.index(index);
  });
  const model = mongoose.model(modelSet.name, modelSet.schema);
  if (modelSet.method) _.forEach(modelSet.method, (fn, fname) => model[fname] = function () {return fn.apply(model, arguments)});
  mdb[modelSet.name] = model;
}

fs
  .readdirSync(__dirname)
  .filter((file) => file.includes('.js') && file !== 'index.js')
  .forEach((file) => {
    const modelSet = require(path.join(__dirname, file));
    buildModel(modelSet);
  });

module.exports = mdb;