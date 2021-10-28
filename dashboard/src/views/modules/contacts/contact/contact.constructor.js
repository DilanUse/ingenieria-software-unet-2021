import BaseConstructor from '@/views/modules/base.constructor';
import enums from '@/enums';


export default class ContactConstructor extends BaseConstructor {
  firstName = '';

  lastName = '';

  email = '';

  phoneInternational = '';

  phoneNational = '';

  phoneSignificant = '';

  dialCode = '';

  country = '';

  codeCountry = '';

  phoneValidate = { isValid: false };

  tags = [];

  #attributes = [];

  constructor(attributes = [], operation = enums.Operation.CREATE, payload = null) {
    super(operation, payload);

    this.firstName = operation === enums.Operation.CREATE || !payload ? '' : payload.firstName || '';
    this.lastName = operation === enums.Operation.CREATE || !payload
      ? '' : payload.lastName || '';
    this.email = operation === enums.Operation.CREATE || !payload ? '' : payload.email || '';
    this.phoneInternational = operation === enums.Operation.CREATE || !payload ? '' : payload.phoneInternational || '';
    this.phoneNational = operation === enums.Operation.CREATE || !payload ? '' : payload.phoneNational || '';
    this.phoneSignificant = operation === enums.Operation.CREATE || !payload ? '' : payload.phoneSignificant || '';
    this.dialCode = operation === enums.Operation.CREATE || !payload ? '' : payload.dialCode || '';
    this.country = operation === enums.Operation.CREATE || !payload ? '' : payload.country || '';
    this.codeCountry = operation === enums.Operation.CREATE || !payload ? '' : payload.codeCountry || '';
    this.phoneValidate = { isValid: false };
    this.tags = operation === enums.Operation.CREATE || !payload ? [] : payload.tags || [];
    this.#attributes = attributes || [];
  }

  toCreatePayload() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneInternational: this.phoneValidate.number.international || '',
      phoneNational: this.phoneValidate.number.national || '',
      phoneSignificant: this.phoneValidate.number.significant || '',
      dialCode: this.phoneValidate.isValid ? this.phoneValidate.country.dialCode : '',
      country: this.phoneValidate.isValid ? this.phoneValidate.country.name : '',
      codeCountry: this.phoneValidate.isValid ? this.phoneValidate.country.iso2 : '',
      tags: this.tags.map((g) => g.id),
      ...this.dynamicPayload(),
    };
  }

  dynamicPayload() {
    const payload = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const attr of this.#attributes) {
      if (attr.type === 'date') {
        payload[attr.id] = new Date(this[attr.id]);
      } else {
        payload[attr.id] = this[attr.id];
      }
    }

    return payload;
  }

  toEditPayload() {
    return {
      id: this.payload.id,
      ...this.toCreatePayload(),
    };
  }
}
