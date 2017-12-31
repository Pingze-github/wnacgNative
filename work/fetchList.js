
const later = require('later');
later.date.localTime();
const webPicker = require('../utils/webPicker');

async function getLastPageNum() {
  const indexPageUrl = `http://${$config.wnacgHost}/albums.html`;
  const plan = {
    url: indexPageUrl,
    list: [{
      item: 'div.paginator>a',
      save: {
        lastpage: 'text'
      }
    }]
  };
  const pickRes = await webPicker.pick(plan);
  return pickRes[pickRes.length - 1].lastpage;
}

async function getPageList(num) {
  const pageUrl = `http://${$config.wnacgHost}/albums-index-page-${num}.html`;
  const plan = {
    url: pageUrl,
    list: [{
      item: 'ul.cc>li.gallary_item',
      save: {
        path: 'div.title>a # attr:href',
        title: 'div.title>a # text',
        coverPath: 'div.pic_box img # attr:src',
        more: 'div.info>div.info_col # text'
      }
    }]
  };
  return await webPicker.pick(plan);
}

function parseAuthor(title) {
  const tabs = title.match(/\[.+?\]/g);
  if (tabs) {
    for (let tab of tabs) {
      if (!new RegExp($config.notAuthorReg).test(tab)) {
        return tab.replace(/[\[\]]/g, '');
      }
    }
  }
  return '佚名';
}

async function saveComic(comicData) {
  comicData.aid = comicData.path.match(/aid\-(\d+)\.html/)[1];
  comicData.author = parseAuthor(comicData.title);
  comicData.pageNum = comicData.more.match(/\d+/)[0];
  comicData.ctime = new Date(comicData.more.match(/\d+\-\d+\-\d+/)[0]);
  comicData = _.omit(comicData, 'more');
  return await $mdb.comic.add(comicData);
}

async function getStorePages() {
  const lastPageNum = await getLastPageNum();
  console.log('最后页数', lastPageNum);
  for (let pageNum = lastPageNum; pageNum >= 1; pageNum --) {
    console.log(`正在获取第 ${pageNum} 页...`);
    let commicList = [];
    try {
      commicList = await getPageList(pageNum);
    } catch (e) {}
    for (comic of commicList) {
      let saveRet = await saveComic(comic);
      if (saveRet) console.log(`${comic.title} 保存成功`)
    }
  }
}

getStorePages = $utils.onlyOneWrapper(getStorePages);

function boot() {
  later.setInterval(getStorePages, later.parse.cron('30 5,17'));
}

module.exports = {
  boot,
  getStorePages
};