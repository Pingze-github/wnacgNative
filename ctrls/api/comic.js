
async function list(req, res) {
  const {page, pagesize} = req.query;
  const comicList = await $mdb.comic.find().sort({aid:-1}).skip((page - 1) * pagesize).limit(pagesize);
  res.fsend({data: comicList});
}

list = $validate(list, {
  query: {
    page: {$to: 'int', $default: 1},
    pagesize: {$to: 'int', $default: 20}
  }
});

module.exports = {
  list
};