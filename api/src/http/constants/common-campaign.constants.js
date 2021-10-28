const TYPE = {
  SMS: 'sms',
};

const MESSAGE_TYPE = {
  TRANSACTIONAL: 'transactional',
  MARKETING: 'marketing',
};

const STATUS = {
  PENDING: 'pending',
  DRAFT: 'draft',
  RUNNING: 'running',
  COMPLETED: 'completed',
};

const DELIVERY_TYPE = {
  IMMEDIATELY: 'immediately',
  LATER: 'later',
};

const CONTACTS_DETAILS = {
  STATUS: {
    PENDING: 'pending',
    // SENT: 'sent',
    // FAILED: 'failed',
    BOUNCED: 'bounced',
    // DELIVERED: 'delivered',
    // FAILURE: 'failure',
    OUTBOUND: 'outbound',
  },
};

module.exports = {
  TYPE,
  MESSAGE_TYPE,
  STATUS,
  DELIVERY_TYPE,
  CONTACTS_DETAILS,
};
