const bbchskConfig = require('../config').bbchskConfig;
const request = require('superagent');

class Spider {
  async search(key, limit, offset) {
    try {
      console.log(bbchskConfig.getQueryUrl(key, limit, offset));
      const res = await request
        .get(bbchskConfig.getQueryUrl(key, limit, offset))
        .set('Accept', 'application/json')
        .set('User-Agent', 'Mozilla/5.0');
      return JSON.parse(res.text.trim());
    } catch (err) {
      console.log(err);
      return {
        total: 0,
      };
    }
  }
}

module.exports = new Spider();
