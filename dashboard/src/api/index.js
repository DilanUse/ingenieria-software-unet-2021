import configApi from './config';

const axios = require('axios').default;

const apiService = axios.create({
  baseURL: configApi.fakeDb ? '' : configApi.url,
  timeout: configApi.timeout,
  withCredentials: true,
});

const authRefreshUrl = `${configApi.baseRoutesUrls.auth}/refresh-tokens`;

if (configApi.token) {
  apiService.defaults.headers.common.Authorization = `Bearer ${configApi.token}`;
}

apiService.createResponseInterceptor = (vm, store) => {
  apiService.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response ? error.response.status : null;
      vm.$vs.loading.close();

      if (status === 401 && !error.config.url.startsWith(configApi.baseRoutesUrls.auth)) {
        await store.dispatch('auth/refreshToken', {}, { root: true });
        // eslint-disable-next-line no-param-reassign
        error.config.headers.Authorization = `Bearer ${store.state.auth.token}`;
        return axios.request(error.config);
      }

      if (status === 401 && error.config.url === authRefreshUrl) {
        await store.dispatch('auth/logout', {}, { root: true });
        await vm.$router.push({ name: 'login' });

        vm.$vs.notify({
          title: vm.$t('$Errors.$Titles.SessionExpired'),
          text: vm.$t('$Errors.$Messages.SessionExpired'),
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'warning',
        });
      } else if (error.response.data && error.response.data.error && error.response.data.message) {
        vm.$vs.notify({
          title: error.response.data.error,
          text: error.response.data.message,
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'warning',
        });
      }
      return Promise.reject(error);
    },
  );
};

export default apiService;
