
module.exports = function () {
  return function (req, res, next) {
    res.fsend = function (body) {
      if (!body) body = {};
      if (!body.code) body.code = 0;
      if (!body.msg) body.msg = "请求成功";
      if (!body.data) body.data = {};
      res.json({
        code: body.code,
        msg: body.msg,
        data: body.data,
      });
    };
    next();
  };
};