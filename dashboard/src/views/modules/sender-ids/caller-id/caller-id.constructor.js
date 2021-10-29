import PhoneNumberConstructor from '@/views/modules/phone-number.constructor';
import enums from '@/enums';


export default class CallerIdConstructor extends PhoneNumberConstructor {
  name = '';

  status = enums.Sender.Status.UNVERIFIED;

  constructor(operation = enums.Operation.CREATE, payload = null, nameToCreate = '') {
    super(operation, payload);

    this.name = operation === enums.Operation.CREATE || !payload ? nameToCreate || '' : payload.name || '';
    this.status = operation === enums.Operation.CREATE || !payload
      ? enums.Sender.Status.UNVERIFIED
      : payload.status || enums.Sender.Status.UNVERIFIED;
  }

  toCreatePayload() {
    return {
      name: this.name,
      ...super.toCreatePayload(),
    };
  }

  toEditPayload() {
    return {
      id: this.payload.id,
      name: this.name,
    };
  }
}
