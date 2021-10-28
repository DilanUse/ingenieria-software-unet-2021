const statusMessages = {
  200: 'Done',
  201: 'Created',
  400: 'Invalid format',
  500: 'Internal error',
};

exports.success = (req, res, data = null, status, descriptiveMessage) => {
  const statusCode = status;

  if (!status) {
    // eslint-disable-next-line no-param-reassign
    status = 200;
  }

  const statusMessage = statusMessages[status];

  res.status(statusCode).send({
    statusCode: status,
    statusMessage,
    error: '',
    data,
    message: descriptiveMessage,
  });
};

exports.error = (req, res, message, status, details) => {
  console.error(`[response error] ${details}`);

  res.status(status || 500).send({
    error: message,
    data: '',
  });
};
