import enums from '@/enums';
import BaseConstructor from '@/views/modules/base.constructor';

export default class SmsTemplateConstructor extends BaseConstructor {
  name = '';

  message = '';

  hasInterpolations = false;

  interpolations = [];

  constructor(operation = enums.Operation.CREATE, payload = null) {
    super(operation, payload);

    this.name = operation === enums.Operation.CREATE || !payload ? '' : payload.name || '';
    this.message = operation === enums.Operation.CREATE || !payload ? '' : payload.message || '';
    this.hasInterpolations = operation === enums.Operation.CREATE || !payload
      ? false : payload.hasInterpolations || false;
    this.interpolations = operation === enums.Operation.CREATE || !payload
      ? [] : payload.interpolations || [];
  }

  toCreatePayload() {
    return {
      name: this.name,
      message: this.message,
      hasInterpolations: this.hasInterpolations,
      interpolations: this.interpolations,
    };
  }

  toEditPayload() {
    return {
      id: this.payload.id,
      ...this.toCreatePayload(),
    };
  }
}
