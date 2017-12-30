
module.exports = {
  name: 'unsubscribeAcct',
  schema: {
    Acct: String,
    createtime: Date
  },
  option: {
    versionKey:false
  },
  index: [
    {Acct: 1}
  ],
  method: {

  }
};