import BaseConstructor from '@/views/modules/base.constructor';
import enums from '@/enums';



export default class CampaignConstructor extends BaseConstructor {
  name = '';

  messageType = '';

  step = 0;

  deliveryType = enums.Campaign.DeliveryType.IMMEDIATELY;

  timeZone = '';

  filters = {};

  quickContacts = [];

  segment = null;

  status = enums.Campaign.Status.RUNNING;

  localStartDate = '';

  senderId = '';

  isQuick = false;

  isDraft = false;

  constructor(
    operation = enums.Operation.CREATE,
    payload = null,
    isDraft = false,
    isQuick = false,
    messageType = null,
  ) {
    super(operation, payload);

    this.name = operation === enums.Operation.EDIT || isDraft ? payload.name || '' : '';
    this.messageType = operation === enums.Operation.EDIT || isDraft ? payload.messageType || '' : messageType || '';
    this.step = operation === enums.Operation.EDIT || isDraft ? payload.step || 0 : 0;
    this.deliveryType = operation === enums.Operation.EDIT || isDraft
      ? payload.deliveryType || enums.Campaign.DeliveryType.IMMEDIATELY
      : enums.Campaign.DeliveryType.IMMEDIATELY;
    this.timeZone = operation === enums.Operation.EDIT || isDraft ? payload.timeZone || '' : '';
    this.filters = operation === enums.Operation.EDIT || isDraft ? payload.filters || {} : {};
    this.quickContacts = operation === enums.Operation.EDIT || isDraft
      ? payload.quickContacts || [] : [];
    this.segment = operation === enums.Operation.EDIT || isDraft ? payload.segment || null : null;
    this.status = operation === enums.Operation.EDIT || isDraft
      ? payload.status || enums.Campaign.Status.RUNNING
      : enums.Campaign.Status.RUNNING;
    this.localStartDate = operation === enums.Operation.EDIT || isDraft ? payload.localStartDate || '' : '';
    this.senderId = operation === enums.Operation.EDIT || isDraft ? payload.senderId || '' : '';
    this.isQuick = isQuick;
    this.isDraft = isDraft;

    if (isDraft && !this.id && payload && payload.id) {
      this.id = this.payload.id;
    }
  }

  toCreatePayload() {
    const payload = {
      name: this.name,
      messageType: this.messageType,
      step: this.step,
      filters: this.filters,
      segment: this.segment,
      deliveryType: this.deliveryType,
      timeZone: this.timeZone,
      status: this.status,
      localStartDate: this.localStartDate,
      senderId: this.senderId.id || null,
    };

    if (this.isQuick) {
      payload.quickContacts = this.quickContacts.map((d) => (d.id ? d.id : d.name));
    }

    return payload;
  }

  toEditPayload() {
    return {
      id: this.payload.id,
      ...this.toCreatePayload(),
    };
  }

  toGetCostPayload() {
    return this.isQuick
      ? { quickContacts: this.quickContacts.map((d) => (d.id ? d.id : d.name)) }
      : { filters: this.filters };
  }
}
