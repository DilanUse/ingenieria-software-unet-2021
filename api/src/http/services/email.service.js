const sendGridService = require('./send-grid.service');
const emailTemplateHtmlService = require('./emailTemplateHtmlService');

const EMAIL_PROVIDERS = {
  SEND_GRID: 'send-grid',
};

const FROM_DEFAULT = 'dilan8810@gmail.com';

class EmailService {
  constructor() {
    this.transactionalProvider = EMAIL_PROVIDERS.SEND_GRID;
    this.camapignProvider = EMAIL_PROVIDERS.SEND_GRID;
  }

  async sendCampaignEmail({
    to,
    subject,
    from = '',
    html = '',
    attachments = [],
  }) {
    const params = {
      to,
      subject,
      from,
      html,
      attachments,
    };

    switch (this.camapignProvider) {
      case EMAIL_PROVIDERS.SEND_GRID:
        return sendGridService.sendEmail(params);

      default:
        return sendGridService.sendEmail(params);
    }
  }

  async sendTransactionalEmail({
    to,
    subject,
    from = FROM_DEFAULT,
    html = '',
    attachments = [],
  }) {
    const params = {
      to,
      subject,
      from,
      html,
      attachments,
    };

    switch (this.transactionalProvider) {
      case EMAIL_PROVIDERS.SEND_GRID:
        return sendGridService.sendEmail(params);

      default:
        return sendGridService.sendEmail(params);
    }
  }

  async sendTransactionalEmailWithAnEmailTemplate({
    emailTemplateName,
    emailTemplateParams,
    to,
    subject,
    from = FROM_DEFAULT,
    attachments = [],
  }) {
    const html = await emailTemplateHtmlService.getEmailTemplateHtml({
      emailTemplateName,
      params: emailTemplateParams,
    });

    await this.sendTransactionalEmail({
      to,
      subject,
      from,
      html,
      attachments,
    });
  }

  async sendTransactionalEmails(emailsInfo = []) {
    const emailsInfoToSend = emailsInfo.map((e) => ({
      to: e.to,
      subject: e.subject,
      from: e.from || FROM_DEFAULT,
      html: e.html || '',
      attachments: e.attachments || [],
    }));

    switch (this.transactionalProvider) {
      case EMAIL_PROVIDERS.SEND_GRID:
        return sendGridService.sendEmails(emailsInfoToSend);

      default:
        return sendGridService.sendEmails(emailsInfoToSend);
    }
  }
}

const singletonInstance = new EmailService();

module.exports = singletonInstance;
