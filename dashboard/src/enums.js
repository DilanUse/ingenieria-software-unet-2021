const Auth = {
  Role: {
    Prefix: {
      ADMIN: 'admin',
      MERCHANT: 'merchant',
    },
    Suffix: {
      OWNER: 'owner',
      ADMIN: 'admin',
      USER: 'user',
    },
    RoleName: {
      ADMIN_OWNER: 'admin-owner',
      ADMIN_ADMIN: 'admin-admin',
      ADMIN_USER: 'admin-user',
      MERCHANT_OWNER: 'merchant-owner',
      MERCHANT_ADMIN: 'merchant-admin',
      MERCHANT_USER: 'merchant-user',
    },
  },
  Permissions: {
    MERCHANTS: 'merchants',
    APP_SETTINGS: 'app-settings',
    APP_SERVICES: 'app-services',
    CAMPAIGNS: 'campaigns',
    USERS: 'users',
    BUSINESS: 'business',
  },
};

const Entity = {
  USER: 'User',
  AUDIENCE: 'Audience',
  SMS_TEMPLATE: 'SMSTemplate',
  MMS_TEMPLATE: 'MMSTemplate',
  RECORDING: 'Recording',
  EMAIL_TEMPLATE: 'EmailTemplate',
  CONTACT_GROUP: 'ContactGroup',
  CONTACT: 'Contact',
  CONTACT_ATTRIBUTE: 'ContactAttribute',
  TAG: 'Tag',
  SEGMENT: 'Segment',
  SMS_CAMPAIGN: 'SMSCampaign',
  MMS_CAMPAIGN: 'MMSCampaign',
  VOICE_CAMPAIGN: 'VoiceCampaign',
  EMAIL_CAMPAIGN: 'EmailCampaign',
  SMS_INBOUND: 'SMSInbound',
  PLAN: 'Plan',
  CALLER_ID: 'CallerID',
  MAILER_ID: 'MailerID',
  APP_SETTINGS: 'AppSettings',
  APP_SERVICE: 'AppService',
};

const Operation = {
  LIST: 'list',
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  CLONE: 'clone',
  DELETE: 'delete',
  EXPORT: 'export',
};

const SharedPermission = {
  NONE: 'none',
  VIEW: 'view',
  MODIFY: 'modify',
  ALL: 'all',
};

const Campaign = {
  Type: {
    SMS: 'sms',
    MMS: 'mms',
    VOICEMAIL: 'voice',
    EMAIL: 'email',
  },
  MessageType: {
    TRANSACTIONAL: 'transactional',
    MARKETING: 'marketing',
    REVIEW: 'review',
  },
  Status: {
    INCOMPLETE: 'incomplete',
    PENDING: 'pending',
    DRAFT: 'draft',
    RUNNING: 'running',
    COMPLETED: 'completed',
  },
  DetailStatus: {
    PENDING: 'pending',
    BOUNCED: 'bounced',
    OUTBOUND: 'outbound',
  },
  DeliveryType: {
    IMMEDIATELY: 'immediately',
    LATER: 'later',
  },
  ListType: {
    History: 'history',
    Drafts: 'drafts',
    Scheduled: 'scheduled',
  },
  EspecialPlaceholders: {
    REVIEW_LINK: 'reviewLink',
  },
};

const Sender = {
  Status: {
    VERIFIED: 'verified',
    UNVERIFIED: 'unverified',
  },
  Type: {
    SHARED: 'shared',
    PRIVATE: 'private',
    VIRTUAL: 'virtual',
  },
};

const DataModel = {
  SERVER: 'server',
  CLIENT: 'client',
};

const AppNotifications = {
  Type: {
    EXPORT_SUCCESS: 'export-success',
    INBOUND_SMS: 'inbound-sms',
    OPT_OUT: 'opt-out',
    REVIEW_CONFIGURATION: 'review-configuration',
  },
};

const SocketEvents = {
  NOTIFICATION: 'notification',
};

const ImportCollections = {
  Validations: {
    PHONE: 'phone',
  },
};

const Users = {
  Status: {
    INVITED: 'invited',
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    EMAIL_NOT_VERIFIED: 'email-not-verified',
  },
};

const Contact = {
  MarketingStatus: {
    SUBSCRIBED: 'subscribed',
    UNSUBSCRIBED: 'unsubscribe',
  },
};

const StripeEnums = {
  PaymentIntent: {
    Status: {
      REQUIRES_PAYMENT_METHOD: 'requires_payment_method',
      REQUIRES_CONFIRMATION: 'requires_confirmation',
      REQUIRES_ACTION: 'requires_action',
      PROCESSING: 'processing',
      REQUIRES_CAPTURE: 'requires_capture',
      CANCELED: 'canceled',
      SUCCEEDED: 'succeeded',
    },
  },
  Invoice: {
    Status: {
      DRAFT: 'draft',
      OPEN: 'open',
      PAID: 'paid',
      UNCOLLECTIBLE: 'uncollectible',
      VOID: 'void',
    },
  },
  Checkout: {
    Mode: {
      PAYMENT: 'payment',
      SETUP: 'setup',
      SUBSCRIPTION: 'subscription',
    },
  },
  TaxId: {
    VerificationStatus: {
      PENDING: 'pending',
      VERIFIED: 'verified',
      UNVERIFIED: 'unverified',
      UNAVAILABLE: 'unavailable',
    },
  },
};

const PeriodsOfTime = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

const AppServices = {
  DefaultServices: {
    SMS: 'sms',
    VOICE: 'voice',
    EMAIL: 'email',
  },
  PackageType: {
    PREPAID: 'prepaid',
    MONTHLY: 'monthly',
  },
};

const AppFilterType = {
  TEXT: 'text',
  NUMBER: 'number',
  DATE: 'date',
  BOOLEAN: 'boolean',
  CATEGORIES: 'categories',
  ENUM: 'enum',
  TAGS: 'tags',
};

const AppFilterOperation = {
  CONTAINS: 'contains',
  NOT_CONTAINS: 'notContains',
  EQUALS: 'equals',
  NOT_EQUAL: 'notEqual',
  STARTS_WITH: 'startsWith',
  ENDS_WITH: 'endsWith',
  LESS_THAN: 'lessThan',
  LESS_THAN_OR_EQUAL: 'lessThanOrEqual',
  GREATER_THAN: 'greaterThan',
  GREATER_THAN_OR_EQUAL: 'greaterThanOrEqual',
  IN_RANGE: 'inRange',
  ONE: 'one',
  ALL: 'all',
  NONE: 'none',
  NONE_ANY: 'none-any',
};

const AppFilter = {
  FilterType: {
    Text: {
      NAME: AppFilterType.TEXT,
      Type: {
        CONTAINS: AppFilterOperation.CONTAINS,
        NOT_CONTAINS: AppFilterOperation.NOT_CONTAINS,
        EQUALS: AppFilterOperation.EQUALS,
        NOT_EQUAL: AppFilterOperation.NOT_EQUAL,
        STARTS_WITH: AppFilterOperation.STARTS_WITH,
        ENDS_WITH: AppFilterOperation.ENDS_WITH,
      },
    },
    Number: {
      NAME: AppFilterType.NUMBER,
      Type: {
        EQUALS: AppFilterOperation.EQUALS,
        NOT_EQUAL: AppFilterOperation.NOT_EQUAL,
        LESS_THAN: AppFilterOperation.LESS_THAN,
        LESS_THAN_OR_EQUAL: AppFilterOperation.LESS_THAN_OR_EQUAL,
        GREATER_THAN: AppFilterOperation.GREATER_THAN,
        GREATER_THAN_OR_EQUAL: AppFilterOperation.GREATER_THAN_OR_EQUAL,
        IN_RANGE: AppFilterOperation.IN_RANGE,
      },
    },
    Date: {
      NAME: AppFilterType.DATE,
      Type: {
        EQUALS: AppFilterOperation.EQUALS,
        NOT_EQUAL: AppFilterOperation.NOT_EQUAL,
        LESS_THAN: AppFilterOperation.LESS_THAN,
        GREATER_THAN: AppFilterOperation.GREATER_THAN,
        IN_RANGE: AppFilterOperation.IN_RANGE,
      },
    },
    Boolean: {
      NAME: AppFilterType.BOOLEAN,
      Values: {
        UNDETERMINED: 'undetermined',
        YES: 'yes',
        NO: 'no',
      },
    },
    Categories: {
      NAME: AppFilterType.CATEGORIES,
      Type: {
        ONE: AppFilterOperation.ONE,
        ALL: AppFilterOperation.ALL,
        NONE: AppFilterOperation.NONE,
        NONE_ANY: AppFilterOperation.NONE_ANY,
      },
    },
    Enum: {
      NAME: AppFilterType.ENUM,
      Type: {
        ONE: AppFilterOperation.ONE,
        ALL: AppFilterOperation.ALL,
        NONE: AppFilterOperation.NONE,
        NONE_ANY: AppFilterOperation.NONE_ANY,
      },
    },
    Tags: {
      NAME: AppFilterType.TAGS,
      Type: {
        ONE: AppFilterOperation.ONE,
        ALL: AppFilterOperation.ALL,
        NONE: AppFilterOperation.NONE,
        NONE_ANY: AppFilterOperation.NONE_ANY,
      },
    },
  },
  FilterMathType: {
    ALL: 'all',
    ANY: 'any',
  },
  FilterOperator: {
    AND: 'AND',
    OR: 'OR',
  },
};

const AppSortBy = {
  ASC: 'asc',
  DESC: 'desc',
};

const Attributes = {
  Type: {
    TEXT: AppFilterType.TEXT,
    DATE: AppFilterType.DATE,
    NUMBER: AppFilterType.NUMBER,
    BOOL: AppFilterType.BOOLEAN,
    CATEGORY: AppFilterType.CATEGORIES,
  },
};

const mqBreakpoints = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  LAPTOP: 'laptop',
  DESKTOP: 'desktop',
};

Object.freeze(Auth);
Object.freeze(Entity);
Object.freeze(Operation);
Object.freeze(SharedPermission);
Object.freeze(Campaign);
Object.freeze(Sender);
Object.freeze(DataModel);
Object.freeze(AppNotifications);
Object.freeze(SocketEvents);
Object.freeze(ImportCollections);
Object.freeze(Attributes);
Object.freeze(Users);
Object.freeze(StripeEnums);
Object.freeze(PeriodsOfTime);
Object.freeze(AppServices);
Object.freeze(Contact);
Object.freeze(AppFilterType);
Object.freeze(AppFilterOperation);
Object.freeze(AppFilter);
Object.freeze(AppSortBy);
Object.freeze(mqBreakpoints);

export default {
  Auth,
  Entity,
  Operation,
  SharedPermission,
  Campaign,
  Sender,
  DataModel,
  AppNotifications,
  SocketEvents,
  ImportCollections,
  Attributes,
  Users,
  StripeEnums,
  PeriodsOfTime,
  AppServices,
  Contact,
  AppFilterType,
  AppFilterOperation,
  AppFilter,
  AppSortBy,
  mqBreakpoints,
};
