module.exports = {
  parserOptions: {
    "ecmaVersion": 2018
  },
  extends: ["airbnb-base"],
  env: {
    "es6": true,
    "node": true,
    "mocha": true
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'linebreak-style': ["error", "windows"]
  }
};
