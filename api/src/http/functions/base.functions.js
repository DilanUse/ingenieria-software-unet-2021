const moment = require('moment');
const { PERIODS_OF_TIME } = require('../constants/datetime.constants');

function getImportFromFileResult({ payload, recordsSaved }) {
  const quantityTotal = payload.length;
  const quantityElementsSaved = recordsSaved.length;
  const quantityElementsFailed = Number(quantityTotal) - Number(quantityElementsSaved);
  const sourceTokens = payload.map((el) => el.importIndex);
  const resultTokens = recordsSaved.map((el) => el.importIndex);
  const indicesFailed = sourceTokens.filter((token) => !resultTokens.includes(token));

  return {
    numberSaved: quantityElementsSaved,
    numberFailed: quantityElementsFailed,
    indicesFailed,
  };
}

function paramsToGetAnalytics({ dateStart = null, dateEnd = null }) {
  let dateFormat = '';
  let groupedBy = '';
  let dateStartMoment;
  let dateEndMoment;

  if (!dateStart || !dateEnd) {
    dateStartMoment = moment();
    dateStartMoment.subtract(1, 'months');
    dateEndMoment = moment();
  } else {
    dateStartMoment = moment(dateStart);
    dateEndMoment = moment(dateEnd);
  }

  const intervalDays = dateEndMoment.diff(dateStartMoment, 'days');

  if (intervalDays <= 31) {
    dateFormat = '%Y-%m-%d';
    groupedBy = PERIODS_OF_TIME.DAY;
  } else if (intervalDays > 31 && intervalDays <= 90) {
    dateFormat = '%Y-%U';
    groupedBy = PERIODS_OF_TIME.WEEK;
  } else if (intervalDays > 90 && intervalDays < 731) {
    dateFormat = '%Y-%m';
    groupedBy = PERIODS_OF_TIME.MONTH;
  } else if (intervalDays > 731) {
    dateFormat = '%Y';
    groupedBy = PERIODS_OF_TIME.YEAR;
  }

  return {
    dateFormat,
    dateStartMoment: dateStartMoment.toDate(),
    dateEndMoment: dateEndMoment.toDate(),
    groupedBy,
  };
}

function sortResult(x, y) {
  const t1 = new Date(x._id).getTime();
  const t2 = new Date(y._id).getTime();
  if (t1 < t2) {
    return -1;
  } if (t1 == t2) {
    return 0;
  }
  return 1;
}

function convertNumberOneDigitToTwoDigits(number) {
  const numberString = number.toString();

  if (numberString.length === 1) return `0${numberString}`;

  return numberString;
}

function fillDataWithDatesEmptiesDays({
  result,
  fieldsToFill,
  dateStart,
  dateEnd,
}) {
  const stringDateEnd = `${dateEnd.getFullYear()}-${convertNumberOneDigitToTwoDigits(dateEnd.getMonth() + 1)}-${convertNumberOneDigitToTwoDigits(dateEnd.getDate())}T00:00:00`;
  const stringDateStart = `${dateStart.getFullYear()}-${convertNumberOneDigitToTwoDigits(dateStart.getMonth() + 1)}-${convertNumberOneDigitToTwoDigits(dateStart.getDate())}T00:00:00`;

  const endDateMilliseconds = new Date(stringDateEnd).getTime();
  const startDateMilliseconds = new Date(stringDateStart).getTime();

  const step = 24 * 60 * 60 * 1000; // milliseconds of one day

  const map = {};
  for (const i in result) {
    const date = new Date(`${result[i]._id}T00:00:00`);
    // console.log(`Fechas elegidas ${date.getTime()} Fecha ${date.getFullYear()}-${convertNumberOneDigitToTwoDigits(date.getMonth() + 1)}-${convertNumberOneDigitToTwoDigits(date.getDate())}`);
    map[date.getTime()] = result[i];
  }

  let ms = endDateMilliseconds;

  while (ms > startDateMilliseconds) {
    // console.log(`MS ${ms} Fecha ${dateCurrent.getFullYear()}-${convertNumberOneDigitToTwoDigits(dateCurrent.getMonth() + 1)}-${convertNumberOneDigitToTwoDigits(dateCurrent.getDate())}`);
    if (!(ms in map)) {
      // console.log('No Coincidio');
      // const dateCurrent = new Date(ms);
      const dateCurrent = new Date(ms);
      map[ms] = { _id: `${dateCurrent.getFullYear()}-${convertNumberOneDigitToTwoDigits(dateCurrent.getMonth() + 1)}-${convertNumberOneDigitToTwoDigits(dateCurrent.getDate())}`, ...fieldsToFill };
    }
    ms -= step;
  }

  const finalResult = [];
  for (const x in map) {
    finalResult.push(map[x]);
  }
  finalResult.sort(sortResult);

  return finalResult;
}

function getWeekOfDate(date) {
  const onejan = new Date(date.getFullYear(), 0, 1);
  return convertNumberOneDigitToTwoDigits(Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7));
}

function getDateOfISOWeek(numberWeek, year) {
  const simple = new Date(year, 0, 1 + (numberWeek - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}

function fillDataWithDatesEmptiesWeeks({
  result,
  fieldsToFill,
  dateStart,
  dateEnd,
}) {
  const stringDateEnd = `${dateEnd.getFullYear()}-${convertNumberOneDigitToTwoDigits(dateEnd.getMonth() + 1)}-${convertNumberOneDigitToTwoDigits(dateEnd.getDate())}T00:00:00`;
  const stringDateStart = `${dateStart.getFullYear()}-${convertNumberOneDigitToTwoDigits(dateStart.getMonth() + 1)}-${convertNumberOneDigitToTwoDigits(dateStart.getDate())}T00:00:00`;

  const numberWeekDateEnd = getWeekOfDate(new Date(stringDateEnd));
  const numberWeekDateStart = getWeekOfDate(new Date(stringDateStart));

  // console.log(`numberWeekDateEnd ${numberWeekDateEnd} numberWeekDateStart ${numberWeekDateStart}`);

  const dateEndWeek = getDateOfISOWeek(numberWeekDateEnd, dateEnd.getFullYear());
  const dateStartWeek = getDateOfISOWeek(numberWeekDateStart, dateStart.getFullYear());

  const endDateMilliseconds = dateEndWeek.getTime();
  const startDateMilliseconds = dateStartWeek.getTime();

  // console.log(`endDateMilliseconds ${endDateMilliseconds} startDateMilliseconds ${startDateMilliseconds}`);

  const step = 24 * 60 * 60 * 1000 * 7; // milliseconds of a week

  const finalResult = [];
  let ms = endDateMilliseconds;

  while (ms >= startDateMilliseconds) {
    const dateMilliseconds = new Date(ms);

    const objectFind = result.find((itemResult) => itemResult._id === `${dateMilliseconds.getFullYear()}-${getWeekOfDate(dateMilliseconds)}`);

    if (objectFind === undefined) {
      finalResult.push({ _id: `${dateMilliseconds.getFullYear()}-${getWeekOfDate(dateMilliseconds)}`, ...fieldsToFill });
    } else {
      finalResult.push(objectFind);
    }

    ms -= step;
  }

  // console.log(`Final Reuslt ${JSON.stringify(finalResult)}`);

  return finalResult.reverse();
}

function fillDataWithDatesEmptiesMonths({
  result,
  fieldsToFill,
  dateStart,
  dateEnd,
}) {
  let monthEnd = convertNumberOneDigitToTwoDigits(dateEnd.getMonth() + 1);
  let yearEnd = dateEnd.getFullYear();

  const monthStart = convertNumberOneDigitToTwoDigits(dateStart.getMonth() + 1);
  const yearStart = dateStart.getFullYear();

  const finalResult = [];

  while (monthEnd >= monthStart && yearEnd >= yearStart) {
    const objectFind = result.find((itemResult) => itemResult._id === `${yearEnd}-${convertNumberOneDigitToTwoDigits(monthEnd)}`);

    if (objectFind === undefined) {
      finalResult.push({ _id: `${yearEnd}-${convertNumberOneDigitToTwoDigits(monthEnd)}`, ...fieldsToFill });
    } else {
      finalResult.push(objectFind);
    }

    if (parseFloat(monthEnd) !== 1) {
      monthEnd -= 1;
    } else if (parseFloat(monthEnd) === 1) {
      monthEnd = 12;
      yearEnd -= 1;
    }
  }

  return finalResult.reverse();
}

function fillDataWithDatesEmptiesYears({
  result,
  fieldsToFill,
  dateStart,
  dateEnd,
}) {
  let yearEnd = dateEnd.getFullYear();
  const yearStart = dateStart.getFullYear();

  const finalResult = [];

  while (yearEnd >= yearStart) {
    const objectFind = result.find((itemResult) => itemResult._id === `${yearEnd}`);

    if (objectFind === undefined) {
      finalResult.push({ _id: `${yearEnd}`, ...fieldsToFill });
    } else {
      finalResult.push(objectFind);
    }

    yearEnd -= 1;
  }

  return finalResult.reverse();
}

function fillDataWithDatesEmpties({
  result,
  groupedBy,
  fieldsToFill,
  dateStart,
  dateEnd,

}) {
  if (groupedBy === PERIODS_OF_TIME.DAY) {
    return fillDataWithDatesEmptiesDays({
      result,
      fieldsToFill,
      dateStart,
      dateEnd,
    });
  }
  if (groupedBy === PERIODS_OF_TIME.WEEK) {
    return fillDataWithDatesEmptiesWeeks({
      result,
      fieldsToFill,
      dateStart,
      dateEnd,
    });
  }
  if (groupedBy === PERIODS_OF_TIME.MONTH) {
    return fillDataWithDatesEmptiesMonths({
      result,
      fieldsToFill,
      dateStart,
      dateEnd,
    });
  }

  return fillDataWithDatesEmptiesYears({
    result,
    fieldsToFill,
    dateStart,
    dateEnd,
  });
}

module.exports = {
  getImportFromFileResult,
  paramsToGetAnalytics,
  fillDataWithDatesEmpties,
};
