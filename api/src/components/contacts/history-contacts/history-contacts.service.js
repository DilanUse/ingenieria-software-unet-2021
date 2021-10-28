const BaseService = require('../../../http/services/base.service');
const repository = require('./history-contacts.repository');
const contactService = require('../contact/contact.service');

const { paramsToGetAnalytics, fillDataWithDatesEmpties } = require('../../../http/functions/base.functions');

class HistoryContactsService extends BaseService {
  constructor() {
    super({ repository });
    this.repository = repository;
  }

  async getAnalyticsLines({ dateStart, dateEnd, tenantId }) {
    const {
      dateFormat,
      dateStartMoment,
      dateEndMoment,
      groupedBy,
    } = paramsToGetAnalytics({ dateStart, dateEnd });

    const data = await this.repository.getAnalyticsLines({
      dateFormat,
      dateStart: dateStartMoment,
      dateEnd: dateEndMoment,
      tenantId,
    });

    let dataFill = [];

    if (data.length > 0) {
      dataFill = fillDataWithDatesEmpties({
        result: data,
        groupedBy,
        fieldsToFill: {
          numberContacts: 0,
        },
        dateStart: dateStartMoment,
        dateEnd: dateEndMoment,
      });
    }

    return {
      groupedBy,
      data: dataFill,
    };
  }

  async countContactsInOrganizations() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    let informationCountContacts;
    try {
      informationCountContacts = await contactService.getCountContactsInDay();
    } catch (err) {
      console.log(err);
    }

    const historyContactsNew = informationCountContacts.map((informationCountContact) => ({
      tenant: informationCountContact._id,
      numberContacts: informationCountContact.countContactsOrganization,
      numberContactsCreated: informationCountContact.contactsCreatedInDay,
      numberContactsOptOut: informationCountContact.optOutInDay,
      date,
    }));

    return this.createMany(historyContactsNew);
  }
}

const singletonInstance = new HistoryContactsService();

module.exports = singletonInstance;
