import enums from '@/enums';

const routes = [
  {
    // =============================================================================
    // MAIN LAYOUT ROUTES
    // =============================================================================
    path: '',
    component: () => import('../layouts/main/Main.vue'),
    name: 'main-layout',
    meta: {
      requiresAuth: true,
    },
    redirect: '/home',
    children: [
      // =============================================================================
      // Theme Routes
      // =============================================================================
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        meta: {
          pageTitle: '$General.Home',
        },
      },
      {
        path: '/analytics/campaigns',
        name: 'campaigns-analytics',
        component: () => import('../views/analytics/CampaignsAnalytics.vue'),
        meta: {
          pageTitle: '$PageTitle.CampaignsAnalytics',
        },
      },
      {
        path: '/analytics/contacts',
        name: 'contacts-analytics',
        component: () => import('../views/analytics/ContactsAnalytics.vue'),
        meta: {
          pageTitle: '$PageTitle.ContactsAnalytics',
        },
      },

      // =============================================================================
      // Modules Routes
      // =============================================================================
      {
        path: '/users',
        name: 'users',
        component: () => import('@/views/modules/user/UserList.vue'),
        props: { actionsMinWidth: 50, actionsMaxWidth: 150 },
        meta: {
          pageTitle: '$Entities.User',
          operation: enums.Operation.LIST,
        },
      },

      // SMS Campaigns Module
      {
        path: '/sms-campaigns/history',
        name: 'sms-campaigns-history',
        component: () => import('@/views/modules/campaigns/sms-campaign/SMSCampaignList.vue'),
        props: {
          statusFilter: {
            filterType: 'enum',
            type: 'none',
            filter: [enums.Campaign.Status.DRAFT, enums.Campaign.Status.PENDING],
          },
          listType: enums.Campaign.ListType.History,
        },
        meta: {
          pageTitle: '$SMSCampaignModule.SMSHistory',
          operation: enums.Operation.LIST,
        },
      },
      {
        path: '/sms-campaigns/scheduled',
        name: 'sms-campaigns-scheduled',
        component: () => import('@/views/modules/campaigns/sms-campaign/SMSCampaignList.vue'),
        props: {
          statusFilter: {
            filterType: 'text',
            type: 'equals',
            filter: enums.Campaign.Status.PENDING,
          },
          listType: enums.Campaign.ListType.Scheduled,
        },
        meta: {
          pageTitle: '$SMSCampaignModule.SMSScheduled',
          operation: enums.Operation.LIST,
        },
      },

      {
        path: '/sms-campaigns/create',
        name: 'sms-campaigns-create',
        component: () => import('@/views/modules/campaigns/sms-campaign/SMSCampaignListCreateOrEdit.vue'),
        props: {
          entity: enums.Entity.SMS_CAMPAIGN,
          operation: enums.Operation.CREATE,
        },
        meta: {
          pageTitle: 'Create an SMS campaign',
          operation: enums.Operation.CREATE,
        },
      },

      {
        path: '/sms-campaigns/edit',
        name: 'sms-campaigns-edit',
        component: () => import('@/views/modules/campaigns/sms-campaign/SMSCampaignListCreateOrEdit.vue'),
        props: {
          entity: enums.Entity.SMS_CAMPAIGN,
          operation: enums.Operation.EDIT,
        },
        meta: {
          pageTitle: 'Edit SMS Campaign',
          operation: enums.Operation.EDIT,
        },
      },

      {
        path: '/sms-templates',
        name: 'sms-templates',
        component: () => import('@/views/modules/templates/sms-template/SMSTemplateList.vue'),
        props: { actionsMinWidth: 200 },
        meta: {
          pageTitle: '$Entities.SMSTemplate',
          operation: enums.Operation.LIST,
        },
      },

      // Caller Ids Module
      {
        path: '/caller-ids',
        name: 'caller-ids',
        component: () => import('@/views/modules/sender-ids/caller-id/CallerIdList.vue'),
        meta: {
          pageTitle: '$Entities.CallerID',
          operation: enums.Operation.LIST,
        },
      },

      {
        path: '/contacts',
        name: 'contacts',
        component: () => import('@/views/modules/contacts/contact/ContactList.vue'),
        meta: {
          pageTitle: '$Entities.Contact',
          operation: enums.Operation.LIST,
        },
      },
    ],
  },
  // =============================================================================
  // FULL PAGE LAYOUTS
  // =============================================================================
  {
    path: '/',
    component: () => import('@/layouts/full-page/FullPage.vue'),
    children: [
      // =============================================================================
      // PAGES
      // =============================================================================
      {
        path: '/callback',
        name: 'auth-callback',
        component: () => import('@/views/Callback.vue'),
        meta: {
        },
      },
      {
        path: '/log-in',
        name: 'login',
        component: () => import('@/views/pages/auth/TheAuth.vue'),
        props: { operation: 'Login' },
        meta: {
          requiresGuest: true,
        },
      },
      {
        path: '/sign-up',
        name: 'register',
        component: () => import('@/views/pages/auth/TheAuth.vue'),
        props: { operation: 'SignUp' },
        meta: {
          requiresGuest: true,
        },
      },
      {
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('@/views/pages/auth/TheForgotPassword.vue'),
        meta: {
          requiresGuest: true,
        },
      },
      {
        path: '/reset-password/:securityToken',
        name: 'reset-password',
        component: () => import('@/views/pages/auth/TheResetPassword.vue'),
        meta: {
          requiresGuest: true,
        },
      },
      {
        path: '/invited-sign-up/:securityToken',
        name: 'invited-sign-up',
        component: () => import('@/views/pages/auth/TheInviteRegister.vue'),
        meta: {
          requiresGuest: true,
        },
      },
      {
        path: '/not-authorized',
        name: 'not-authorized',
        component: () => import('@/views/pages/auth/TheNotAuthorized.vue'),
        meta: {
        },
      },
      {
        path: '/pages/lock-screen',
        name: 'page-lock-screen',
        component: () => import('@/views/pages/LockScreen.vue'),
        meta: {
        },
      },
      {
        path: '/pages/comingsoon',
        name: 'page-coming-soon',
        component: () => import('@/views/pages/ComingSoon.vue'),
        meta: {
        },
      },
      {
        path: '/contacts/opt-out/:contactId/:optOutToken/:serviceName',
        name: 'contacts-opt-out',
        component: () => import('@/views/pages/ContactOptOut.vue'),
        meta: {
        },
      },
      {
        path: '/contacts/opt-in/:contactId/:optOutToken/:serviceName',
        name: 'contacts-opt-in',
        props: { isOptOut: false },
        component: () => import('@/views/pages/ContactOptOut.vue'),
        meta: {
        },
      },
      {
        path: '/pages/error-404',
        name: 'page-error-404',
        component: () => import('@/views/pages/Error404.vue'),
        meta: {
        },
      },
      {
        path: '/pages/error-500',
        name: 'page-error-500',
        component: () => import('@/views/pages/Error500.vue'),
        meta: {
        },
      },
      {
        path: '/pages/maintenance',
        name: 'page-maintenance',
        component: () => import('@/views/pages/Maintenance.vue'),
        meta: {
        },
      },
    ],
  },
  // Redirect to 404 page, if no match found
  {
    path: '*',
    redirect: '/pages/error-404',
  },
];

export default routes;
