
const cheerio = require('cheerio');
const request = require('request');

const defaultHeaders = {
  'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36'
};

function requester(url, headers) {
  headers = headers || {};
  headers = _.assign(defaultHeaders, headers);
  return new Promise((resolve, reject) => {
    const options = {
      url: url,
      headers: headers,
      timeout: 3000
    };
    request(options, (err, res, body) => {
      if (err) return reject(err);
      resolve(body);
    });
  });
}

requester = $utils.retryWrapper(requester, 5);

function parseFinder(finder) {
  let pathes, propName, propKey;
  const pathSplitIndex = finder.indexOf('#');
  const keySplitIndex = finder.indexOf(':');
  if (pathSplitIndex !== -1) {
    pathes = finder.substring(0, pathSplitIndex).split('/');
    pathes = pathes.map(v => v.trim());
  }
  if (keySplitIndex !== -1) {
    propKey = finder.substring(keySplitIndex + 1);
  }
  propName = finder.substring(pathSplitIndex + 1, keySplitIndex !== -1 ? keySplitIndex : void 0).trim();
  return {pathes, propName, propKey};
}

function doDealer(dealers, list) {
  dealers.forEach((dealer) => {
    dname = Object.keys(dealer)[0];
    dbody = dealer[dname];
    if (dname === 'map') list = list.map(dbody);
    else if (dname === 'omit') {
      list = list.map(v => {
        const ov = {};
        for (let k in v) if (!dbody.includes(k)) ov[k] = v[k];
        return ov;
      });
    }
  });
  return list;
}


function recurseSave(base, map) {
  let list = [];
  const $items = base.find(map.item);
  if ($items.length === 0) throw new Error(`Nothing match item selector "${map.item}"`);
  let items = [];
  $items.each((i, item) => items.push(cheerio(item)));

  // items筛选
  if (map.range) {
    items = items.filter((v, i) => {
      if (i > map.range[0] || 0 && i < map.range[1]>=0 ? map.range[1] : item.length - map.range[1]) return true;
    });
  }
  if (map.filter) items = items.filter(map.filter);

  if (typeof map.save === 'string') {
    const {pathes, propName, propKey} = parseFinder(map.save);
    for (item of items) {
      let $tag = item;
      if (pathes) {
        pathes.forEach(path => $tag = item.find(path));
      }
      try {
        saveValue = $tag[propName](propKey);
      } catch (err) {
        if (err instanceof TypeError) {
          throw new Error(`UnSupport query function "${propName}"`)
        }
      }
      list.push(saveValue);
    }
  } else {
    for (item of items) {
      const result = {};
      list.push(result);
    }
    for (let saveKey in map.save) {
      if (!map.save.hasOwnProperty(saveKey)) continue;
      const saveFinder = map.save[saveKey];
      if (typeof saveFinder === 'string') {
        const {pathes, propName, propKey} = parseFinder(saveFinder);
        items.forEach((item, i) => {
          let $tag = item;
          if (pathes) {
            pathes.forEach(path => $tag = item.find(path));
          }
          saveValue = $tag[propName](propKey);
          list[i][saveKey] = saveValue;
        });
      } else {
        items.forEach((item, i) => {
          list[i][saveKey] = [];
          list[i][saveKey] = recurseSave(item, saveFinder);
        });
      }
    }
  }
  if (map.dealer) {
    list = doDealer(map.dealer, list);
  }
  return list;
}

async function planPicker(plan) {
  let resultList = [];
  const html = await requester(plan.url, plan.headers);
  const $ = cheerio.load(html);
  if (Object.prototype.toString.call(plan.list) !== '[object Array]') {
    plan.list = [plan.list];
  }
  plan.list.forEach(map => {
    thisResultList = recurseSave($('html'), map);
    resultList = resultList.concat(thisResultList);
  });
  if (Object.prototype.toString.call(plan.list) !== '[object Array]') return resultList[0];

  return resultList;
}


module.exports = {
  pick: planPicker,
  requester,
};