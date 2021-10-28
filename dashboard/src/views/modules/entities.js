import { v4 as uuidv4 } from 'uuid';
import { generateMongoObjectId } from './util';

export const userDefinition = () => ({
  avatar: '',
  name: '',
  email: '',
  password: '',
  status: 'active',
  role: { name: 'user', permissions: [] },
});

export const contactGroupDefinition = () => ({
  name: '',
  contacts: 0,
  isPublic: false,
  usersPrivateAccess: [],
});

export const contactDefinition = () => ({
  firstName: '',
  lastName: '',
  fullName: '',
  email: '',
  phoneInternational: '',
  phoneNational: '',
  phoneSignificant: '',
  dialCode: '',
  country: '',
  optOut: false,
  phoneValidate: { isValid: false },
  idContactGroup: '',
  tags: [],
});

export const templateDefinition = () => ({
  name: '',
  message: '',
});

export const recordingDefinition = () => ({
  name: '',
  uuidResource: uuidv4(),
  urlResource: '',
  bucketPath: '',
});

export const callerIdDefinition = () => ({
  name: '',
  status: 'unverified',
  phoneInternational: '',
  phoneNational: '',
  phoneSignificant: '',
  dialCode: '',
  country: '',
  phoneValidate: { isValid: false },
});

export const textCampaignDefinition = () => ({
  name: '',
  type: 'sms',
  message: '',
  deliveryType: 'immediately',
  timeZone: 'act',
  localStartDate: '',
  callerId: '',
  status: 'running',
  step: 0,
  hasInterpolations: false,
  interpolations: [],
});


export const voiceCampaignDefinition = () => ({
  name: '',
  type: 'voicemail',
  recordingId: null,
  recordingUrl: '',
  deliveryType: 'immediately',
  timeZone: 'act',
  localStartDate: '',
  callerId: '',
  status: 'running',
  step: 0,
});

export const audienceDefinition = () => ({
  name: '',
  abbreviation: '',
  description: '',
  tags: [],
  attributes: [],
  segments: [],
});

export const audienceAttributeDefinition = () => ({
  labelName: '',
  attributeName: uuidv4(),
  type: 'text',
  items: [],
});

export const categoryItemDefinition = () => ({
  _id: generateMongoObjectId(),
  name: '',
});

export const tagDefinition = () => ({
  name: '',
});

export const segmentDefinition = () => ({
  name: '',
  filters: null,
});

export const planDefinition = () => {
  const smsBaseQuantities = [200, 500, 1000, 2500, 5000, 50000];

  const generateOptionSchema = (value, type = '') => ({
    quantity: type === 'voicemail' ? value / 2 : value,
    cost: 0,
    margin: 120,
    prepaidPrice: 0,
    monthlyPrice: 0,
    prepaidTotal: 0,
    monthlyTotal: 0,
  });

  const plan = {
    country: '',
    codeCountry: '',
    options: [],
    virtualSMS: {
      cost: 0,
      margin: 120,
      price: 0,
    },
    virtualMMS: {
      cost: 0,
      margin: 120,
      price: 0,
    },
  };

  smsBaseQuantities.forEach((value) => {
    const option = {
      id: generateMongoObjectId(),
      sms: generateOptionSchema(value),
      voicemail: generateOptionSchema(value, 'voicemail'),
      email: generateOptionSchema(value),
      mms: generateOptionSchema(value),
      doNotCall: generateOptionSchema(value),
      monthlyDiscount: 20,
    };

    plan.options.push(option);
  });

  return plan;
};
