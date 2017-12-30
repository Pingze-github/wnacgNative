
async function list(req, res) {
  res.fsend({data: await $mdb.sender.list(req.query.page, req.query.pagesize)})
}

async function add(req, res) {
  let data = await $mdb.sender.add(req.body);
  if (data) res.fsend({data});
  else res.fsend({code:1, msg: '添加失败，账号重复'});
}

async function edit(req, res) {
  let data = await $mdb.sender.edit(req.body._id, req.body);
  if (data.n) res.fsend();
  else res.fsend({code:1, msg: '修改失败，条目不存在'});
}

async function del(req, res) {
  let data = await $mdb.sender.del(req.body._id);
  if (data.n) res.fsend();
  else res.fsend({code:1, msg: '删除失败，条目不存在'});
}

// 参数验证
list = $validate(list, {
  query: {
    page: {$to: 'int', $default: 1},
    pagesize: {$to: 'int', $default: 20}
  }
});
add = $validate(add, {
  body: {
    acct: {},
    pass: {},
  }
});
edit = $validate(edit, {
  body: {
    _id: {$length: 24},
    acct: {$default: null},
    pass: {$default: null},
  }
});
del = $validate(del, {
  body: {
    _id: {$length: 24}
  }
});

module.exports = {
  list,
  add,
  del,
  edit
};
