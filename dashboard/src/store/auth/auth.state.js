export const STORAGE_AUTH_USER_KEY = 'auth-user';
export const STORAGE_AUTH_LOGGED_IN_KEY = 'auth-user-logged-in';
export const STORAGE_AUTH_REFRESH_TOKEN_KEY = 'auth-refresh-token';

export const state = {
  token: null,
  refreshToken: JSON.parse(
    window.localStorage.getItem(STORAGE_AUTH_REFRESH_TOKEN_KEY) || null,
  ),
  isRefreshingToken: false,
  refreshingTokenCall: null,
  isUserLoggedIn: JSON.parse(window.localStorage.getItem(STORAGE_AUTH_LOGGED_IN_KEY) || false),
  user: JSON.parse(window.localStorage.getItem(STORAGE_AUTH_USER_KEY) || null),
  socket: null,
};
