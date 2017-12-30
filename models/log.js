
module.exports = {
  name: 'log',
  schema: {
    // 收发信息
    senderID: String,
    receiverAcct: String,
    // 邮件信息
    templateID: String,
    params: {},
    title: String,
    // 时间
    createtime: Date
  },
  option: {
    versionKey:false
  },
  index: [
    {createtime: -1}
  ],
  method: {

  }
};