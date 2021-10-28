import enums from '@/enums';
import BaseConstructor from '@/views/modules/base.constructor';



export default class SharedConstructor extends BaseConstructor {
  isPublic = false;

  usersPrivateAccess = [];

  constructor(operation = enums.Operation.CREATE, payload = null) {
    super(operation, payload);

    this.isPublic = !!(payload && payload.isPublic);
    this.usersPrivateAccess = payload && payload.usersPrivateAccess
      && Array.isArray(payload.usersPrivateAccess)
      ? payload.usersPrivateAccess : [];
  }

  toCreatePayload() {
    return {
      isPublic: this.isPublic,
      usersPrivateAccess: this.usersPrivateAccess,
    };
  }

  toEditPayload() {
    return {
      id: this.payload.id,
      ...this.toCreatePayload(),
    };
  }
}
