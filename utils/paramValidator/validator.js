/**
 * author: wang719695@gmail.com
 * date: 2017.7.17
 * version: 1.1.0
 * 验证request参数，并对部分参数进行处理
 */

/**
 * 参数检查主流程
 * @param schema
 * @param req
 * @returns *
 */

module.exports = function (req, schema) {
  for (let resParamType of ['body','query']) {
    if (schema[resParamType]) {
      let objSchema = schema[resParamType];
      let obj = req[resParamType];
      let result = validateObj(obj, objSchema, `req.${resParamType}`, req);
      if (result) return result;
      let resultNullCheck = validateNull(obj, objSchema , `req.${resParamType}`, req);
      if (resultNullCheck) return resultNullCheck;
    }
  }
  return {code: 0, msg: 'pass'};
};

/**
 * 按照属性链路径赋值，在一定级数内代替eval
 * @param path
 * @param value
 * @param req
 */
function assign(path, value, req) {
  let patterns = path.split('.');
  let nodes = [];
  for (let pattern of patterns) {
    if (pattern.includes('[')) {
      let first = pattern.match(/^(.+?)\[/)[1];
      let others = pattern.match(/[(\d+)]/g);
      nodes.push(first);
      nodes = nodes.concat(others);
    } else {
      nodes.push(pattern);
    }
  }
  switch (nodes.length) {
    case 2:
      req[nodes[1]] = value;
      break;
    case 3:
      req[nodes[1]][nodes[2]] = value;
      break;
    case 4:
      req[nodes[1]][nodes[2]][nodes[3]] = value;
      break;
    case 5:
      req[nodes[1]][nodes[2]][nodes[3]][nodes[4]] = value;
      break;
    default:
      eval(`${path}=value`);
  }
}

/**
 * 参数空检查和默认值赋予
 * @param obj
 * @param objSchema
 * @param objPath
 * @param req
 * @returns {*}
 */
function validateNull(obj, objSchema, objPath, req) {
  for (let paramKey in objSchema) {
    if (!('$default' in objSchema[paramKey] || (objSchema[paramKey][0] && '$default' in objSchema[paramKey][0]))){
      if (!(paramKey in obj)) {
        return {code: 5, msg: 'Missed param key expected in params', paramKey: `${objPath}.${paramKey}`};
      }
    } else {
      if (!(paramKey in obj)) {
        let defaultValue;
        if (matchType('array', objSchema[paramKey])) {
          defaultValue = objSchema[paramKey][0]['$default'];
        } else {
          defaultValue = objSchema[paramKey]['$default'];
        }
        assign(`${objPath}.${paramKey}`, defaultValue , req);
      }
    }
  }
  return 0;
}

/**
 * 对一个对象遍历检查
 * @param obj
 * @param objSchema
 * @param objPath
 * @param req
 * @returns {*}
 */
function validateObj (obj, objSchema, objPath, req) {
  if (!matchType('object', objSchema)) {
    throw TypeError('Schema found not an object');
  }
  for (let paramKey in obj) {
    let paramValue = obj[paramKey];
    if (objSchema.hasOwnProperty(paramKey)) {
      let schema =  objSchema[paramKey];
      if (matchType('object', schema)) {
        if (Object.keys(schema).length === 0) {
          continue;
        }
        // 判断参数对象类型
        let isRuleMap;
        if (matchType('array', schema)) {
          if (!JSON.stringify(schema) === '[{}]') {
            isRuleMap = (schema.length === 1 && Object.keys(schema[0])[0][0] === '$');
          }
        } else {
          isRuleMap = Object.keys(schema)[0][0] === '$';
          for (let key in schema) {
            if (schema.hasOwnProperty(key)) {
              if ((key[0] === '$') !== isRuleMap) {
                throw new Error('mixed use of rule & prop');
              }
            }
          }
        }
        if (matchType('string', paramValue)) {
          if ((!isRuleMap && matchType('object', schema)) || (isRuleMap && matchType('array', schema))) {
            try {
              paramValue = JSON.parse(paramValue);
              assign(`${objPath}.${paramKey}`, paramValue, req);
            } catch (e) {
              return {code: 3, msg: 'parse json to object error', paramKey, paramValue};
            }
          }
        }
        // 检查isArray不一致错误
        if (matchType('array', schema)) {
          if (!matchType('array', paramValue)) {
            return {
              code: 4,
              msg: 'param value is not an array when schema is an array',
              paramKey,
              paramValue
            };
          }
        }

        // 作为rulemap和object分别处理
        if (isRuleMap) {
          let ruleMap = schema;
          if (matchType('array', schema)) {
            ruleMap = ruleMap[0];
            let index = 0;
            for (let paramValueEach of paramValue) {
              for (let ruleName in ruleMap) {
                if (ruleMap.hasOwnProperty(ruleName)) {
                  let ruleValue = ruleMap[ruleName];
                  let validateResult = validate(ruleName, ruleValue, `${objPath}.${paramKey}[${index}]`, paramValueEach, req);
                  if (validateResult) return validateResult;
                }
              }
              index++;
            }
          } else {
            for (let ruleName in ruleMap) {
              if (ruleMap.hasOwnProperty(ruleName)) {
                let ruleValue = ruleMap[ruleName];
                /*                                if (ruleName === '$to') {
                                                    let transResult = transTo(ruleValue, , objPath)
                                                }*/
                let validateResult = validate(ruleName, ruleValue, `${objPath}.${paramKey}`, paramValue, req);
                if (validateResult) return validateResult;
              }
            }
          }
        } else {
          let objSchema = schema;
          if (matchType('array', objSchema)) {
            let index = 0;
            for (let paramValueEach of paramValue) {
              if (objSchema.length !== 1) {
                throw new Error(`Array schema of ${objPath}.${paramKey} cannot have one more value`);
              }
              let validateResult = validateObj(paramValueEach, objSchema[0], `${objPath}.${paramKey}[${index}]`, req);
              if (validateResult) return validateResult;
              index++;
            }
          } else {
            let validateResult = validateObj(paramValue, objSchema, `${objPath}.${paramKey}`, req);
            if (validateResult) return validateResult;
          }
        }
      } else {
        throw TypeError(`Schema of ${objPath}.${paramKey} found not an object`);
      }
    }
  }
}

/**
 * 检测规则和值是否匹配
 * @param ruleName
 * @param ruleValue
 * @param paramValue
 * @param paramKey
 * @param req
 * @returns {*}
 */
function validate(ruleName, ruleValue, paramKey, paramValue, req) {
  switch (ruleName) {
    case '$equal':
      if (matchEqual(ruleValue, paramValue)) return 0;
      break;
    case '$type':
      if (matchType(ruleValue, paramValue)) return 0;
      break;
    case '$reg':
      if (matchReg(ruleValue, paramValue)) return 0;
      break;
    case '$range':
      if (matchRange(ruleValue, paramValue)) return 0;
      break;
    case '$enum':
      if (matchEnum(ruleValue, paramValue)) return 0;
      break;
    case '$special':
      if (matchSpecial(ruleValue, paramValue)) return 0;
      break;
    case '$length' :
      if (matchLength(ruleValue, paramValue)) return 0;
      break;
    case '$lengthRange' :
      if (matchLengthRange(ruleValue, paramValue)) return 0;
      break;
    case '$filter' :
      if (matchFilter(ruleValue, paramValue)) return 0;
      break;
    case '$to' :
      if (matchTo(ruleValue, paramValue, paramKey, req)) return 0;
      break;
    case '$set' :
      set(ruleValue, paramKey, req);
      return 0;
    case '$computer' :
      if (matchComputer(ruleValue, paramValue, paramKey, req)) return 0;
      break;
    case '$default' :
      return 0;
      break;
    default:
      throw SyntaxError(`Meet invalid rule name ${ruleName} when checking ${paramKey}`);
  }
  return {code: 1, msg:'not match validate rules', ruleName, ruleValue, paramKey, paramValue};
}


/**
 * 匹配值相等（完全相等）
 * @param ruleValue
 * @param paramValue
 * @returns boolean
 */
function matchEqual(ruleValue, paramValue) {
  if (ruleValue === paramValue) {
    return true;
  }
  return false;
}

/**
 * 匹配正则（字符串）
 * @param ruleValue
 * @param paramValue
 * @returns boolean
 */
function matchReg(ruleValue, paramValue) {
  if (matchType('string', paramValue)) {
    if (paramValue.match(ruleValue)) {
      return true;
    }
  }
  return false;
}

/**
 * 匹配值类型
 * @param ruleValue
 * @param paramValue
 * @returns boolean
 */
function matchType(ruleValue, paramValue) {
  if (ruleValue === 'int') {
    if (typeof paramValue === 'number' && parseInt(paramValue) === paramValue) {
      return true;
    }
  }
  if (ruleValue === 'array'){
    if (Object.prototype.toString.call(paramValue) === '[object Array]') {
      return true;
    }
  }
  return (typeof paramValue === ruleValue);
}

/**
 * 匹配特殊规则
 * @param ruleValue
 * @param paramValue
 * @returns boolean
 */
function matchSpecial(ruleValue, paramValue) {
  if (ruleValue === 'ip') {
    if (matchReg(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, paramValue)){
      let patterns = paramValue.split('.');
      for (let patt in patterns) {
        if (parseInt(patt) < 0 && parseInt(patt) > 255) {
          return false;
        }
      }
      return true;
    }
  }
  return false;
}

/**
 * 匹配范围（数字）
 * @param ruleValue
 * @param paramValue
 * @returns boolean
 */
function matchRange(ruleValue, paramValue) {
  if (matchType('string', paramValue)) {
    paramValue = parseFloat(paramValue) ? parseFloat(paramValue) : paramValue;
  }
  if (matchType('number', paramValue)) {
    if (typeof ruleValue[0] === 'undefined' && typeof ruleValue[1] !== 'undefined') {
      if (ruleValue[1] >= paramValue) {
        return true;
      }
    } else if (typeof ruleValue[1] === 'undefined' && typeof ruleValue[0] !== 'undefined') {
      if (ruleValue[0] <= paramValue) {
        return true;
      }
    } else {
      if (ruleValue[0] <= paramValue && ruleValue[1] >= paramValue) {
        return true;
      }
    }
  }
  return false;
}

/**
 * 匹配枚举
 * @param ruleValue
 * @param paramValue
 * @returns boolean
 */
function matchEnum(ruleValue, paramValue) {
  return (ruleValue.includes(paramValue));
}

/**
 * 匹配长度（字符串或array）
 * @param ruleValue
 * @param paramValue
 * @returns boolean
 */
function matchLength(ruleValue, paramValue) {
  if (matchType('string', paramValue) || matchType('array', paramValue)) {
    if (paramValue.length === ruleValue) {
      return true;
    }
  }
  return false;
}

/**
 * 匹配长度范围（字符串或array）
 * @param ruleValue
 * @param paramValue
 * @returns boolean
 */
function matchLengthRange(ruleValue, paramValue) {
  if (matchType('string', paramValue) || matchType('array', paramValue)) {
    if (typeof ruleValue[0] === 'undefined' && typeof ruleValue[1] !== 'undefined') {
      if (ruleValue[1] >= paramValue.length) {
        return true;
      }
    } else if (typeof ruleValue[1] === 'undefined' && typeof ruleValue[0] !== 'undefined') {
      if (ruleValue[0] <= paramValue.length) {
        return true;
      }
    } else {
      if (ruleValue[0] <= paramValue.length && ruleValue[1] >= paramValue.length) {
        return true;
      }
    }
  }
  return false;
}

/**
 * 匹配过滤器
 * @param ruleValue
 * @param paramValue
 * @returns boolean
 */
function matchFilter(ruleValue, paramValue) {
  try {
    if (matchType('function', ruleValue)) {
      if (true === ruleValue(paramValue)) {
        return true;
      }
    }
  } catch (err) {
    console.log(err);
  }
  return false;
}

/**
 * 类型转换，并判断是否能成功
 * @param ruleValue
 * @param paramValue
 * @param paramPath
 * @param req
 * @returns boolean
 */
function matchTo(ruleValue, paramValue, paramPath, req) {
  try {
    let transValue;
    switch (ruleValue) {
      case 'number':
        transValue = Number(paramValue);
        break;
      case 'int':
        transValue = parseInt(paramValue);
        break;
      case 'float':
        transValue = parseFloat(paramValue);
        break;
      case 'string':
        transValue = String(paramValue);
        break;
      case 'boolean':
        transValue = (function (v) {
          if (v === 'true' || v === 'TRUE') {
            return true;
          }
          if (v === 'false' || v === 'FALSE') {
            return false;
          }
        })(paramValue);
        break;
      default:;
    }
    assign(`${paramPath}`, transValue, req);
    return true;
  } catch(err) {
    console.log(err);
    return false;
  }
}

/**
 * 直接赋值
 * @param ruleValue
 * @param paramValue
 * @param paramPath
 * @param req
 * @returns boolean
 */
function set(ruleValue, paramPath, req) {
  assign(`${paramPath}`, ruleValue, req);
  return true;
}

/**
 * 匹配计算器，赋计算结果
 * @param ruleValue
 * @param paramValue
 * @param paramPath
 * @param req
 * @returns boolean
 */
function matchComputer(ruleValue, paramValue, paramPath, req) {
  try {
    if (matchType('function', ruleValue)) {
      let transValue = ruleValue(paramValue);
      assign(`${paramPath}`, transValue, req);
      return true;
    }
  } catch (err) {
    console.log(err);
  }
  return false;
}
