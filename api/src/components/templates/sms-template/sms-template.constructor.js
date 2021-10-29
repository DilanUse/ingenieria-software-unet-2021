const BaseConstructor = require('../../../http/constructors/base.constructor');

class SmsTemplateConstructor extends BaseConstructor {
  constructor({
    name, message,
    transactionalToken = '',
    hasInterpolations = false, interpolations = [],
    tenant, creator,
  }) {
    super({
      tenant,
      creator,
    });

    this.name = name;
    this.message = message;
    this.transactionalToken = transactionalToken || '';
    this.hasInterpolations = hasInterpolations || false;
    this.interpolations = interpolations || [];
  }
}

module.exports = SmsTemplateConstructor;
