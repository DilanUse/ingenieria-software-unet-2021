const tenantValidations = {
  businessSettings: {
    details: {
      businessName: {
        max: 200,
      },
      contactName: {
        max: 200,
      },
      jobTitle: {
        max: 200,
      },
      email: {},
      phoneNumber: {
        max: 50,
      },
      country: {
        max: 200,
      },
      state: {
        max: 200,
      },
      city: {
        max: 200,
      },
      postalCode: {
        max: 10,
      },
      addressLine1: {
        max: 500,
      },
      addressLine2: {
        max: 500,
      },
      primaryTimeZone: {
        max: 200,
      },
    },
    reviews: {},
  },
};

module.exports = {
  tenantValidations,
};
