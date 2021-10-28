/*= ========================================================================================
  File Name: mutations.js
  Description: Vuex Store - mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== */

export const STORAGE_AUTH_KEY = 'auth-info';

export const mutations = {
  // /////////////////////////////////////////////
  // COMPONENTS
  // /////////////////////////////////////////////

  // Vertical NavMenu

  TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE(state, value) {
    state.isVerticalNavMenuActive = value;
  },
  TOGGLE_REDUCE_BUTTON(state, val) {
    state.reduceButton = val;
  },
  UPDATE_MAIN_LAYOUT_TYPE(state, val) {
    state.mainLayoutType = val;
  },
  UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN(state, val) {
    state.verticalNavMenuItemsMin = val;
  },
  UPDATE_VERTICAL_NAV_MENU_WIDTH(state, width) {
    state.verticalNavMenuWidth = width;
  },

  // ////////////////////////////////////////////
  // UI
  // ////////////////////////////////////////////

  TOGGLE_CONTENT_OVERLAY(state, val) { state.bodyOverlay = val; },
  UPDATE_PRIMARY_COLOR(state, val) { state.themePrimaryColor = val; },
  UPDATE_THEME(state, val) { state.theme = val; },
  UPDATE_WINDOW_WIDTH(state, width) { state.windowWidth = width; },
  UPDATE_WINDOW_SCROLL_Y(state, val) { state.scrollY = val; },


  // /////////////////////////////////////////////
  // User/Account
  // /////////////////////////////////////////////

  // Updates user info in state and localstorage
  UPDATE_USER_INFO(state, payload) {
    // Get Data localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || state.AppActiveUser;

    // eslint-disable-next-line no-restricted-syntax
    for (const property of Object.keys(payload)) {
      if (payload[property] != null) {
        // If some of user property is null - user default property defined in state.AppActiveUser
        state.AppActiveUser[property] = payload[property];

        // Update key in localStorage
        userInfo[property] = payload[property];
      }
    }
    // Store data in localStorage
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  },
  UPDATE_PAGE_TITLE(state, title) {
    state.pageTitle = title;
  },
  ADD_BREADCRUMB_ITEM(state, item) {
    state.breadcrumb.push(item);
  },
  SET_BREADCRUMB(state, items) {
    state.breadcrumb = items;
  },
  SET_IS_RETURNING_FROM_BREADCRUMB(state, val) {
    state.isReturningFromBreadcrumb = val;
  },
  INCREASE_OPEN_CHAT_KEY(state) {
    state.openChatKey += 1;
  },
};
