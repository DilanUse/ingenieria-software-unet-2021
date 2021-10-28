const moment = require('moment');
const mongoose = require('mongoose');
const {
  ROLES_SYSTEM,
} = require('./shared.constant');

const { AppFilterType, AppFilter } = require('../http/constants/app-filters');

const sharedFunctionsObject = {};

/**
 * Function to get the string that the database needs for sort the data
 * @param {Object[]} sortBy - is an array with only an object that describe it the field to order from filter frontend format
 * @param {string} sortBy[].colId - Is the name of field to sort the list data
 * @param {('asc'|'desc')} sortBy[].sort - Is the order for the sort
 */

sharedFunctionsObject.getFieldSort = (sortBy) => {
  let fieldSort = '';

  if (sortBy.length > 0) {
    const objectSortBy = sortBy[0];
    fieldSort = `${objectSortBy.sort === 'desc' ? '-' : ''}${objectSortBy.colId}`;
  }

  return fieldSort;
};

/**
 * Function to get the query find of a field type text
 * @param {Object} $0
 * @param {('contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith')} $0.typeInput - specify the type of query find that must construct this function
 * @param { string } $0.filter - Is the text with the filter to find
 */

sharedFunctionsObject.getQueryFieldText = ({ typeInput, filter }) => {
  let objectFind = {};
  const filterEscape = filter.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

  if (typeInput === AppFilter.FilterType.Text.Type.CONTAINS) {
    objectFind = {
      $regex: `${filterEscape}`,
      $options: 'i',
    };
  } else if (typeInput === AppFilter.FilterType.Text.Type.NOT_CONTAINS) {
    objectFind = {
      $not: {
        $regex: `${filterEscape}`,
        $options: 'i',
      },
    };
  } else if (typeInput === AppFilter.FilterType.Text.Type.EQUALS) {
    objectFind = filter;
  } else if (typeInput === AppFilter.FilterType.Text.Type.NOT_EQUAL) {
    objectFind = {
      $ne: filter,
    };
  } else if (typeInput === AppFilter.FilterType.Text.Type.STARTS_WITH) {
    objectFind = {
      $regex: `^${filterEscape}`,
      $options: 'i',
    };
  } else if (typeInput === AppFilter.FilterType.Text.Type.ENDS_WITH) {
    objectFind = {
      $regex: `${filterEscape}$`,
      $options: 'i',
    };
  }
  return objectFind;
};

/**
 * Function to get the query find of a field type number
 * @param {Object} $0
 * @param {('equals', 'notEqual', 'lessThan', 'lessThanOrEqual', 'greaterThan', 'greaterThanOrEqual', 'inRange')} $0.typeInput - specify the type of query find that must construct this function
 * @param { number } $0.filter - Is the number with the filter to find
 * @param { number } $0.filterTo - Is the number provided in case of the find a range of numbers
 */

sharedFunctionsObject.getQueryFieldNumber = ({ typeInput, filter, filterTo }) => {
  let objectFind;

  if (typeInput === AppFilter.FilterType.Number.Type.EQUALS) {
    objectFind = filter;
  } else if (typeInput === AppFilter.FilterType.Number.Type.NOT_EQUAL) {
    objectFind = {
      $ne: filter,
    };
  } else if (typeInput === AppFilter.FilterType.Number.Type.LESS_THAN) {
    objectFind = {
      $lt: filter,
    };
  } else if (typeInput === AppFilter.FilterType.Number.Type.LESS_THAN_OR_EQUAL) {
    objectFind = {
      $lte: filter,
    };
  } else if (typeInput === AppFilter.FilterType.Number.Type.GREATER_THAN) {
    objectFind = {
      $gt: filter,
    };
  } else if (typeInput === AppFilter.FilterType.Number.Type.GREATER_THAN_OR_EQUAL) {
    objectFind = {
      $gte: filter,
    };
  } else if (typeInput === AppFilter.FilterType.Number.Type.IN_RANGE) {
    objectFind = {
      $gte: filter,
      $lte: filterTo,
    };
  }

  return objectFind;
};

/**
 * Function to get the query find of a field type date
 * @param {Object} $0
 * @param {('inRange','equals', 'notEqual', 'greaterThan', 'lessThan')} $0.typeInput - specify the type of query find that must construct this function
 * @param { date } $0.dateFrom - Is the date to will be use to the query find
 * @param { date } $0.dateTo - Is the date provided in case of a find type inRange
 */

sharedFunctionsObject.getQueryFieldDate = ({
  typeInput, dateFrom, dateTo,
}) => {
  let objectFind;

  const dateFromMoment = moment.utc(new Date(dateFrom));
  if (typeInput === AppFilter.FilterType.Date.Type.IN_RANGE) {
    const dateToMoment = moment.utc(new Date(dateTo)).add(1, 'days');

    objectFind = {
      $gte: dateFromMoment.toDate(),
      $lt: dateToMoment.toDate(),
    };
  } else if (typeInput === AppFilter.FilterType.Date.Type.EQUALS) {
    const dateToMoment = moment.utc(dateFromMoment).add(1, 'days');

    objectFind = {
      $gte: dateFromMoment.toDate(),
      $lt: dateToMoment.toDate(),
    };
  } else if (typeInput === AppFilter.FilterType.Date.Type.NOT_EQUAL) {
    const dateToMoment = moment.utc(dateFromMoment).add(1, 'days');

    objectFind = {
      $not: {
        $gte: dateFromMoment.toDate(),
        $lt: dateToMoment.toDate(),
      },
    };
  } else if (typeInput === AppFilter.FilterType.Date.Type.GREATER_THAN) {
    objectFind = {
      $gte: dateFromMoment.add(1, 'days').toDate(),
    };
  } else if (typeInput === AppFilter.FilterType.Date.Type.LESS_THAN) {
    objectFind = {
      $lt: dateFromMoment.toDate(),
    };
  }

  return objectFind;
};

/**
 * Function to get the query find of a field type boolean
 * @param {string} filter - Indicate the condition for set the value for the query find
 */

sharedFunctionsObject.getQueryFieldBoolean = (filter) => {
  let value;
  if (filter === AppFilter.FilterType.Boolean.Values.YES) value = true;
  else if (filter === AppFilter.FilterType.Boolean.Values.NO) value = false;
  else value = { $nin: [true, false] };

  const objectFind = value;
  return objectFind;
};

/**
 * Function to get the query find of a field type categories
 * @param {Object} $0
 * @param {('one','all', 'none')} $0.typeInput - specify the type of query find that must construct this function
 * @param { string[] } $0.filter - Is the filter that will be used in the query find
 */

sharedFunctionsObject.getQueryFieldCategories = ({ typeInput, filter }) => {
  let objectFind;

  if (typeInput === AppFilter.FilterType.Categories.Type.ONE) {
    objectFind = { $in: filter };
  } else if (typeInput === AppFilter.FilterType.Categories.Type.ALL) {
    objectFind = {
      $all: filter,
    };
  } else if (typeInput === AppFilter.FilterType.Categories.Type.NONE) {
    objectFind = {
      $nin: filter,
    };
  } else if (typeInput === AppFilter.FilterType.Categories.Type.NONE_ANY) {
    objectFind = {
      $not: { $all: filter },
    };
  }

  return objectFind;
};

/**
 * Function to get the query find of a field type tags
 * @param {string[]} filter - Is the filter that will be used in the query find
 */

sharedFunctionsObject.getQueryFieldTags = ({ typeInput, filter }) => {
  let objectFind;
  console.log(`TypeInput ${typeInput}`);

  if (typeInput === AppFilter.FilterType.Tags.Type.ONE) {
    objectFind = { $in: filter };
  } else if (typeInput === AppFilter.FilterType.Tags.Type.ALL) {
    objectFind = {
      $all: filter,
    };
  } else if (typeInput === AppFilter.FilterType.Tags.Type.NONE) {
    objectFind = {
      $nin: filter,
    };
  } else if (typeInput === AppFilter.FilterType.Tags.Type.NONE_ANY) {
    objectFind = {
      $not: { $all: filter.map((id) => mongoose.Types.ObjectId(id)) },
    };
  }

  return objectFind;
};

/**
 * Function that handle each field of the filter
 * @param {object} objectField - Contains all information for get the query right for the field
 * @param { string } objectField.filterType - specify the type of field to will be processed
 * @param { string } objectField.type - specify the type of query that must be processed for query find
 * @param {filter} objectField.filter - Is the filter to match in the query find
 * @param { filterTo } objectField.filterTo - In some cases this attribute is need for type inRange
 * @param { dateFrom } objectField.dateFrom - In some cases this attribute is need for filterType date
 * @param { dateTo } objectField.dateTo - In some cases this attribute is need for filterType date and type inRange
 */
sharedFunctionsObject.getQueryFindField = (objectField) => {
  let objectFind = {};

  const {
    filterType, type: typeInput, filter,
    filterTo, dateFrom, dateTo,
  } = objectField;

  switch (filterType) {
    case AppFilterType.TEXT:
      objectFind = sharedFunctionsObject.getQueryFieldText({ typeInput, filter });
      break;
    case AppFilterType.NUMBER:
      objectFind = sharedFunctionsObject.getQueryFieldNumber({ typeInput, filter, filterTo });
      break;
    case AppFilterType.DATE:
      objectFind = sharedFunctionsObject.getQueryFieldDate({
        typeInput, dateFrom, dateTo,
      });
      break;
    case AppFilterType.BOOLEAN:
      objectFind = sharedFunctionsObject.getQueryFieldBoolean(filter);
      break;
    case AppFilterType.CATEGORIES:
    case AppFilterType.ENUM:
      objectFind = sharedFunctionsObject.getQueryFieldCategories({ typeInput, filter });
      break;
    case AppFilterType.TAGS:
      objectFind = sharedFunctionsObject.getQueryFieldTags({ typeInput, filter });
      break;
    default:
      break;
  }

  return objectFind;
};

/**
 * Function for handle all information in object form for the complete query find
 * @param {object} filters Object will all information of the query find
 */

sharedFunctionsObject.getFiltersForQueryFind = ({ filters, filtersMatch = AppFilter.FilterMathType.ALL }) => {
  const objectFiltersField = {};

  console.log(`Que esta devolviendo con el filters ${JSON.stringify(filters)}`);
  console.log(`Que esta devolviendo el filtersMatch ${JSON.stringify(filtersMatch)}`);

  const orArrayConditionsAllFilters = [];

  Object.keys(filters).forEach((field) => {

    console.log(`Quien es field ${field}`);

    const objectField = filters[field];

    console.log(`Quien es objectField ${JSON.stringify(objectField)}`);

    if (objectField.filterType
        && (
          objectField.filterType === AppFilterType.TEXT
          || objectField.filterType === AppFilterType.NUMBER
          || objectField.filterType === AppFilterType.DATE
          || objectField.filterType === AppFilterType.BOOLEAN
          || objectField.filterType === AppFilterType.CATEGORIES
          || objectField.filterType === AppFilterType.ENUM
          || objectField.filterType === AppFilterType.TAGS
        )
    ) {
      if (!objectField.operator) {
        let nameField;

        if (objectField.filterType === AppFilterType.CATEGORIES) nameField = `${field}._id`;
        else if (!objectField.filterInner) nameField = field;
        else if (objectField.filterInner) nameField = `${field}.${objectField.filterInner}`;
        if (objectField.filterType === AppFilterType.CATEGORIES) {
          const queryFindField = sharedFunctionsObject.getQueryFindField(objectField);

          if (filtersMatch === AppFilter.FilterMathType.ANY) {
            if (objectField.isDefaultFilter && objectField.isDefaultFilter === true) objectFiltersField[nameField] = queryFindField;
            else orArrayConditionsAllFilters.push({ [nameField]: queryFindField });
          } else if (filtersMatch === AppFilter.FilterMathType.ALL) objectFiltersField[nameField] = queryFindField;
        } else {
          const queryFindField = sharedFunctionsObject.getQueryFindField(objectField);

          if (filtersMatch === AppFilter.FilterMathType.ANY) {
            if (objectField.isDefaultFilter && objectField.isDefaultFilter === true) objectFiltersField[nameField] = queryFindField;
            else orArrayConditionsAllFilters.push({ [nameField]: queryFindField });
          } else if (filtersMatch === AppFilter.FilterMathType.ALL) objectFiltersField[nameField] = queryFindField;
        }
      } else if (objectField.operator) {
        const objectFilter = {};
        const orArrayConditions = [];
        const andArrayConditions = [];

        let nameField;

        if (!objectField.filterInner) nameField = field;
        else if (objectField.filterInner) nameField = `${field}.${objectField.filterInner}`;

        objectFilter[nameField] = sharedFunctionsObject.getQueryFindField(objectField.condition1);

        if (objectField.operator === AppFilter.FilterOperator.OR) {
          orArrayConditions.push(objectFilter);
        } else if (objectField.operator === AppFilter.FilterOperator.AND) {
          andArrayConditions.push(objectFilter);
        }

        const objectFilter2 = {};
        objectFilter2[nameField] = sharedFunctionsObject.getQueryFindField(objectField.condition2);

        if (objectField.operator === AppFilter.FilterOperator.OR) {
          orArrayConditions.push(objectFilter2);
          if (filtersMatch === AppFilter.FilterMathType.ANY) orArrayConditionsAllFilters.push({ $or: orArrayConditions });
          else if (filtersMatch === AppFilter.FilterMathType.ALL) objectFiltersField.$or = orArrayConditions;
        } else if (objectField.operator === AppFilter.FilterOperator.AND) {
          andArrayConditions.push(objectFilter2);
          if (filtersMatch === AppFilter.FilterMathType.ANY) orArrayConditionsAllFilters.push({ $and: andArrayConditions });
          else if (filtersMatch === AppFilter.FilterMathType.ALL) objectFiltersField.$and = andArrayConditions;
        }
      }
    }
  });

  if (filtersMatch === AppFilter.FilterMathType.ANY) {
    if (parseFloat(orArrayConditionsAllFilters.length) > 0) return { $or: orArrayConditionsAllFilters, ...objectFiltersField };
  }

  console.log(`Òbject filters field ${JSON.stringify(objectFiltersField)}`);

  return objectFiltersField;
};

sharedFunctionsObject.getQueryFindBeforePastDate = ({ field, daysOffset }) => {
  const dateOffset = new Date();
  dateOffset.setDate(dateOffset.getDate() - daysOffset);

  const queryFind = {};
  queryFind[field] = { $lt: dateOffset };

  return queryFind;
};
sharedFunctionsObject.getQueryFindForPrivateResources = ({
  tenantId, userRole, userId, idResource = '', filters = '', filtersMatch = 'all',
}) => {
  const conditionalsOr = [{
    creator: userId,
  }];

  let queryFind;

  if (userRole === ROLES_SYSTEM.ROLES.MERCHANT_ADMIN
    || userRole === ROLES_SYSTEM.ROLES.MERCHANT_OWNER) {
    const objectForTenant = {
      tenant: tenantId,
    };

    conditionalsOr.push(objectForTenant);
  }

  queryFind = {
    $or: conditionalsOr,
  };

  if (idResource !== '') {
    // eslint-disable-next-line no-underscore-dangle
    queryFind._id = idResource;
  }

  if (filters !== '') {
    const objectFiltersField = sharedFunctionsObject.getFiltersForQueryFind({
      filters,
      filtersMatch,
    });

    queryFind = {
      ...queryFind,
      ...objectFiltersField,
    };
  }

  return queryFind;
};

sharedFunctionsObject.getQueryFindForPublic = ({
  tenantId, idResource = '', filters = '', filtersMatch = AppFilter.FilterMathType.ALL,
}) => {
  let queryFind = {
    tenant: tenantId,
  };

  if (idResource !== '') {
    // eslint-disable-next-line no-underscore-dangle
    queryFind._id = idResource;
  }

  if (filters !== '') {
    const objectFiltersField = sharedFunctionsObject.getFiltersForQueryFind(
      {
        filters,
        filtersMatch,
      },
    );

    queryFind = {
      ...queryFind,
      ...objectFiltersField,
    };
  }

  return queryFind;
};

sharedFunctionsObject.verifyPaymentCapacity = (ownerOrganization, numberContacts,
  informationPaysContacts, plansWithPrices, idCampaign = '', codeCountrySender = '', typeService) => {
  const objectInformationPaid = {
    paid: 0,
    informationPays: [],
    idOwner: ownerOrganization._id,
    costTotal: 0,
    paidTest: 0,
    paidTestWithoutFrozen: 0,
  };

  // Calculando el costo del test

  if (codeCountrySender !== '') {
    console.log('Aqui debe estar entrando');
    let costReady = 0;

    plansWithPrices.forEach((plan) => {
      if (plan.codeCountry === codeCountrySender) {
        if (ownerOrganization.monthlyPlan) {
          let { balance } = ownerOrganization.monthlyPlan;
          const balanceInitial = balance;
          const optionPlan = ownerOrganization.monthlyPlan.optionCode;
          // const discountPerCall = plan.options[optionPlan].voicemail.monthlyPrice;

          const discountForEach = plan.options[optionPlan][typeService].monthlyPrice;
          /*
            if( typeService === 'sms' )
              const discountForEach = plan.options[optionPlan].sms.monthlyPrice;
            else if( typeService === 'voicemail' )
            const discountForEach = plan.options[optionPlan].voicemail.monthlyPrice;

          */

          const { balancesFrozen } = ownerOrganization.monthlyPlan;

          if (balancesFrozen) {
            const arrayPropertiesObject = Object.keys(balancesFrozen._doc);

            if (arrayPropertiesObject) {
              arrayPropertiesObject.forEach((property) => {
                // console.log(`esta es la property ${property} ${balancesFrozen._doc[property]} y este es el idVoice ${idVoiceCampaign}`);
                if (property !== idCampaign && property !== '_id') {
                  // console.log('Esta entrando aqui');
                  balance -= parseFloat(balancesFrozen._doc[property]);
                }
              });
            }
          }

          console.log('Llego aqui');

          if (balanceInitial >= discountForEach) objectInformationPaid.paidTestWithoutFrozen = 1;

          if ((balance >= discountForEach) && costReady === 0) {
            costReady = 1;
            console.log('Se metio se metio');
            objectInformationPaid.priceCostTest = discountForEach;
            objectInformationPaid.paidTest = 1;
          }
        } else {
          console.log('Llego aqui');
          ownerOrganization.prepaidPlans.forEach((prepaidPlan) => {
            console.log('Entro en forEach de prepaidPlans');
            let { balance } = prepaidPlan;
            const balanceInitial = balance;
            const optionPlan = prepaidPlan.optionCode;
            const discountForEach = plan.options[optionPlan][typeService].prepaidPrice;

            const { balancesFrozen } = prepaidPlan;

            if (balancesFrozen) {
              const arrayPropertiesObject = Object.keys(balancesFrozen._doc);

              if (arrayPropertiesObject) {
                arrayPropertiesObject.forEach((property) => {
                  if (property !== idCampaign && property !== '_id') {
                    balance -= parseFloat(balancesFrozen._doc[property]);
                  }
                });
              }
            }

            console.log('Llego aqui');

            if (balanceInitial >= discountForEach) objectInformationPaid.paidTestWithoutFrozen = 1;

            if ((balance >= discountForEach) && costReady === 0) {
              costReady = 1;
              console.log('Se metio se metio');
              objectInformationPaid.priceCostTest = discountForEach;
              objectInformationPaid.paidTest = 1;
            }
          });
        }
      }
    });
  } // End of conditional codeCountrySender
  let spending = 0;
  let nextCountry = 1;
  let spendingSubjectError = 0;
  let nextCountrySubjectError = 1;
  // const discountMonthly = 0;

  console.log(`Dentro de verifyPaymentCapacity este es el informationPaysContacts
  ${JSON.stringify(informationPaysContacts)} este es el plansWithPrices ${plansWithPrices}`);

  informationPaysContacts.forEach((payContact) => {
    if (nextCountry === 1 || nextCountrySubjectError === 1) {
      let { contactsByCountry } = payContact;
      let spendingCurrent = spending;
      let spendingCurrentSubjectError = spendingSubjectError;
      let contactsByCountrySubjectError = contactsByCountry;

      plansWithPrices.forEach((plan) => {
        if (plan.codeCountry === payContact.country) {
          if (ownerOrganization.monthlyPlan) {
            const optionPlan = ownerOrganization.monthlyPlan.optionCode;
            let { balance } = ownerOrganization.monthlyPlan;
            let balanceSubjectError = balance;

            const { balancesFrozen } = ownerOrganization.monthlyPlan;

            if (balancesFrozen) {
              const arrayPropertiesObject = Object.keys(balancesFrozen._doc);

              if (arrayPropertiesObject) {
                arrayPropertiesObject.forEach((property) => {
                  // console.log(`esta es la property ${property} ${balancesFrozen._doc[property]} y este es el idVoice ${idVoiceCampaign}`);
                  if (property !== idCampaign && property !== '_id') {
                    // console.log('Esta entrando aqui');
                    balance -= parseFloat(balancesFrozen._doc[property]);
                  }
                });
              }
            }

            const discountPerEach = plan.options[optionPlan][typeService].monthlyPrice;

            if (spendingCurrent >= balance) {
              const quantityPaid = balance / discountPerEach;

              spendingCurrent -= (Math.floor(quantityPaid) * discountPerEach);
              balance -= spendingCurrent;
            } else {
              balance -= spendingCurrent;
              spendingCurrent = 0;
            }

            // For the explanation of the error

            if (spendingSubjectError >= balanceSubjectError) {
              const quantityPaidSubjectError = balance / discountPerEach;
              spendingCurrentSubjectError -= (Math.floor(quantityPaidSubjectError) * discountPerEach);
              balanceSubjectError -= spendingCurrentSubjectError;
            } else {
              balanceSubjectError -= spendingCurrentSubjectError;
              spendingCurrentSubjectError = 0;
            }

            let quantityForPaySubjectError = 0;

            if (balanceSubjectError > 0) quantityForPaySubjectError = balanceSubjectError / discountPerEach;

            if (Math.floor(quantityForPaySubjectError) > 0) {
              if (Math.floor(quantityForPaySubjectError) >= contactsByCountrySubjectError) {
                spendingSubjectError += (contactsByCountrySubjectError * discountPerEach);
                contactsByCountrySubjectError = 0;
              } else {
                contactsByCountrySubjectError -= Math.floor(quantityForPaySubjectError);
                spendingSubjectError += (Math.floor(quantityForPaySubjectError) * discountPerEach);
              }
            }

            // ----------------------

            if (nextCountry === 1) {
              let quantityForPay = 0;

              if (balance > 0) quantityForPay = balance / discountPerEach;

              if (Math.floor(quantityForPay) > 0) {
                const objectPay = {};
                objectPay.method = 'monthly';
                if (Math.floor(quantityForPay) >= contactsByCountry) {
                  spending += (contactsByCountry * discountPerEach);
                  objectPay.quantity = contactsByCountry;
                  contactsByCountry = 0;
                } else {
                  contactsByCountry -= Math.floor(quantityForPay);
                  spending += (Math.floor(quantityForPay) * discountPerEach);
                  objectPay.quantity = Math.floor(quantityForPay);
                }

                objectPay.price = discountPerEach;

                objectInformationPaid.informationPays.push(objectPay);
              }
            }
          }

          if (contactsByCountry > 0) {
            ownerOrganization.prepaidPlans.forEach((prepaidPlan) => {
              console.log('Entro en el for de los prepaids');
              const optionPlan = prepaidPlan.optionCode;
              let { balance } = prepaidPlan;
              let balanceSubjectError = balance;

              const { balancesFrozen } = prepaidPlan;

              if (balancesFrozen) {
                // console.log(`Balances Frozen ${JSON.stringify(balancesFrozen._doc)}`);
                const arrayPropertiesObject = Object.keys(balancesFrozen._doc);
                // const arrayPropertiesObject = Object.getOwnPropertyNames(balancesFrozen._doc);

                // console.log(`Mire que esta pasando ${JSON.stringify(arrayNewObject)}`);

                if (arrayPropertiesObject) {
                  arrayPropertiesObject.forEach((property) => {
                    // console.log(`esta es la property ${property} ${balancesFrozen._doc[property]} y este es el idVoice ${idVoiceCampaign}`);
                    if (property !== idCampaign && property !== '_id') {
                      // console.log('Esta entrando aqui');
                      balance -= parseFloat(balancesFrozen._doc[property]);
                    }
                  });
                }
              }

              const discountPerEach = plan.options[optionPlan][typeService].prepaidPrice;

              if (spendingCurrent > balance) {
                const quantityPaid = balance / discountPerEach;

                spendingCurrent -= (Math.floor(quantityPaid) * discountPerEach);
                balance -= spendingCurrent;
              } else {
                balance -= spendingCurrent;
                spendingCurrent = 0;
              }

              // For the explanation of the error

              if (contactsByCountrySubjectError > 0) {
                if (spendingSubjectError >= balanceSubjectError) {
                  const quantityPaidSubjectError = balanceSubjectError / discountPerEach;
                  spendingCurrentSubjectError -= (Math.floor(quantityPaidSubjectError) * discountPerEach);
                  balanceSubjectError -= spendingCurrentSubjectError;
                } else {
                  balanceSubjectError -= spendingCurrentSubjectError;
                  spendingCurrentSubjectError = 0;
                }

                let quantityForPaySubjectError = 0;

                if (balanceSubjectError > 0) quantityForPaySubjectError = balanceSubjectError / discountPerEach;

                if (Math.floor(quantityForPaySubjectError) > 0) {
                  if (Math.floor(quantityForPaySubjectError) >= contactsByCountrySubjectError) {
                    spendingSubjectError += (contactsByCountrySubjectError * discountPerEach);
                    contactsByCountrySubjectError = 0;
                  } else {
                    contactsByCountrySubjectError -= Math.floor(quantityForPaySubjectError);
                    spendingSubjectError += (Math.floor(quantityForPaySubjectError) * discountPerEach);
                  }
                }
              }

              // ----------------------

              console.log(`Valores del balance y de discountPerEach ${balance} ${discountPerEach}`);

              if (nextCountry === 1 && contactsByCountry > 0) {
                const quantityForPay = balance / discountPerEach;

                if (Math.floor(quantityForPay) > 0) {
                  const objectPay = {};

                  objectPay.method = 'prepaid';
                  if (Math.floor(quantityForPay) >= contactsByCountry) {
                    spending += (contactsByCountry * discountPerEach);
                    objectPay.quantity = contactsByCountry;
                    contactsByCountry = 0;
                  } else {
                    contactsByCountry -= Math.floor(quantityForPay);
                    spending += (Math.floor(quantityForPay) * discountPerEach);
                    objectPay.quantity = Math.floor(quantityForPay);
                  }

                  objectPay.price = discountPerEach;
                  // eslint-disable-next-line no-underscore-dangle
                  objectPay.idPrepaid = prepaidPlan._id;

                  objectInformationPaid.informationPays.push(objectPay);
                }
              }
            });
          }
        } // estamos en el pais que se tiene que tomar como referencia para el precio
      });

      if (contactsByCountry > 0 || nextCountry === 0) {
        objectInformationPaid.paid = 0;
        nextCountry = 0;
      } else objectInformationPaid.paid = 1;

      if (contactsByCountrySubjectError > 0) {
        objectInformationPaid.paidSubjectError = 0;
        nextCountrySubjectError = 0;
      } else {
        objectInformationPaid.paidSubjectError = 1;
      }
    }
  });

  objectInformationPaid.costTotal = spending;
  console.log(`Este es el objectInformationPaid que aparece al final del
  shared functions ${JSON.stringify(objectInformationPaid)}`);

  return objectInformationPaid;
};

sharedFunctionsObject.verifyPaymentCapacityTest = (ownerOrganization, plansWithPrices,
  codeCountrySender, idSlyBroadcast, typeService) => {
  let costReady = 0;

  const objectInformationPaid = {
    paid: 0,
    informationPays: [],
    // eslint-disable-next-line no-underscore-dangle
    idOwner: ownerOrganization._id,
  };

  plansWithPrices.forEach((plan) => {
    if (plan.codeCountry === codeCountrySender) {
      if (ownerOrganization.monthlyPlan) {
        let { balance } = ownerOrganization.monthlyPlan;
        const optionPlan = ownerOrganization.monthlyPlan.optionCode;
        const discountPerEach = plan.options[optionPlan][typeService].monthlyPrice;

        const { balancesFrozen } = ownerOrganization.monthlyPlan;

        if (balancesFrozen) {
          const arrayPropertiesObject = Object.keys(balancesFrozen._doc);

          if (arrayPropertiesObject) {
            arrayPropertiesObject.forEach((property) => {
              // console.log(`esta es la property ${property} ${balancesFrozen._doc[property]} y este es el idVoice ${idVoiceCampaign}`);
              if (property !== idSlyBroadcast && property !== '_id') {
                // console.log('Esta entrando aqui');
                balance -= parseFloat(balancesFrozen._doc[property]);
              }
            });
          }
        }

        if ((balance >= discountPerEach) && costReady === 0) {
          costReady = 1;

          // objectInformationPaid.

          const objectPay = {};

          objectPay.method = 'monthly';

          objectPay.quantity = 1;
          objectPay.price = discountPerEach;

          objectInformationPaid.paid = 1;

          objectInformationPaid.informationPays.push(objectPay);
        }
      }

      if (costReady === 0) {
        ownerOrganization.prepaidPlans.forEach((prepaidPlan) => {
          let { balance } = prepaidPlan;
          const optionPlan = prepaidPlan.optionCode;
          const { balancesFrozen } = prepaidPlan;

          const discountPerEach = plan.options[optionPlan][typeService].prepaidPrice;

          if (balancesFrozen) {
            const arrayPropertiesObject = Object.keys(balancesFrozen._doc);

            if (arrayPropertiesObject) {
              arrayPropertiesObject.forEach((property) => {
                if (property !== idSlyBroadcast && property !== '_id') {
                  balance -= parseFloat(balancesFrozen._doc[property]);
                }
              });
            }
          }

          console.log('Esta llegando aqui o que?');

          if ((balance >= discountPerEach) && costReady === 0) {
            console.log('Aqui dentro de la broma');
            costReady = 1;
            const objectPay = {};

            objectPay.method = 'prepaid';
            objectPay.idPrepaid = prepaidPlan._id;
            objectPay.quantity = 1;
            objectPay.price = discountPerEach;

            objectInformationPaid.paid = 1;
            objectInformationPaid.informationPays.push(objectPay);
          }
        });
      }
    }
  });

  console.log(`Retornando la broma del objectInformationPaid de la broma del test
  ${JSON.stringify(objectInformationPaid)}`);

  return objectInformationPaid;
};

module.exports = sharedFunctionsObject;
