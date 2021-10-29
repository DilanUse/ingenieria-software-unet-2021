export default [
  {
    url: '/',
    name: 'Home',
    icon: 'HomeIcon',
    i18n: '$General.Home',
    slug: 'home',
  },
  {
    url: '/users',
    name: 'Users',
    icon: 'UsersIcon',
    i18n: '$Entities.User',
    slug: 'users',
  },
  {
    header: 'Services',
    icon: 'MessageCircleIcon',
    i18n: '$General.Service',
    i18nCount: 2,
    slug: 'services',
    items: [
      {
        name: 'SMS Campaign',
        icon: 'MessageSquareIcon',
        i18n: '$General.SMS',
        slug: 'sms-campaigns',
        submenu: [
          {
            url: '/sms-templates',
            name: 'SMSTemplates',
            icon: 'LayoutIcon',
            i18n: '$General.Template',
            i18nCount: 2,
            slug: 'sms-templates',
          },
        ],
      },
    ],
  },
  {
    header: 'Contacts',
    icon: 'BookIcon',
    i18n: '$Entities.Contact',
    slug: 'contacts',
    items: [
      {
        url: '/contacts',
        name: 'Contact List',
        icon: 'ListIcon',
        i18n: '$NavMenu.ContactList',
        slug: 'contacts',
      },
    ],
  },
  {
    header: 'Senders IDs',
    icon: 'BookIcon',
    i18n: '$General.SenderID',
    items: [
      {
        url: '/caller-ids',
        name: 'Caller IDs',
        slug: 'caller-ids',
        icon: 'PhoneIcon',
        i18n: '$Entities.CallerID',
      },
    ],
  },
];
