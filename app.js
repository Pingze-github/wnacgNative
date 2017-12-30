const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// 捕获Promise异常
process.on('unhandledRejection', (rej) => {
  console.error(rej);
});

require('./global');

const app = express();

// 安装渲染引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon('./public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 使用格式化返回中间件
const resFsend = require('./middlewares/resFsend');
app.use(resFsend());

// 使用路由
const router = require('./routes');
app.use(router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  if (!err.status === 404) console.error(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen($config.port, () => {
  console.log('Server start @ ', $config.port);
});

