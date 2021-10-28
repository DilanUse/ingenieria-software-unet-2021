import {
  STORAGE_AUTH_USER_KEY,
  STORAGE_AUTH_LOGGED_IN_KEY,
  STORAGE_AUTH_REFRESH_TOKEN_KEY,
} from './auth/auth.state';
import createLogger from '../plugins/logger.plugin';
import configApi from '../api/config';
import grapePerksAppService from '../api';

const localStoragePlugin = (store) => {
  store.subscribe((mutation, { auth }) => {
    switch (mutation.type) {
      case 'auth/SET_AUTH_TOKEN':
        configApi.token = auth.token;
        grapePerksAppService.defaults.headers.common.Authorization = `Bearer ${configApi.token}`;
        break;
      case 'auth/SET_AUTH_REFRESH_TOKEN':
        configApi.refreshToken = auth.refreshToken;
        window.localStorage.setItem(STORAGE_AUTH_REFRESH_TOKEN_KEY,
          JSON.stringify(auth.refreshToken));
        break;
      case 'auth/SET_AUTH_USER':
      case 'auth/PARTIAL_UPDATE_AUTH_USER':
      case 'auth/PARTIAL_UPDATE_AUTH_USER_TENANT':
      case 'auth/UPDATE_AUTH_USER_TENANT_ACCOUNT_SETTINGS_REVIEWS':
      case 'auth/UPDATE_CAMPAIGN_DRAFT_AUTH_USER':
      case 'auth/UPDATE_AUTH_USER_MARKERS':
      case 'auth/UPDATE_AUTH_USER_FLAGS':
        window.localStorage.setItem(STORAGE_AUTH_USER_KEY,
          JSON.stringify(auth.user));
        break;
      case 'auth/SET_AUTH_USER_IS_LOGGED_IN':
        window.localStorage.setItem(STORAGE_AUTH_LOGGED_IN_KEY,
          JSON.stringify(auth.isUserLoggedIn));
        break;
      case 'auth/DELETE_AUTH':
        window.localStorage.removeItem(STORAGE_AUTH_USER_KEY);
        window.localStorage.removeItem(STORAGE_AUTH_LOGGED_IN_KEY);
        configApi.token = null;
        configApi.userId = null;
        grapePerksAppService.defaults.headers.common.Authorization = '';
        break;
      default:
    }
  });
};

export default process.env.NODE_ENV !== 'production'
  ? [createLogger(), localStoragePlugin]
  : [localStoragePlugin];
