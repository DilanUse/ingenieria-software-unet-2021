const axios = require('axios');
const { config } = require('../../config');

async function shortUrl(urlConvert) {
  let urlShort;
  if (!config.dev) {
    try {
      const { data } = await axios.get(`https://is.gd/create.php?format=simple&url=${urlConvert}`);
      urlShort = data;
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      const { data } = await axios.get(`https://cdpt.in/api/shorten?url=${urlConvert}`);
      urlShort = data;
    } catch (err) {
      console.log(err);
    }
  }

  return urlShort;
}

module.exports = {
  shortUrl,
};
