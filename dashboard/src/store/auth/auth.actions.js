import { io } from 'socket.io-client';
import configApi from '@/api/config';
import authService from '@/api/modules/auth.service';
import userService from '@/api/modules/user.service';
import tenantService from '@/api/modules/tenant.service';

export default {
  async login({ commit, dispatch }, { email, password }) {
    const resp = await authService.signIn({ email, password });

    if (resp.data.twoFactorAuthenticationActivate) return resp;

    await dispatch('setTokens', {
      token: resp.data.token,
      refreshToken: resp.data.refreshToken,
    });

    commit('SET_AUTH_USER_IS_LOGGED_IN', true);
    commit('SET_AUTH_USER', resp.data.user);

    return resp;
  },

  async verifyToken({ commit }, { token, refreshToken }) {
    commit('SET_AUTH_TOKEN', token);
    const resp = await authService.verifyToken();
    commit('SET_AUTH_REFRESH_TOKEN', refreshToken);
    commit('SET_AUTH_USER_IS_LOGGED_IN', true);
    commit('SET_AUTH_USER', resp.data.user);
  },

  async signUp({ commit, dispatch }, user) {
    const resp = await authService.signUp(user);
    return resp;
  },

  async invitedSignUp({ commit, dispatch }, { securityToken, user }) {
    const resp = await authService.invitedSignUp({ securityToken, user });

    await dispatch('setTokens', {
      token: resp.data.token,
      refreshToken: resp.data.refreshToken,
    });

    commit('SET_AUTH_USER', resp.data.user);
  },

  // eslint-disable-next-line no-unused-vars
  async recoverPassword({ commit }, email) {
    await authService.recoverPassword(email);
  },

  // eslint-disable-next-line no-unused-vars
  async changePassword({ commit }, { securityToken, password }) {
    await authService.changePassword({ securityToken, password });
  },

  setTokens({ commit }, {
    token, refreshToken,
  }) {
    commit('SET_AUTH_TOKEN', token);
    commit('SET_AUTH_REFRESH_TOKEN', refreshToken);
  },

  async refreshToken({ state, commit }) {
    if (state.isRefreshingToken) {
      return state.refreshingTokenCall;
    }

    commit('SET_AUTH_IS_REFRESHING_TOKEN', true);
    const refreshingCall = authService.refreshTokens().then((resp) => {
      commit('SET_AUTH_TOKEN', resp.data.token);
      commit('SET_AUTH_REFRESH_TOKEN', resp.data.refreshToken);
      commit('SET_AUTH_IS_REFRESHING_TOKEN', false);
      commit('SET_AUTH_REFRESHING_TOKEN_CALL', null);
      return Promise.resolve(true);
    });

    commit('SET_AUTH_REFRESHING_TOKEN_CALL', refreshingCall);
    return refreshingCall;
  },

  async logout({ commit, state, dispatch }) {
    try {
      await authService.logout();
    } catch (e) {
      console.log(e);
    }

    if (state.socket) {
      state.socket.close();
      commit('SET_AUTH_SOCKET', null);
    }

    dispatch('resetBreadcrumb', [], { root: true });
    commit('DELETE_AUTH');
  },

  async fetchTenantOfUser({ commit }) {
    const resp = await tenantService.getTenantFromUser();

    commit('PARTIAL_UPDATE_AUTH_USER', { tenant: resp.data });
    return resp.data;
  },

  async fetchUserFlags({ commit }) {
    const resp = await userService.getFlags();
    const flags = {
      flags: {
        ...resp.data,
      },
    };

    commit('PARTIAL_UPDATE_AUTH_USER', flags);

    return resp.data;
  },

  connectAuthSocket({ commit, getters }, { vm }) {
    if (!getters.isUserLoggedIn) return;

    const socket = io(configApi.url, {
      query: {
        tenant: getters.tenantId,
        user: getters.userId,
      },
    });

    commit('SET_AUTH_SOCKET', socket);
  },
};
