const spider = require('../spider/spider');

class SpiderController {
  async getbbchsk(ctx) {
    const skey = ctx.query.skey;
    if (!skey) {
      ctx.body = { code: 0 };
      return;
    }
    const limit = ctx.query.limit || 10;
    const offset = ctx.query.offset || 0;
    let data = await spider.search(skey, limit, offset);
    // 服务器性能太低
    // if (data.total) {
    //   data.instances = data.instances.map(ele => {
    //     ele.id = parseInt(ele.id, 10);
    //     return ele;
    //   });
    // }
    ctx.body = {
      code: 1,
      msg: data,
    };
  }
}

module.exports = new SpiderController();
