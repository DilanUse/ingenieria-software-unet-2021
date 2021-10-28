class TenantConstructor {
  constructor({
    burstSMSClientId, businessName,
  }) {
    this.burstSMSClientId = burstSMSClientId;
    if (businessName) {
      this.businessSettings = {
        details: {
          businessName,
        },
      };
    }

    this.flags = {
      completedAccountDetails: false,
      completedReviewsSettings: false,
      autoTopUpAccount: false,
    };
  }
}

module.exports = TenantConstructor;
