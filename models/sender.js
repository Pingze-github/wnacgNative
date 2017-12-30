
module.exports = {
  name: 'sender',
  schema: {
    acct: String,
    pass: String,
    createtime: Date
  },
  option: {
    versionKey: false
  },
  index: [
    [{acct: 1}, {unique: 1}]
  ],
  method: {
    async list() {
      return await this.find().sort({_id:-1});
    },
    async add(body) {
      body.createtime = new Date();
      let res;
      try {
        res = await this.create(body);
      } catch (err) {}
      if (res) {
        return res._id;
      }
    },
    async del(_id) {
      let res = await this.remove({_id});
      if (res.result) return res.result;
      else return res;
    },
    async edit(_id, body) {
      if (body._id) body = _.omit(body, '_id');
      let res = await this.update({_id}, {$set: body});
      if (res) return res;
    }
  }
};