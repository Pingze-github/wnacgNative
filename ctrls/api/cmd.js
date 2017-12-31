
async function getComics(req, res) {
  require('../../work/fetchList').getStorePages();
  res.fsend({msg:'开始获取漫画列表'});
}

module.exports = {
  getComics
};