
const fs = require('fs');
const path = require('path');
const express = require('express');

// 说明：
// ROOT/routes/ 文件夹下，每个文件夹作为一个子路由，路径为文件夹名
// 每个子路由文件夹下，每个文件包含一些路由映射
// 每个映射都包含文件名自身
// 即完整路径 = /子路由路径/文件名/映射路径

// *文件夹名为index时，将忽略文件夹名
// *文件名为index.js时，将忽略文件名
// *子路由文件夹下 非.js后缀名的文件 或 文件夹 会被忽略

// TODO 支持多层文件夹自动递归路由

function createChildRouter(childDir) {
  let router = express.Router();
  fs.readdirSync(childDir).forEach((file) => {
    if (!file.includes('.js')) return;
    let fpath = '/' + file.substring(0, file.lastIndexOf('.'));
    if (fpath === '/index') fpath = '';
    const routeMap = require(path.join(childDir, file));
    const methodList = ['get','post','put','delete'];
    methodList.forEach(method => {
      if (routeMap[method]) {
        for (let rpath in routeMap[method]) {
          if (!routeMap[method].hasOwnProperty(rpath)) continue;
          router[method](fpath + rpath, routeMap[method][rpath])
        }
      }
    });
  });
  return router;
}

const router = express.Router();

fs.readdirSync(__dirname).forEach((dirName) => {
  let dirPath = path.join(__dirname, dirName);
  let stats = fs.lstatSync(dirPath);
  if (stats.isDirectory()) {
    let childRouter = createChildRouter(dirPath);
    let cpath = '/' + (dirName === 'index' ? '' : dirName);
    router.use(cpath, childRouter);
  }
});

module.exports = router;


