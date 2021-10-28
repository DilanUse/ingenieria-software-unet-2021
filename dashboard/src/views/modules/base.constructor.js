import enums from '@/enums';

export default class BaseConstructor {
  id = null;

  operation = enums.Operation.CREATE;

  payload = null;

  constructor(operation = enums.Operation.CREATE, payload = null) {
    this.operation = operation;
    this.payload = payload;

    if (!BaseConstructor.operationIsValid(operation)) {
      throw new Error('Invalid Operation, must be "create" or "edit"');
    }

    if (operation === enums.Operation.EDIT) {
      if (this.payload.id) {
        this.id = this.payload.id;
      } else {
        throw new Error('Error data');
      }
    }
  }

  set operation(operation) {
    if (BaseConstructor.operationIsValid(operation)) {
      this.operation = operation;
    }
  }

  static operationIsValid(operation) {
    return operation === enums.Operation.VIEW
      || operation === enums.Operation.CREATE
      || operation === enums.Operation.EDIT
      || operation === enums.Operation.CLONE;
  }

  toCreatePayload() {
    return this.payload;
  }

  toEditPayload() {
    return this.payload;
  }

  toSavePayload() {
    if (this.operation === enums.Operation.CREATE || this.operation === enums.Operation.CLONE) {
      return this.toCreatePayload();
    }

    return this.toEditPayload();
  }
}
