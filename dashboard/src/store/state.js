import themeConfig from '@/../themeConfig.js';
import colors from '@/../themeConfig.js';

// /////////////////////////////////////////////
// Helper
// /////////////////////////////////////////////

// *From Auth - Data will be received from auth provider
const userDefaults = {
  uid: 0, // From Auth
  displayName: 'John Doe', // From Auth
  about: 'Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.',
  photoURL: require('@/assets/img/vuexy/portrait/small/avatar-s-11.jpg'), // From Auth
  status: 'online',
  userRole: 'admin',
};

const userInfoLocalStorage = JSON.parse(localStorage.getItem('userInfo')) || {};

// Set default values for active-user
// More data can be added by auth provider or other plugins/packages
const getUserInfo = () => {
  const userInfo = {};

  // Update property in user
  Object.keys(userDefaults).forEach((key) => {
    // If property is defined in localStorage => Use that
    userInfo[key] = userInfoLocalStorage[key] ? userInfoLocalStorage[key] : userDefaults[key];
  });

  // Include properties from localStorage
  Object.keys(userInfoLocalStorage).forEach((key) => {
    if (userInfo[key] == undefined && userInfoLocalStorage[key] != null) userInfo[key] = userInfoLocalStorage[key];
  });

  return userInfo;
};

// /////////////////////////////////////////////
// State
// /////////////////////////////////////////////

const state = {
  AppActiveUser: getUserInfo(),
  bodyOverlay: false,
  isVerticalNavMenuActive: true,
  mainLayoutType: themeConfig.mainLayoutType || 'vertical',
  reduceButton: themeConfig.sidebarCollapsed,
  verticalNavMenuWidth: 'default',
  verticalNavMenuItemsMin: false,
  scrollY: 0,
  pageTitle: '',
  theme: themeConfig.theme || 'light',
  themePrimaryColor: colors.primary,

  // Can be used to get current window with
  // Note: Above breakpoint state is for internal use of sidebar & navbar component
  windowWidth: null,
  // auth: JSON.parse(window.localStorage.getItem(STORAGE_AUTH_KEY) || '{}'),

  breadcrumb: [],
  openChatKey: 0,
  isReturningFromBreadcrumb: false,
};

export default state;
