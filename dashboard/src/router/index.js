import Vue from 'vue';
import Router from 'vue-router';
import store from '../store/store';
import routes from './routes';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes,
});

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg');
  if (appLoading) {
    appLoading.style.display = 'none';
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    if (!store.getters['auth/isUserLoggedIn']) {
      store.dispatch('resetBreadcrumb');
      next({ name: 'login' });
    } else if (to.matched.some((route) => route.meta && route.meta.permission)
      || to.matched.some((route) => route.meta && route.meta.roles)) {
      const { name: roleName, permissions } = store.getters['auth/role'];
      let validPermission = true;

      to.matched.forEach((route) => {
        if ((route.meta && route.meta.permission
          && !permissions.some((per) => per.permission === route.meta.permission && per.access))
          || (route.meta && route.meta.roles && !route.meta.roles.includes(roleName))) {
          validPermission = false;
        }
      });

      if (validPermission) {
        next();
      } else {
        next({ name: 'not-authorized' });
      }
    } else{
      next();
    }
  } else if (to.matched.some((route) => route.meta.requiresGuest)) {
    if (store.getters['auth/isUserLoggedIn']) {
      next({ name: 'home' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
