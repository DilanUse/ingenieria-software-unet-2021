/*= ========================================================================================
  File Name: actions.js
  Description: Vuex Store - actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== */
const actions = {

  // /////////////////////////////////////////////
  // COMPONENTS
  // /////////////////////////////////////////////

  // Vertical NavMenu
  updateVerticalNavMenuWidth({ commit }, width) {
    commit('UPDATE_VERTICAL_NAV_MENU_WIDTH', width);
  },

  // /////////////////////////////////////////////
  // UI
  // /////////////////////////////////////////////

  toggleContentOverlay({ commit }) {
    commit('TOGGLE_CONTENT_OVERLAY');
  },
  updateTheme({ commit }, val) {
    commit('UPDATE_THEME', val);
  },

  // /////////////////////////////////////////////
  // User/Account
  // /////////////////////////////////////////////

  updateUserInfo({ commit }, payload) {
    commit('UPDATE_USER_INFO', payload);
  },
  updateUserRole({ dispatch }, payload) {
    // Change client side
    payload.aclChangeRole(payload.userRole);

    // Make API call to server for changing role

    // Change userInfo in localStorage and store
    dispatch('updateUserInfo', { userRole: payload.userRole });
  },
  updatePageTitle({ commit }, title) {
    commit('UPDATE_PAGE_TITLE', title);
  },
  updateBreadcrumb({ state, commit }, { to, from }) {
    const toItem = {
      title: to.meta.pageTitle,
      fullPath: to.fullPath,
    };

    if (from.name === 'login') {
      commit('ADD_BREADCRUMB_ITEM', toItem);
    } else {
      const toIndex = state.breadcrumb.findIndex((item) => item.fullPath === toItem.fullPath);

      if (toIndex !== -1 && state.isReturningFromBreadcrumb) {
        commit('SET_BREADCRUMB', state.breadcrumb.slice(0, toIndex + 1));
      } else if (state.breadcrumb.length >= 4) {
        commit('SET_BREADCRUMB', [
          ...state.breadcrumb.slice(1, state.breadcrumb.length + 1),
          toItem,
        ]);
      } else {
        commit('ADD_BREADCRUMB_ITEM', toItem);
      }
    }

    commit('SET_IS_RETURNING_FROM_BREADCRUMB', false);
  },
  resetBreadcrumb({ commit }) {
    commit('SET_BREADCRUMB', []);
  },
};

export default actions;
