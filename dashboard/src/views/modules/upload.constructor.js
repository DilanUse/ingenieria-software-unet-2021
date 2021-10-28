import { v4 as uuidv4 } from 'uuid';
import enums from '@/enums';
import { getExtFromFileType } from '@/util';
import BaseConstructor from '@/views/modules/base.constructor';

export default class UploadConstructor extends BaseConstructor {
  #uuid = '';

  url = '';

  #bucketPath = '';

  file = null;

  constructor(basePath, operation = enums.Operation.CREATE, payload = null) {
    super(operation, payload);
    const uuid = uuidv4();

    this.#uuid = operation === enums.Operation.CREATE || !payload ? uuid : payload.uuid || uuid;
    this.url = operation === enums.Operation.CREATE || !payload ? '' : payload.url || '';
    this.#bucketPath = basePath ? `${basePath}/${this.#uuid}` : '';
  }

  get bucketPath() {
    return this.bucketPathWithExtension();
  }

  bucketPathWithExtension() {
    if (this.file && this.file.type) {
      const ext = getExtFromFileType(this.file.type);
      return `${this.#bucketPath}.${ext}`;
    }

    return this.#bucketPath;
  }

  toCreatePayload() {
    return {
      uuid: this.#uuid,
      url: this.url,
      bucketPath: this.file ? this.bucketPathWithExtension() : '',
    };
  }

  toEditPayload() {
    return {
      id: this.payload.id,
      uuid: this.#uuid,
      url: this.url,
      bucketPath: this.file ? this.bucketPathWithExtension() : this.payload.bucketPath || '',
    };
  }
}
