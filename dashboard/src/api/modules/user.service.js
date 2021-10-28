import BaseService from '@/api/base.service';
import configApi from '@/api/config';
import grapePerksAppService from '@/api';

class UserService extends BaseService {
  constructor() {
    super({ baseUrl: configApi.baseRoutesUrls.users });
  }


  getFlags = () => grapePerksAppService.get(
    `${this.baseUrl}/flags`,
  ).then((resp) => resp.data);


  getStatusByEmail = (email) => grapePerksAppService.get(
    `${this.baseUrl}/status-by-email/${email}`,
  ).then((resp) => resp.data);


  getAllMerchants = (params) => grapePerksAppService.get(
    `${this.baseUrl}/merchants`, { params },
  ).then((resp) => resp.data);

  getAllToShare = (params) => grapePerksAppService.get(
    `${this.baseUrl}/to-shared/`, { params },
  ).then((resp) => resp.data);

  getDraftCampaign = ({
    campaignType,
  }) => grapePerksAppService.get(
    `${this.baseUrl}/get-campaign-draft/${campaignType}`,
  ).then((resp) => resp.data);



  getUrlQrCodeTwoFactorAuthentication = () => grapePerksAppService.get(`${this.baseUrl}/qr-for-two-factor-authentication`)
    .then((resp) => resp.data);


  invite = ({ users, params = {} }) => grapePerksAppService.post(
    `${this.baseUrl}/invite`, users, { params },
  ).then((resp) => resp.data);

  validateTwoFactorAuthentication = (code) => grapePerksAppService.post(`${this.baseUrl}/validate-two-factor-authentication/${code}`)
    .then((resp) => resp.data);


  disableTwoFactorAuthentication = (code) => grapePerksAppService.post(`${this.baseUrl}/disable-two-factor-authentication/${code}`)
    .then((resp) => resp.data);


  updateFlags = (payload) => grapePerksAppService.put(
    `${this.baseUrl}/flags`, payload,
  ).then((resp) => resp.data);

  updateMarkers = (payload) => grapePerksAppService.put(
    `${this.baseUrl}/markers`, payload,
  ).then((resp) => resp.data);


  updateAvatar = (payload) => grapePerksAppService.put(
    `${this.baseUrl}/avatar`, payload,
  ).then((resp) => resp.data);


  updateProfile = (payload) => grapePerksAppService.put(
    `${this.baseUrl}/profile`, payload,
  ).then((resp) => resp.data);


  connectToGoogle = (code) => grapePerksAppService.put(
    `${this.baseUrl}/connect-google-account`, { code },
  ).then((resp) => resp.data);

  disconnectToGoogle = () => grapePerksAppService.put(
    `${this.baseUrl}/disconnect-google-account`, {},
  ).then((resp) => resp.data);


  updatePassword = (payload) => grapePerksAppService.put(
    `${this.baseUrl}/password`, payload,
  ).then((resp) => resp.data);


  saveDraftCampaign = ({
    payload,
    campaignType,
    campaignId = null,
    hardDraft = false,
  }) => grapePerksAppService.put(
    `${this.baseUrl}/save-draft-campaign/${campaignType}${campaignId ? `/${campaignId}` : ''}`,
    payload, { params: { hardDraft } },
  ).then((resp) => resp.data);

  discardDraftCampaign = ({ campaignType, campaignId }) => grapePerksAppService.put(
    `${this.baseUrl}/discard-draft-campaign/${campaignType}${campaignId ? `/${campaignId}` : ''}`,
    {},
  ).then((resp) => resp.data);


  removeAvatar = () => grapePerksAppService.delete(
    `${this.baseUrl}/avatar`,
  ).then((resp) => resp.data);
}

const singletonInstance = new UserService();

export default singletonInstance;
