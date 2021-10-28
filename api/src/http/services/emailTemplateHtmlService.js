const fs = require('fs');
const util = require('util');
const ejs = require('ejs');
const { config } = require('../../config');

const fsReadFilePromise = util.promisify(fs.readFile);

const EMAIL_TEMPLATES_NAMES = {
  EXPORT: 'export',
  DOWNLOAD_FILES: 'download-files',
  INVOICE: 'invoice',
  REGISTER: 'register',
  RECOVERY_PASSWORD: 'recovery-password',
  VERIFY_EMAIL_ACCOUNT: 'verify-email-account',
};

function emailTemplateNameIsValid(emailTemplateName) {
  return Object.values(EMAIL_TEMPLATES_NAMES).includes(emailTemplateName);
}

function paramsAreValidForEmailTemplate({
  emailTemplateName = '', params = null,
}) {
  return true; // todo: validate params with joi
}

async function getEmailTemplateHtml({
  emailTemplateName = '', params = null,
}) {
  if (!emailTemplateNameIsValid(emailTemplateName)) {
    throw new Error('Email Template name is invalid');
  }

  if (!paramsAreValidForEmailTemplate({ emailTemplateName, params })) {
    throw new Error(`Email Template params are invalid for '${emailTemplateName}' template`);
  }

  const header = await fsReadFilePromise('src/assets/email-templates/layouts/header.html', {
    encoding: 'utf-8',
  });
  const footer = await fsReadFilePromise('src/assets/email-templates/layouts/footer.html', {
    encoding: 'utf-8',
  });
  const emailTemplate = await fsReadFilePromise(`src/assets/email-templates/${emailTemplateName}.html`, {
    encoding: 'utf-8',
  });

  const headerHtml = await ejs.render(header, {
    logoHref: config.baseUrlDashboard,
    logoSrc: 'https://storagedashboardgrapeperks-dev.s3-ap-southeast-2.amazonaws.com/logo.png',
  });

  return ejs.render(emailTemplate, {
    header: headerHtml,
    footer,
    ...params,
  });
}

module.exports = {
  EMAIL_TEMPLATES_NAMES,
  getEmailTemplateHtml,
};
