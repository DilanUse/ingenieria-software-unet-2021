import enums from '@/enums';
import CampaignConstructor from '@/views/modules/campaigns/campaign.constructor';


export default class SmsCampaignConstructor extends CampaignConstructor {
  message = '';

  hasInterpolations = false;

  interpolations = [];

  senderType = enums.Sender.Type.SHARED;

  constructor(
    operation = enums.Operation.CREATE,
    payload = null,
    isDraft = false,
    isQuick = false,
    messageType = null,
  ) {
    super(operation, payload, isDraft, isQuick, messageType);

    this.message = operation === enums.Operation.EDIT || isDraft ? payload.message || '' : '';
    this.hasInterpolations = operation === enums.Operation.EDIT || isDraft
      ? payload.hasInterpolations || false : false;
    this.interpolations = operation === enums.Operation.EDIT || isDraft
      ? payload.interpolations || [] : [];
    this.senderType = operation === enums.Operation.EDIT || isDraft
      ? payload.senderType || enums.Sender.Type.SHARED
      : enums.Sender.Type.SHARED;
  }

  toCreatePayload() {
    return {
      message: this.message,
      senderType: this.senderType,
      hasInterpolations: this.hasInterpolations,
      interpolations: this.interpolations,
      ...super.toCreatePayload(),
    };
  }

  toEditPayload() {
    return {
      id: this.payload.id,
      ...this.toCreatePayload(),
    };
  }

  toDraftPayload() {
    return {
      id: this.id,
      ...this.toCreatePayload(),
    };
  }

  toGetCostPayload() {
    return {
      ...super.toGetCostPayload(),
      message: this.message,
      hasInterpolations: this.hasInterpolations,
      interpolations: this.interpolations,
    };
  }

  toTestPayload() {
    return {
      message: this.message,
      hasInterpolations: this.hasInterpolations,
      interpolations: this.interpolations,
      messageType: this.messageType,
      senderType: this.senderType,
    };
  }
}
