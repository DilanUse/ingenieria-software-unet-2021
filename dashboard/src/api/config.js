import {
  STORAGE_AUTH_USER_KEY,
  STORAGE_AUTH_REFRESH_TOKEN_KEY,
} from '@/store/auth/auth.state';

const user = JSON.parse(window.localStorage.getItem(STORAGE_AUTH_USER_KEY) || null);

let url = 'http://localhost:3000';

if (process.env.NODE_ENV === 'production') {
  url = '';
}

const configApi = {
  url,
  timeout: 0,
  token: null,
  refreshToken: JSON.parse(
    window.localStorage.getItem(STORAGE_AUTH_REFRESH_TOKEN_KEY) || null,
  ),
  userId: user ? user.id : null,
  limitApiCalls: process.env.VUE_APP_LIMIT_API_CALLS
    ? process.env.VUE_APP_LIMIT_API_CALLS.toLowerCase() === 'true'
    : true,
  fakeDb: process.env.VUE_APP_FAKE_DB
    ? process.env.VUE_APP_FAKE_DB.toLowerCase() === 'true'
    : false,
  baseRoutesUrls: {
    auth: '/auth',
    users: '/users',
    tenants: '/tenants',
    contacts: '/contacts',
    smsTemplates: '/sms-templates',
    callerIds: '/caller-ids',
    campaigns: '/campaigns',
    smsCampaigns: '/sms-campaigns',
  },
};

export default configApi;
