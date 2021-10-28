import grapePerksAppService from '@/api/index';
import BaseService from '@/api/base.service';

export default class ResourceService extends BaseService {
  constructor({ baseUrl }) {
    super({ baseUrl });
  }


  getAllFromTrash = (params) => grapePerksAppService.get(
    `${this.baseUrl}/trash`, { params },
  ).then((resp) => resp.data);


  restore = (id) => grapePerksAppService.put(
    `${this.baseUrl}/restore/${id}`, {},
  ).then((resp) => resp.data);


  configPrivacy = ({ id, payload }) => grapePerksAppService.put(
    `${this.baseUrl}/config-privacy/${id}`, payload,
  ).then((resp) => resp.data);


  restoreMany = (dataRequest) => grapePerksAppService.patch(
    `${this.baseUrl}/restore`, dataRequest,
  ).then((resp) => resp.data);
}
