import grapePerksAppService from '@/api';
import BaseService from '@/api/base.service';
import configApi from '@/api/config';


class CallerIdService extends BaseService {
  constructor() {
    super({ baseUrl: configApi.baseRoutesUrls.callerIds });
  }


  initVerifyPhone = ({ callerId }) => grapePerksAppService.get(
    `${this.baseUrl}/verify-phone/${callerId}`,
  ).then(
    (resp) => resp.data.statusCode === 200 && !resp.data.error,
  );


  checkVerifyPhone = ({ callerId, code }) => grapePerksAppService.get(`${this.baseUrl}/check-verify-phone/${callerId}/${code}`)
    .then((resp) => resp.data);
}

const singletonInstance = new CallerIdService();


export default singletonInstance;
