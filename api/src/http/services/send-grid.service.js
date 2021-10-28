const sgMail = require('@sendgrid/mail');
const { config } = require('../../config');

class SendGridService {
  constructor() {
    this.apiKey = config.apiKeySendGrid;
    this.sgMail = sgMail;
    this.sgMail.setApiKey(config.apiKeySendGrid);
  }

  async sendEmail({
    from,
    to,
    subject,
    html,
    attachments = [],
  }) {
    const params = {
      to,
      from,
      subject,
      html,
      attachments,
    };

    return this.sgMail.send(params);
  }

  async sendEmails(emailsInfo = []) {
    return this.sgMail.send(emailsInfo);
  }
}

const singletonInstance = new SendGridService();

module.exports = singletonInstance;
