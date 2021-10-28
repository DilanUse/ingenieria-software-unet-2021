const BaseConstructor = require('../../http/constructors/base.constructor');

class ExportConstructor extends BaseConstructor {
  constructor({
    path,
    url,
    tenant,
    creator,
  }) {
    super({
      tenant,
      creator,
    });

    this.path = path;
    this.url = url;
  }
}

module.exports = ExportConstructor;
