const axios = require('axios').default;


class ShorterUrlService {
  constructor() {
    this.isGdBaseApiUrl = 'https://is.gd/create.php?format=simple&url=';
    this.cdptBaseApiUrl = 'https://cdpt.in/api/shorten?url=';
  }

  async getUrlShorter(url) {
    let shortedUrl = '';

    try {
      shortedUrl = await this.getUrlShorterFromIsGd(url);
    } catch (err) {
      shortedUrl = await this.getUrlShorterFromCdpt(url);
    }

    return shortedUrl;
  }


  async getUrlShorterFromIsGd(url) {
    const { data } = await axios.get(`${this.isGdBaseApiUrl}${url}`);
    return data;
  }


  async getUrlShorterFromCdpt(url) {
    const { data } = await axios.get(`${this.cdptBaseApiUrl}${url}`);
    return data;
  }
}

const singletonInstance = new ShorterUrlService();


export default singletonInstance;
