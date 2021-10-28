import Vue from 'vue';
import moment from 'moment';
import { parsePhoneNumber } from 'libphonenumber-js';

Vue.filter('capitalize', (value) => {
  if (!value) return '';
  value = value.toString();
  const arr = value.split(' ');
  const capitalizedArray = [];
  arr.forEach((word) => {
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
    capitalizedArray.push(capitalized);
  });
  return capitalizedArray.join(' ');
});

Vue.filter('camelize', (value) => {
  if (!value) return '';
  value = value.toString();
  const arr = value.split(' ');
  const capitalizedArray = [];
  arr.forEach((word, index) => {
    const capitalized = index > 0
      ? word.charAt(0).toUpperCase() + word.slice(1)
      : word;
    capitalizedArray.push(capitalized);
  });
  return capitalizedArray.join(' ');
});

Vue.filter('lowercase', (value) => {
  if (!value) return '';
  const strValue = value.toString();
  return strValue.toLowerCase();
});

Vue.filter('uppercase', (value) => {
  if (!value) return '';
  const strValue = value.toString();
  return strValue.toUpperCase();
});

Vue.filter('uppercaseDash', (value) => {
  if (!value) return '';
  const strValue = value.toString();
  return strValue.toUpperCase().replace(' ', '-');
});

Vue.filter('title', (value, replacer = '_') => {
  if (!value) return '';
  value = value.toString();

  const arr = value.split(replacer);
  const capitalized_array = [];
  arr.forEach((word) => {
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
    capitalized_array.push(capitalized);
  });
  return capitalized_array.join(' ');
});

Vue.filter('truncate', (value, limit) => value.substring(0, limit));
Vue.filter('truncateEllipsis', (value, limit) => (value.length <= limit ? value : `${value.substring(0, limit)}...`));

Vue.filter('tailing', (value, tail) => value + tail);

Vue.filter('time', (value, is24HrFormat = false) => {
  if (value) {
    const date = new Date(Date.parse(value));
    let hours = date.getHours();
    const min = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    if (!is24HrFormat) {
      const time = hours > 12 ? 'AM' : 'PM';
      hours = hours % 12 || 12;
      return `${hours}:${min} ${time}`;
    }
    return `${hours}:${min}`;
  }
});

Vue.filter('date',
  (value,
    wordFormat = true,
    fullDate = true,
    timeDate = true,
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
  });

Vue.filter('month', (val, showYear = true) => {
  val = String(val);

  const regx = /\w+\s(\w+)\s\d+\s(\d+)./;
  if (!showYear) {
    return regx.exec(val)[1];
  }
  return `${regx.exec(val)[1]} ${regx.exec(val)[2]}`;
});

Vue.filter('card_exp', (val, allYear = false) => {
  const value = String(val);
  const parts = value.split('/');

  if (parts && Array.isArray(parts) && parts.length === 2) {
    const month = Number(parts[0]) < 10 ? `0${parts[0]}` : parts;
    const year = allYear ? parts[1] : parts[1].substr(2);

    return `${month}/${year}`;
  }

  return val;
});

Vue.filter('csv', (value) => value.join(', '));

Vue.filter('filter_tags', (value) => value.replace(/<\/?[^>]+(>|$)/g, ''));

Vue.filter('k_formatter', (num) => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num));

Vue.filter('dollar', (value, decimals = 2) => {
  const formatter = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: decimals,
  });

  return formatter.format(value);
});

Vue.filter('phone', (value, international = true) => {
  if (!value) {
    return '';
  }

  let phone = value;

  if (value.indexOf('+') < 0) {
    phone = `+${phone}`;
  }

  try {
    const phoneNumber = parsePhoneNumber(phone);

    if (phoneNumber && phoneNumber.isValid()) {
      return international
        ? phoneNumber.formatInternational()
        : phoneNumber.formatNational();
    }
  } catch (e) {
    return '';
  }

  return '';
});

Vue.filter('fixed_number', (value, precision = 2) => {
  return Number.isNaN(Number(value)) ? '0.00' : Number(value).toFixed(precision);
});
