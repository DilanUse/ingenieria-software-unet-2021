const moment = require('moment');

const FIVE_MINUTES_IN_SECONDS = 300;
const SIXTY_MINUTES_IN_SECONDS = 3600;
const ONE_DAY_IN_MILLISECONDS = 1000 * 3600 * 24;

const convertFormatTime = (value,
  wordFormat = false,
  fullDate = true,
  timeDate = false,
  fullTime = false,
  militaryTime = false,
  utc = true) => {
  if (!value) return '';

  const date = new Date(value);
  const separator = wordFormat ? ' ' : '/';
  let format = 'DD';
  format += wordFormat ? `${separator}MMM` : `${separator}MM`;
  if (fullDate) format += `${separator}YYYY`;

  if (timeDate) {
    format += militaryTime ? ' HH:mm' : ' hh:mm';
    format += fullTime ? ':ss' : '';
    format += militaryTime ? '' : ' a';
  }

  if (utc) {
    return moment.utc(date).format(format);
  }

  return moment(date).format(format);
};

module.exports = {
  FIVE_MINUTES_IN_SECONDS,
  SIXTY_MINUTES_IN_SECONDS,
  ONE_DAY_IN_MILLISECONDS,
  convertFormatTime,
};
