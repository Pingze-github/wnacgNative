
module.exports = {
  name: 'comic',
  schema: {
    aid: Number,
    path: String,
    title: String,
    author: String,
    coverPath: String,
    pageNum: Number,
    ctime: Date
  },
  option: {
    versionKey:false
  },
  index: [
    {ctime: 1},
  ],
  method: {
    async add(body) {
      if (!await this.findOne({aid: body.aid})) {
        return await this.create(body);
      }
    }
  }
};