import BaseConstructor from '@/views/modules/base.constructor';
import enums from '@/enums';

// todo: extends this constructor to use in contacts
export default class PhoneNumberConstructor extends BaseConstructor {
  phoneInternational = '';

  phoneNational = '';

  phoneSignificant = '';

  dialCode = '';

  country = '';

  codeCountry = '';

  phoneValidate = { isValid: false };

  constructor(operation = enums.Operation.CREATE, payload = null) {
    super(operation, payload);

    this.phoneInternational = operation === enums.Operation.CREATE || !payload ? '' : payload.phoneInternational || '';
    this.phoneNational = operation === enums.Operation.CREATE || !payload ? '' : payload.phoneNational || '';
    this.phoneSignificant = operation === enums.Operation.CREATE || !payload ? '' : payload.phoneSignificant || '';
    this.dialCode = operation === enums.Operation.CREATE || !payload ? '' : payload.dialCode || '';
    this.country = operation === enums.Operation.CREATE || !payload ? '' : payload.country || '';
    this.codeCountry = operation === enums.Operation.CREATE || !payload ? '' : payload.codeCountry || '';
    this.phoneValidate = { isValid: false };
  }

  toCreatePayload() {
    return {
      phoneInternational: this.phoneValidate.number.international,
      phoneNational: this.phoneValidate.number.national,
      phoneSignificant: this.phoneValidate.number.significant,
      dialCode: this.phoneValidate.country.dialCode,
      country: this.phoneValidate.country.name,
      codeCountry: this.phoneValidate.country.iso2,
    };
  }

  toEditPayload() {
    return {
      id: this.payload.id,
      ...this.toCreatePayload(),
    };
  }
}
