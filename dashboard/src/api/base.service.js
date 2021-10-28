import grapePerksAppService from '@/api/index';
import enums from '@/enums';

export default class BaseService {
  constructor({ baseUrl }) {
    this.baseUrl = baseUrl;
  }


  getCount = (params = {}) => grapePerksAppService.get(
    `${this.baseUrl}/count`, { params },
  ).then((resp) => resp.data);

  getAll = ({
    sortBy = [],
    filters = {},
    filtersMatch = enums.AppFilter.FilterMathType.ALL,
    skip = 0,
    limit = 0,
    ...params
  }) => grapePerksAppService.get(this.baseUrl, {
    params: {
      ...params,
      sortBy,
      filters,
      filtersMatch,
      skip,
      limit,
    },
  }).then((resp) => resp.data);

  getOne = ({ id, params = {} }) => grapePerksAppService.get(
    `${this.baseUrl}/${id}`, { params },
  ).then((resp) => resp.data);


  create = (payload) => grapePerksAppService.post(
    this.baseUrl, payload,
  ).then((resp) => resp.data);


  importFromFile = (payloads) => grapePerksAppService.post(
    `${this.baseUrl}/import-from-file`, payloads,
  ).then((resp) => resp.data);

  exportFile = (dataRequest) => grapePerksAppService.post(
    `${this.baseUrl}/export-file`, dataRequest,
  ).then((resp) => resp.data);


  edit = ({ id, payload }) => grapePerksAppService.put(
    `${this.baseUrl}/${id}`, payload,
  ).then((resp) => resp.data);


  delete = (id) => grapePerksAppService.delete(
    `${this.baseUrl}/${id}`,
  ).then((resp) => resp.data);


  deleteMany = (dataRequest) => grapePerksAppService.patch(
    this.baseUrl, dataRequest,
  ).then((resp) => resp.data);
}
