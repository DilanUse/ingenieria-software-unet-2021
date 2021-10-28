import Vue from 'vue';
import Vuesax from 'vuesax';
import VueMq from 'vue-mq';
import VueClipboard from 'vue-clipboard2';
import VueTour from 'vue-tour';
import VeeValidate from 'vee-validate';
import * as GmapVue from 'gmap-vue';
import { VueHammer } from 'vue2-hammer';
import VEmojiPicker from 'v-emoji-picker';
import AudioRecorder from 'vue-audio-recorder';
import vueCountryRegionSelect from 'vue-country-region-select';
import App from './App.vue';

// Vuesax Component Framework
import 'material-icons/iconfont/material-icons.css'; // Material Icons
import 'vuesax/dist/vuesax.css';

// Grape Perks Service
import grapePerksAppService from './api';

// Theme Configurations
import '../themeConfig';

// Globally Registered Components
import './globalComponents';

// Styles: SCSS
import './assets/scss/main.scss';

// Vue Router
import router from './router';

// Vuex Store
import store from './store/store';

// i18n
import i18n from './i18n/i18n';

// Vuexy Admin Filters
import './filters/filters';

import enumsPlugin from './plugins/enums.plugin';

// PrismJS
import 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import configApi from './api/config';

// vue-tour styles
require('vue-tour/dist/vue-tour.css');

// Feather font icon
require('./assets/css/iconfont.css');

const VueScrollTo = require('vue-scrollto');

// prototypes
Vue.prototype.$gpas = grapePerksAppService;

// Plugins
Vue.use(Vuesax);
Vue.use(VueClipboard);
Vue.use(VueTour);
Vue.use(VeeValidate, {
  fieldsBagName: 'validationFields',
});
Vue.use(VueHammer);
Vue.use(AudioRecorder);
Vue.use(vueCountryRegionSelect);
Vue.use(GmapVue, {
  load: {
    key: process.env.VUE_APP_GOOGLE_MAPS_PLATFORM_API_KEY || '',
    libraries: 'places',
  },
});
Vue.use(enumsPlugin);
Vue.use(VueScrollTo);
Vue.use(VEmojiPicker);

Vue.use(VueMq, {
  breakpoints: {
    mobile: 768,
    tablet: 992,
    laptop: 1200,
    desktop: Infinity,
  },
});

Vue.config.errorHandler = (err, vm, info) => {

};

Vue.config.productionTip = false;

const vm = new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');

grapePerksAppService.createResponseInterceptor(vm, store);

console.log('environment', process.env.NODE_ENV);
