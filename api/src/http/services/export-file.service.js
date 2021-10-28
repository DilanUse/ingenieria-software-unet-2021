const fs = require('fs');
const Excel = require('exceljs');
const util = require('util');
const { PATH_TEMPORAL_FILES } = require('../../components/shared.constant');
const emailService = require('./email.service');
const storageService = require('./storage.service');
const { convertFormatTime } = require('../../utils/datetime.util');
const ExportConstructor = require('../../components/export/export.constructor');
const exportRepository = require('../../components/export/export.repository');
const userRepository = require('../../components/user/user.repository');
const emailTemplateHtmlService = require('./emailTemplateHtmlService');

const fsWriteFilePromise = util.promisify(fs.writeFile);
const fsReadFilePromise = util.promisify(fs.readFile);
const fsUnlinkPromise = util.promisify(fs.unlink);
const EXPORT_NAME_TO_PATHS = 'exports';
const VALID_FORMATS_TO_EXPORT = {
  excel: 'xlsx',
  csv: 'csv',
  txt: 'txt',
};

async function createTextFileToExport({
  rows, nameFile, columns, separator = ',',
}) {
  let dataText = '';

  const columnsLength = columns.length;

  columns.forEach((column, index) => {
    dataText += `${column.title}`;

    if (index < columnsLength - 1) {
      dataText += ` ${separator}`;
    }
  });

  rows.forEach((document) => {
    dataText += '\n';
    columns.forEach((column, index) => {
      const valueText = document[column.field];
      if (column.field === 'createdAt' || column.field === 'updatedAt') {
        dataText += convertFormatTime(valueText);
      } else {
        dataText += `${valueText}`;
      }

      if (index < columnsLength - 1) {
        dataText += ` ${separator}`;
      }
    });
  });

  await fsWriteFilePromise(`${PATH_TEMPORAL_FILES}/${nameFile}`, dataText);
}

async function createExcelFileToExport({ rows, nameFile, columns }) {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('sheet');
  worksheet.columns = columns.map((column) => ({
    header: column.title,
    key: column.field,
    width: 10,
  }));

  rows.forEach((document) => {
    const valuesInsert = [];
    columns.forEach((column) => {
      valuesInsert.push(document[column.field]);
    });
    worksheet.addRow(valuesInsert);
  });

  try {
    await workbook.xlsx.writeFile(`${PATH_TEMPORAL_FILES}/${nameFile}`);
  } catch (e) {
    console.log(e);
  }
}

async function sendExportFileToEmail({
  user, nameFile, format, fileUrl, localFilePatch,
}) {
  const attachment = await fsReadFilePromise(localFilePatch, {
    encoding: 'base64',
  });

  const html = await emailTemplateHtmlService.getEmailTemplateHtml({
    emailTemplateName: emailTemplateHtmlService.EMAIL_TEMPLATES_NAMES.EXPORT,
    params: {
      userName: user.name,
      fileUrl,
    },
  });

  await emailService.sendTransactionalEmail({
    to: user.email,
    subject: 'Export File',
    html,
    attachments: [{
      content: attachment,
      filename: `${nameFile}`,
      type: `application/${format}`,
      disposition: 'attachment',
    }],
  });
}

async function createAndSendFileExport({
  rows, userNameFile, columns, format, user, userRole,
  separator = ',', sendEmail = false,
}) {
  // eslint-disable-next-line no-underscore-dangle
  const nameFile = `${userNameFile}-${user._id}-${new Date().getTime()}.${format}`;
  const localFilePatch = `${PATH_TEMPORAL_FILES}/${nameFile}`;

  if (format === VALID_FORMATS_TO_EXPORT.txt || format === VALID_FORMATS_TO_EXPORT.csv) {
    await createTextFileToExport({
      rows, nameFile, columns, separator,
    });
  } else {
    await createExcelFileToExport({ rows, nameFile, columns });
  }

  const s3Resp = await storageService.uploadTempFileToS3({
    basePath: storageService.getBasePathToStorage({
      role: userRole,
      user,
      additionalPath: EXPORT_NAME_TO_PATHS,
    }),
    fileName: nameFile,
    deleteFile: false,
  });

  if (sendEmail) {
    await sendExportFileToEmail({
      user,
      nameFile,
      format,
      fileUrl: s3Resp.Location,
      localFilePatch,
    });
  }

  await fsUnlinkPromise(localFilePatch);

  return s3Resp;
}

async function makeExportOperation({
  rows, userNameFile, columns, format, userId, userRole, tenantId,
  separator = ',', sendEmail = false, entity,
}) {
  const user = await userRepository.getOneById(userId);

  const s3Resp = await createAndSendFileExport({
    rows,
    userNameFile,
    columns,
    format,
    user,
    userRole,
    separator,
    sendEmail,
  });

  await exportRepository.createOne(
    new ExportConstructor({
      path: s3Resp.Key,
      url: s3Resp.Location,
      tenant: tenantId,
      creator: userId,
    }),
  );

  return s3Resp.Location;
}

module.exports = {
  makeExportOperation,
  VALID_FORMATS_TO_EXPORT,
};
