const AWS = require('aws-sdk');

const bucketName = 'storagedashboardgrapeperks-dev';
const bucketRegion = 'ap-southeast-2';

AWS.config.region = bucketRegion;
AWS.config.getCredentials((err) => {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log('Access key:', AWS.config.credentials.accessKeyId);
  }
});

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: bucketName },
});

const SNS = new AWS.SNS({
  apiVersion: '2010-03-31',
  params: { Bucket: bucketName },
});

const uploadFileS3 = (file, path) => s3.upload({
  Bucket: bucketName,
  Key: path,
  Body: file,
}).promise();

const deleteFileS3 = (path) => s3.deleteObject({
  Bucket: bucketName,
  Key: path,
}).promise();

const sendMessageSNS = ({ to, message }) => {
  const params = {
    Message: message,
    PhoneNumber: to,
  };

  return SNS.publish(params).promise();
};

module.exports = {
  uploadFileS3,
  deleteFileS3,
  sendMessageSNS,
};
