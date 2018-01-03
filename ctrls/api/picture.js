
const requester = require('../../utils/webPicker').requester;

function parsePicList(body) {
  function parseVar(varName) {
    const matches = body.match(new RegExp(`var ${varName} {0,1}= {0,1}(.+?);"`));
    if (!matches) return '';
    return matches[1].replace(/\\/g, '');
  }
  eval('var fast_img_host = ' + parseVar('fast_img_host'));
  eval('var imglist = ' + parseVar('imglist'));
  return imglist;
}

async function list(req, res) {
  const gurl = `http://${$config.wnacgHost}/photos-gallery-aid-${req.query.aid}.html`;

  const body = await requester(gurl);
  console.log(body);
  const picList = parsePicList(body);
  res.fsend({data: picList});
}

list = $validate(list, {
  query: {
    aid: {$to: 'int'}
  }
});

module.exports = {
  list
};