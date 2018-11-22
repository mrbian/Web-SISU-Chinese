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
    const data = await spider.search(skey, limit, offset);
    ctx.body = {
      code: 1,
      msg: data,
    };
  }
}

module.exports = new SpiderController();
