import BaseService from '@/api/base.service';
import configApi from '@/api/config';
import grapePerksAppService from '@/api';

class TenantService extends BaseService {
  constructor() {
    super({ baseUrl: configApi.baseRoutesUrls.tenants });
  }


  getTenantFromUser = () => grapePerksAppService.get(
    `${this.baseUrl}/tenant-from-user`,
  ).then((resp) => resp.data);


  getFlags = () => grapePerksAppService.get(
    `${this.baseUrl}/flags`,
  ).then((resp) => resp.data);


  getBalanceInformation = () => grapePerksAppService.get(
    `${this.baseUrl}/balance-information`,
  ).then((resp) => resp.data);


  getBillingInformation = () => grapePerksAppService.get(
    `${this.baseUrl}/billing-information`,
  ).then((resp) => resp.data);


  getBillingHistory = (params) => grapePerksAppService.get(
    `${this.baseUrl}/billing-history`, { params },
  ).then((resp) => resp.data);


  getPaymentMethods = () => grapePerksAppService.get(
    `${this.baseUrl}/payment-methods`,
  ).then((resp) => resp.data);


  getAccountSettingsDetails = () => grapePerksAppService.get(
    `${this.baseUrl}/account-settings/details`,
  ).then((resp) => resp.data);


  getAccountSettingsReviews = () => grapePerksAppService.get(
    `${this.baseUrl}/account-settings/reviews`,
  ).then((resp) => resp.data);


  getAccountSettingsBranding = () => grapePerksAppService.get(
    `${this.baseUrl}/account-settings/branding`,
  ).then((resp) => resp.data);


  getConfigAutoTopUpAccount = () => grapePerksAppService.get(
    `${this.baseUrl}/auto-top-up-account/config`,
  ).then((resp) => resp.data);


  checkoutTopUpAccount = ({ stripePriceId, mode }) => grapePerksAppService.get(
    `${this.baseUrl}/top-up-account/checkout-session/${stripePriceId}/${mode}`,
  ).then((resp) => resp.data);


  creditCardSetup = () => grapePerksAppService.get(
    `${this.baseUrl}/credit-card-setup`,
  ).then((resp) => resp.data);


  paymentTopUpAccount = (payload) => grapePerksAppService.post(
    `${this.baseUrl}/top-up-account/payment-intent`, payload,
  ).then((resp) => resp.data);


  addCreditCard = (payload) => grapePerksAppService.post(
    `${this.baseUrl}/add-credit-card`, payload,
  ).then((resp) => resp.data);


  updateAccountSettingsDetails = (payload) => grapePerksAppService.put(
    `${this.baseUrl}/account-settings/details`, payload,
  ).then((resp) => resp.data);


  updateAccountSettingsReviews = (payload) => grapePerksAppService.put(
    `${this.baseUrl}/account-settings/reviews`, payload,
  ).then((resp) => resp.data);


  updateBrandingLogo = (url) => grapePerksAppService.put(
    `${this.baseUrl}/account-settings/branding/logo`, { logo: url },
  ).then((resp) => resp.data);


  updateBrandingColours = (payload) => grapePerksAppService.put(
    `${this.baseUrl}/account-settings/branding/colors`, payload,
  ).then((resp) => resp.data);



  updateAutoTopUpAccountConfig = (payload) => grapePerksAppService.put(
    `${this.baseUrl}/auto-top-up-account/config`, payload,
  ).then((resp) => resp.data);

  updateFlags = (payload) => grapePerksAppService.put(
    `${this.baseUrl}/flags`, payload,
  ).then((resp) => resp.data);


  updateDefaultPaymentMethod = (paymentMethodId) => grapePerksAppService.put(
    `${this.baseUrl}/default-payment-method/${paymentMethodId}`,
  ).then((resp) => resp.data);

  cancelMonthlyPackage = () => grapePerksAppService.put(
    `${this.baseUrl}/cancel-monthly-package/`,
  ).then((resp) => resp.data);


  removePaymentMethod = (paymentMethodId) => grapePerksAppService.delete(
    `${this.baseUrl}/payment-method/${paymentMethodId}`,
  ).then((resp) => resp.data);
}

const singletonInstance = new TenantService();

export default singletonInstance;
