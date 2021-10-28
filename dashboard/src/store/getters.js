// added so later we can keep breakpoint in sync automatically using this config file
// import tailwindConfig from "../../tailwind.config.js"

import navMenuItems from '@/layouts/components/vertical-nav-menu/navMenuItems';
import i18n from '@/i18n/i18n';

export default {
  // COMPONENT
  // vx-autosuggest
  // starredPages: state => state.navbarSearchAndPinList.data.filter((page) => page.highlightAction),
  windowBreakPoint: (state) => {
    // This should be same as tailwind. So, it stays in sync with tailwind utility classes
    if (state.windowWidth >= 1200) return 'xl';
    if (state.windowWidth >= 992) return 'lg';
    if (state.windowWidth >= 768) return 'md';
    if (state.windowWidth >= 576) return 'sm';
    return 'xs';
  },

  navMenuItemsByPermissions: (state, getters) => (menuItems = navMenuItems) => {
    const clone = menuItems.slice();

    // eslint-disable-next-line no-restricted-syntax
    for (const [index, item] of menuItems.entries()) {
      if ((item.permissions
        && Array.isArray(item.permissions)
        && item.permissions.length > 0
        && !getters['auth/userHasPermissionsTo']({ permissions: item.permissions }))
        || (item.roles && Array.isArray(item.roles)
          && !item.roles.includes(getters['auth/roleName']))) {
        const i = clone.findIndex((ix) => ix.slug === item.slug);
        clone.splice(i, 1);
      } else if (item.header && item.items.length) {
        item.items = getters.navMenuItemsByPermissions(item.items);
        const i = clone.findIndex((ix) => ix.header === item.header);

        // eslint-disable-next-line no-restricted-syntax
        for (const [subIndex, subItem] of item.items.entries()) {
          clone.splice(i + 1 + subIndex, 0, subItem);
        }
      } else if (item.submenu && item.submenu.length) {
        item.submenu = getters.navMenuItemsByPermissions(item.submenu);
      }
    }

    return clone;
  },

  navMenuItemsByPermissionsLineal: (state, getters) => {
    const navMenuItemsFiltered = getters.navMenuItemsByPermissions();
    const menuItemsMapped = [];

    navMenuItemsFiltered.forEach((menuItem, index) => {
      if (!menuItem.header) {
        if (menuItem.submenu) {
          const submenu = menuItem.submenu.map((submenuItem) => ({
            ...submenuItem,
            title: `${i18n.tc(menuItem.i18n, menuItem.i18nCount || 2)} - ${i18n.tc(submenuItem.i18n, submenuItem.i18nCount || 2)}`,
          }));

          menuItemsMapped.push(...submenu);
        } else {
          menuItemsMapped.push({
            ...menuItem,
            title: i18n.tc(menuItem.i18n, menuItem.i18nCount || 2),
          });
        }
      }
    });

    return menuItemsMapped;
  },
};
