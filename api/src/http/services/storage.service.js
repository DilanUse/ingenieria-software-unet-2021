const fs = require('fs');
const { uploadFileS3, deleteFileS3 } = require('./aws.service.js');
const { PATH_TEMPORAL_FILES } = require('../../components/shared.constant');
const {
  MERCHANT_OWNER,
  MERCHANT_USER,
  MERCHANT_ADMIN,
} = require('../../components/shared.constant');

async function uploadTempFileToS3({
  basePath,
  fileName,
  deleteFile = false,
}) {
  const localPath = `${PATH_TEMPORAL_FILES}/${fileName}`;
  const remotePath = `${basePath}/${fileName}`;

  return new Promise((resolve, reject) => {
    const body = fs.createReadStream(localPath);

    uploadFileS3(body, remotePath).then((s3Resp) => {
      if (deleteFile) {
        fs.unlink(localPath, (err) => {
          if (err) reject(err);
          resolve(s3Resp);
        });
      } else {
        resolve(s3Resp);
      }
    }).catch((err) => {
      reject(err);
    });
  });
}

function getBasePathToStorage({
  role,
  user,
  additionalPath = '',
}) {
  const extraPath = additionalPath ? `/${additionalPath}` : '';

  switch (role) {
    case MERCHANT_OWNER:
      // eslint-disable-next-line no-underscore-dangle
      return `${user._id}${extraPath}`;

    case MERCHANT_USER:
    case MERCHANT_ADMIN:
      // eslint-disable-next-line no-underscore-dangle
      return `${user.owner._id}/${user._id}${extraPath}`;

    default:
      return '';
  }
}

async function deleteFileToS3(path) {
  return deleteFileS3(path);
}

module.exports = {
  uploadTempFileToS3,
  getBasePathToStorage,
  deleteFileToS3,
};
