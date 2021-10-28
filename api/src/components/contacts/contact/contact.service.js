const { Promise: promiseBlueBird } = require('bluebird');
const { parsePhoneNumber } = require('libphonenumber-js');
const ResourceService = require('../../../http/services/resource.service');
const repository = require('./contact.repository');
const Constructor = require('./contact.constructor');
const tenantService = require('../../tenant/tenant.service');
const contactFunctions = require('./contact.functions');
const { getOptOutUrl, getMappedPayloadToSave } = require('./contact.functions');
const allCountries = require('../../../assets/utils/all-countries');
const { getImportFromFileResult } = require('../../../http/functions/base.functions');
const { MARKETING_STATUS } = require('./contact.constants');

class ContactService extends ResourceService {
  constructor() {
    super({ repository, Constructor });
    this.repository = repository;
    this.Constructor = Constructor;
  }

  async findingSameOptOutContact({
    phoneInternational, email, idContact = '', tenant,
  }) {
    let phoneInternationalReturn = null;
    let emailReturn = null;

    const queryFindCommon = {
      unregistered: false,
      tenant,
    };

    if (phoneInternational !== '') {
      const queryFindOptOutSms = {
        ...queryFindCommon,
        phoneInternational,
      };

      if (idContact !== '') {
        queryFindOptOutSms._id = {
          $ne: idContact,
        };
      }

      const contactPhoneInternationalExist = await this.repository.getOne(queryFindOptOutSms);
      if (contactPhoneInternationalExist) {
        phoneInternationalReturn = {
          date: contactPhoneInternationalExist.marketingStatus.date,
          value: contactPhoneInternationalExist.marketingStatus.value,
          origin: contactPhoneInternationalExist.marketingStatus.origin,
        };
      }
    }

    if (email !== '') {
      const queryFindOptOutEmail = {
        ...queryFindCommon,
        email,
      };

      if (idContact !== '') {
        queryFindOptOutEmail._id = {
          $ne: idContact,
        };
      }

      const contactEmailExist = await this.repository.getOne(queryFindOptOutEmail);

      if (contactEmailExist) {
        emailReturn = {
          date: contactEmailExist.marketingStatus.date,
          value: contactEmailExist.marketingStatus.value,
          origin: contactEmailExist.marketingStatus.origin,
        };
      }
    }

    return {
      phoneInternationalReturn,
      emailReturn,
    };
  }

  async getAnalyticsPie(tenantId) {
    const result = await this.repository.getAnalyticsPie({ tenantId });

    const pieData = result && Array.isArray(result) ? result[0] || {} : {};

    return {
      contactsSubscribed: pieData.contactsSubscribed || 0,
      contactsUnsubscribed: pieData.contactsUnsubscribed || 0,
    };
  }

  async getCountContactsInDay() {
    return this.repository.getCountContactsInDay();
  }

  async createOne({ payload, tenant, creator }) {
    const payloadMapped = getMappedPayloadToSave(payload);
    const payloadMappedUpdate = { ...payloadMapped };

    if (payloadMappedUpdate.marketingStatus) {
      payloadMappedUpdate['marketingStatus.value'] = payloadMappedUpdate.marketingStatus;
      delete payloadMappedUpdate.marketingStatus;
    }

    if (payloadMapped.phoneInternational !== '') {
      const contactExist = await this.repository.getOne(
        {
          phoneInternational: payloadMapped.phoneInternational,
          unregistered: true,
        },
      );

      if (contactExist) {
        const contactUpdated = await this.repository.updateOne({
          id: contactExist._id,
          payload: {
            unregistered: false,
            ...payloadMappedUpdate,
          },
        });

        return contactUpdated;
      }
    }

    const newContact = new this.Constructor({
      ...payloadMapped,
      tenant,
      creator,
    });

    const informationContactsMarketingStatus = await this.findingSameOptOutContact({
      phoneInternational: newContact.phoneInternational,
      email: newContact.email,
      tenant,
    });

    if (informationContactsMarketingStatus.phoneInternationalReturn) {
      newContact.marketingStatus.value = informationContactsMarketingStatus.phoneInternationalReturn.value;
      newContact.marketingStatus.date = informationContactsMarketingStatus.phoneInternationalReturn.date;
      newContact.marketingStatus.origin = informationContactsMarketingStatus.phoneInternationalReturn.origin;
    }

    if (informationContactsMarketingStatus.emailReturn) {
      newContact.marketingStatus.value = informationContactsMarketingStatus.emailReturn.value;
      newContact.marketingStatus.date = informationContactsMarketingStatus.emailReturn.date;
      newContact.marketingStatus.origin = informationContactsMarketingStatus.emailReturn.origin;
    }

    const contactCreated = await this.repository.createOne(newContact);

    contactCreated.marketingStatus.urlSms = await getOptOutUrl({
      // eslint-disable-next-line no-underscore-dangle
      contactId: contactCreated._id,
      optOutToken: contactCreated.marketingStatus.token,
      nameService: 'sms',
    });

    contactCreated.save();
    return contactCreated;
  }

  async importFromFile({
    payload,
    blacklist = false,
    tenant,
    creator,
  }) {
    const promises = payload.map(async (p) => {
      let phoneInternational = '';
      let phoneNational = '';
      let phoneSignificant = '';
      let dialCode = null;
      let country = '';
      let codeCountry = '';

      if (p.phoneInternational) {
        try {
          const phoneNumber = parsePhoneNumber(p.phoneInternational);

          if (phoneNumber && phoneNumber.isValid()) {
            phoneInternational = phoneNumber.formatInternational();
            phoneNational = phoneNumber.formatNational();
            phoneSignificant = phoneNumber.nationalNumber;
            dialCode = phoneNumber.countryCallingCode;
            country = allCountries.find((c) => c.dialCode === dialCode.toString());
            codeCountry = phoneNumber.country;
          }
        } catch (e) {
          console.log(e);
        }
      }

      const newContact = new this.Constructor({
        ...p,
        phoneInternational,
        phoneNational,
        phoneSignificant,
        dialCode,
        country: country && country.name ? country.name : '',
        codeCountry,
        optOutValue: blacklist,
        tenant,
        creator,
      });

      const informationContactsMarketingStatus = await this.findingSameOptOutContact({
        phoneInternational: newContact.phoneInternational,
        email: newContact.email,
        tenant,
      });

      if (informationContactsMarketingStatus.phoneInternationalReturn) {
        newContact.marketingStatus.value = informationContactsMarketingStatus.phoneInternationalReturn.value;
        newContact.marketingStatus.date = informationContactsMarketingStatus.phoneInternationalReturn.date;
        newContact.marketingStatus.origin = informationContactsMarketingStatus.phoneInternationalReturn.origin;
      }

      if (informationContactsMarketingStatus.emailReturn) {
        newContact.marketingStatus.value = informationContactsMarketingStatus.emailReturn.value;
        newContact.marketingStatus.date = informationContactsMarketingStatus.emailReturn.date;
        newContact.marketingStatus.origin = informationContactsMarketingStatus.emailReturn.origin;
      }

      return {
        ...newContact,
      };
    });
    const arrayPayload = await Promise.all(promises);
    const recordsSaved = await this.repository.createMany({ payload: arrayPayload });

    promiseBlueBird.mapSeries(recordsSaved, async (record) => {
      const urlSms = await getOptOutUrl({
        // eslint-disable-next-line no-underscore-dangle
        contactId: record._id,
        optOutToken: record.marketingStatus.token,
        nameService: 'sms',
      });


      await this.repository.updateOne({
        id: record._id,
        payload: {
          'marketingStatus.urlSms': urlSms,
        },
      });
    });

    return getImportFromFileResult({
      payload, recordsSaved,
    });
  }

  async updateOne({ id, payload }) {
    const payloadMapped = getMappedPayloadToSave(payload);

    if (payloadMapped.marketingStatus) {
      payloadMapped['marketingStatus.value'] = payloadMapped.marketingStatus;
      delete payloadMapped.marketingStatus;
    }

    const contactToUpdate = await this.getOne(id);

    const informationContactsMarketingStatus = await this.findingSameOptOutContact({
      phoneInternational: (contactToUpdate.phoneInternational !== payloadMapped.phoneInternational) ? payloadMapped.phoneInternational : '',
      email: (contactToUpdate.email !== payloadMapped.email) ? payloadMapped.email : '',
      idContact: id,
      tenant: contactToUpdate.tenant,
    });

    if (informationContactsMarketingStatus.phoneInternationalReturn) {
      payloadMapped['marketingStatus.value'] = informationContactsMarketingStatus.phoneInternationalReturn.value;
      payloadMapped['marketingStatus.date'] = informationContactsMarketingStatus.phoneInternationalReturn.date;
      payloadMapped['marketingStatus.origin'] = informationContactsMarketingStatus.phoneInternationalReturn.origin;
    }

    if (informationContactsMarketingStatus.emailReturn) {
      payloadMapped['marketingStatus.value'] = informationContactsMarketingStatus.emailReturn.value;
      payloadMapped['marketingStatus.date'] = informationContactsMarketingStatus.emailReturn.date;
      payloadMapped['marketingStatus.origin'] = informationContactsMarketingStatus.emailReturn.origin;
    }

    return this.repository.updateOne({
      payload: payloadMapped,
      id,
    });
  }

  async restoreOne(id) {
    const queryFind = { _id: id };
    const operationRestore = this.repository.restoreOne(queryFind);
    return operationRestore;
  }

  // eslint-disable-next-line consistent-return
  async deleteOne(id) {
    const contact = this.repository.deleteOne(id);
    return contact;
  }

  async deleteMany({ ids = null, queryFind = {} }) {
    if (ids === null) {
      const records = await this.repository.getAll(queryFind);
      // eslint-disable-next-line no-underscore-dangle,no-param-reassign
      ids = records.map((t) => t._id);
    }
    const contactsDeleted = await this.repository.deleteMany(ids);
    return contactsDeleted;
  }

  async restoreMany({ ids = null, queryFind = {} }) {
    if (ids && Array.isArray(ids)) {
      // eslint-disable-next-line no-param-reassign
      queryFind = { _id: { $in: ids } };
    }
    return this.repository.restoreMany(queryFind);
  }

  async setOptOut({ id, optToken, service = DEFAULT_SERVICES.SMS }) {
    const contact = await this.repository.getOneById(id);

    const { token, value } = contact.marketingStatus;

    if (optToken === token) {
      const dateNow = new Date();
      let newValueMarketingStatus;

      if (value === MARKETING_STATUS.UNSUBSCRIBED) {
        newValueMarketingStatus = MARKETING_STATUS.SUBSCRIBED;
      } else {
        newValueMarketingStatus = MARKETING_STATUS.UNSUBSCRIBED;
      }

      const contactUpdated = await this.repository.updateOne({
        id,
        payload: {
          'marketingStatus.value': newValueMarketingStatus,
          'marketingStatus.date': dateNow,
          'marketingStatus.origin': service,
        },
      });
      const optOutValue = contactUpdated.marketingStatus.value;

      const queryFindUpdateContacts = {
        tenant: contact.tenant,
      };

      if (service === DEFAULT_SERVICES.SMS) {
        queryFindUpdateContacts.phoneInternational = contact.phoneInternational;
      } else if (service === DEFAULT_SERVICES.EMAIL) {
        queryFindUpdateContacts.email = contact.email;
      }

      await this.repository.updateManyByQueryFind({
        queryFind: queryFindUpdateContacts,
        payload: {
          'marketingStatus.value': newValueMarketingStatus,
          'marketingStatus.date': dateNow,
          'marketingStatus.origin': service,
        },
      });

      return optOutValue;
    }

    throw (new Error('different'));
  }

  async getResourceWithPermissions({
    userId, tenantId, userRole, id,
  }) {
    const queryFind = contactFunctions.getQueryFindForModifyContacts({
      tenantId, userRole, userId, idResource: id,
    });

    return this.repository.getOne(queryFind);
  }

  async optOutInfoHandler({
    id, optOutToken,
  }) {
    const contact = await this.repository.getOneById(id);
    const { token: optOutTokenContact, value: optOut } = contact.marketingStatus;

    if (optOutTokenContact === optOutToken) {
      const tenant = await tenantService.getOne(contact.tenant);

      return {
        company: tenant.companyName,
        optOut,
      };
    }

    throw (new Error('different'));
  }
}

const singletonInstance = new ContactService();

module.exports = singletonInstance;
