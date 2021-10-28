const ContactModel = require('../../components/contacts/contact/contact.model');
const campaignConstants = require('../constants/common-campaign.constants');

const { AppFilterType } = require('../constants/app-filters');

function getDetailContacts(contacts) {
  return contacts.map((contact) => ({
    // eslint-disable-next-line no-underscore-dangle
    contact: contact._id,
    to: `${contact.dialCode}${contact.phoneSignificant}`,
    status: campaignConstants.CONTACTS_DETAILS.STATUS.PENDING,
    reasonForFailure: '',
    deliveryTime: '',
    carrier: '',
  }));
}

function getInterpolatedMessage({
  message, interpolations, contact, replaceVoidAttributes = false,
}) {
  let messageInterpolated = message;
  const contactMongoose = new ContactModel(contact);

  interpolations.forEach((interpolation) => {
    // console.log(`Result query interpolation ${interpolation.attribute} ${Array.isArray(contactMongoose[interpolation.attribute])}`);

    if (!contactMongoose[interpolation.attribute] && replaceVoidAttributes) {
      messageInterpolated = messageInterpolated.replace(
        interpolation.shorthand, interpolation.attribute,
      );
    } else if (interpolation.type === AppFilterType.CATEGORIES) {
      let stringElementsOfArray = '';

      contactMongoose[interpolation.attribute].forEach((elem) => {
        stringElementsOfArray += ` ${elem.name}`;
      });

      messageInterpolated = messageInterpolated
        .replace(interpolation.shorthand, stringElementsOfArray);
    } else {
      messageInterpolated = messageInterpolated.replace(
        interpolation.shorthand, contactMongoose[interpolation.attribute],
      );
    }
  });

  return messageInterpolated;
}

function setInterpolatedMessagesInContacts({
  contacts, message, interpolations, marketingCampaign,
}) {
  return contacts.map((contact) => ({
    ...contact,
    messageToSend: getInterpolatedMessage({
      message, interpolations, contact, marketingCampaign,
    }),

  }));
}

function getTotalNumberMessages(contacts) {
  let numberMessages = 0;

  contacts.forEach((contact) => {
    numberMessages += contact.numberMessagesSend;
  });

  return numberMessages;
}

function getBalanceFrozenTotal(balancesFrozen) {
  let balance = 0;

  if (balancesFrozen) {
    const arrayBalancesFrozen = Object.keys(balancesFrozen);

    arrayBalancesFrozen.forEach((keyBalanceFrozen) => {
      if (keyBalanceFrozen !== '_id') {
        balance += Number(balancesFrozen[keyBalanceFrozen]);
      }
    });
  }

  return balance;
}

function getBalanceFrozenByIdCampaign({ balanceFrozen, idCampaign }) {
  let balance = 0;

  if (balanceFrozen) {
    const arrayBalancesFrozen = Object.keys(balanceFrozen);

    arrayBalancesFrozen.forEach((keyBalanceFrozen) => {
      if (keyBalanceFrozen !== '_id' && keyBalanceFrozen.toString() === idCampaign.toString()) {
        balance += Number(balanceFrozen[keyBalanceFrozen]);
      }
    });
  }

  return balance;
}

function getNumberOfPaidMessages({ balance, costUnit, numberMessagesRemaining }) {
  let numberMessagesForPaid = Math.floor(balance / costUnit);

  if (numberMessagesForPaid >= numberMessagesRemaining) {
    numberMessagesForPaid = numberMessagesRemaining;
  }

  return numberMessagesForPaid;
}

function getMessageWithOptOutUrl({ message, url }) {
  return `${message} Opt-out: ${url}`;
}

module.exports = {
  getDetailContacts,
  getInterpolatedMessage,
  setInterpolatedMessagesInContacts,
  getTotalNumberMessages,
  getBalanceFrozenTotal,
  getBalanceFrozenByIdCampaign,
  getNumberOfPaidMessages,
  getMessageWithOptOutUrl,
};
