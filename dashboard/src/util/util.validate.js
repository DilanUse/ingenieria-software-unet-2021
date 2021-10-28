import { emailRegex } from './util.regex';

/**
 * Validate if an email is a valid email
 *
 * @param {string} email - email to validate
 * @return {boolean}
 */
export function validateEmail(email) {
  return (emailRegex.test(email));
}
