
const validator = require('./validator');

// TODO 优化validator
// TODO 定义errorResponse时可以使用validator结果

// 用于包装控制器，进行参数验证
module.exports = function (options) {
  if (!options.errorResponse) options.errorResponse = '参数校验错误';  // 闭包，为validate函数保存配置
  return function validate(ctrl, schema) {
    return function (req, res) {
      let vRes = validator(req, schema, true);
      for (let k in options.errorResponse) {
        if (options.errorResponse[k] === '$result') {
          options.errorResponse[k] = vRes;
        }
      }
      if (vRes.code) return res.send(options.errorResponse);
      else ctrl.apply(null, [req, res]);
    }
  };
};

// 使用示例
/*
1、全局初始化检查函数
  validata = module.exports({errorResponse: {code: 9, msg:'参数校验错误', data:{}}});
2、用检查函数装饰控制器
  ctrlAdd = validate(ctrlAdd, {
   body: {
     mobilePhone: {$reg: /^\d{11}$/, $to: 'int'}
   }
  });
*/