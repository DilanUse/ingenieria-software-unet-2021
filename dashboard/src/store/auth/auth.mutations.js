export default {
  SET_AUTH_TOKEN(state, token) {
    state.token = token;
  },

  SET_AUTH_REFRESH_TOKEN(state, token) {
    state.refreshToken = token;
  },

  SET_AUTH_IS_REFRESHING_TOKEN(state, value) {
    state.isRefreshingToken = value;
  },

  SET_AUTH_REFRESHING_TOKEN_CALL(state, call) {
    state.refreshingTokenCall = call;
  },

  SET_AUTH_USER_IS_LOGGED_IN(state, value) {
    state.isUserLoggedIn = value;
  },

  SET_AUTH_USER(state, user) {
    state.user = user;
  },

  DELETE_AUTH(state) {
    state.token = null;
    state.refreshToken = null;
    state.user = null;
    state.isUserLoggedIn = false;
  },

  PARTIAL_UPDATE_AUTH_USER(state, user) {
    state.user = {
      ...state.user,
      ...user,
    };
  },

  PARTIAL_UPDATE_AUTH_USER_TENANT(state, payload) {
    if (state.user
      && state.user.tenant
      && typeof state.user.tenant === 'object') {
      state.user.tenant = {
        ...state.user.tenant,
        ...payload,
      };

      state.user = {
        ...state.user,
      };
    }
  },

  UPDATE_AUTH_USER_TENANT_ACCOUNT_SETTINGS_REVIEWS(state, payload) {
    if (state.user
      && state.user.tenant
      && typeof state.user.tenant === 'object'
      && state.user.tenant.accountSettings
      && state.user.tenant.accountSettings.review
      && typeof state.user.tenant.accountSettings.review === 'object') {
      state.user.tenant.accountSettings.review = {
        ...state.user.tenant.accountSettings.review,
        ...payload,
      };

      state.user = {
        ...state.user,
      };
    }
  },

  UPDATE_AUTH_USER_MARKERS(state, markers) {
    if (state.user
      && state.user.markers) {
      state.user.markers = markers;
      state.user = {
        ...state.user,
      };
    }
  },

  UPDATE_AUTH_USER_FLAGS(state, flags) {
    if (state.user && state.user.flags
      && typeof flags === 'object' && Object.keys(flags).length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(flags)) {
        if (state.user.flags[key] !== undefined) {
          state.user.flags[key] = value;
        }
      }

      state.user = {
        ...state.user,
      };
    }
  },

  DELETE_CAMPAIGN_DRAFT(state, type) {
    state.user.campaignDraft[type] = null;
  },

  UPDATE_CAMPAIGN_DRAFT_AUTH_USER(state, { campaignType, payload }) {
    state.user.campaignsDrafts[campaignType] = payload;
    state.user = {
      ...state.user,
    };
  },

  SET_AUTH_SOCKET(state, socket) {
    state.socket = socket;
  },
};
