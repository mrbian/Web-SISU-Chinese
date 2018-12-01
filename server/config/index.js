module.exports = {

  bbchskConfig: {
    site: 'http://bcc.blcu.edu.cn/hsk/getRes',
    col: '["zh","jb"]',
    filter: '[]',
    type: 1,
    skind: 3,
    cjkey: '',
    restype: 'all',
    offset: 0,
    limit: 80,
    getQueryUrl(skey, limit, offset) {
      /**
       * 运行时才会得到this真正指向哪里
       */
      const self = this;
      limit = limit || self.limit;
      offset = offset || self.offset;
      return `${self.site}?col=${self.col}&filter=${self.filter}&type=${self.type}&skind=${self.skind}&skey=${encodeURIComponent(skey)}&cjkey=${self.cjkey}&restype=${self.restype}&offset=${offset}&limit=${limit}`;
    },

  },

};
