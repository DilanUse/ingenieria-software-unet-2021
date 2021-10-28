<template>
  <vs-dropdown
    vs-custom-content
    vs-trigger-click
    class="cursor-pointer"
    @blur.prevent="onViewNotifications()">
    <feather-icon
      icon="BellIcon"
      class="cursor-pointer mt-1"
      :badge="unseenNotificationsCount"/>

    <vs-dropdown-menu
      class="notification-dropdown dropdown-custom vx-navbar-dropdown whitespace-normal">

      <div
        class="notification-top text-center p-5 bg-primary text-white">
        <h3 class="text-white">{{ unseenNotificationsCount }} {{ $tc('$General.New') }}</h3>
        <p class="opacity-75">{{ $t('$AppNotifications.AppNotifications') }}</p>
      </div>

      <VuePerfectScrollbar
        ref="mainSidebarPs"
        :key="$vs.rtl"
        class="scroll-area--nofications-dropdown p-0 mb-10"
        :settings="settings">
        <ul class="bordered-items">
          <li
            v-for="(ntf, index) in unseenNotifications"
            :key="index"
            class="flex justify-between px-4 py-4 notification cursor-pointer"
            :class="{ unseen: !ntf.seen }">
            <div class="flex items-start">
              <feather-icon
                :icon="getIconByType(ntf.type)"
                :svgClasses="[`text-${getCategoryByType(ntf.type)}`,
                'stroke-current mr-1 h-6 w-6']"/>
              <div class="mx-2">
                <span
                  class="font-medium block notification-title"
                  :class="[`text-${getCategoryByType(ntf.type)}`]">
                  {{ $t(`$AppNotifications.${ntf.type}.title`) }}
                </span>
                <small
                  v-if="ntf.type === $enums.AppNotifications.Type.EXPORT_SUCCESS"
                  v-html="$t(`$AppNotifications.${ntf.type}.${
                    getDaysOffset(ntf.createdAt) > 29 ? 'msgUnavailable' : 'msg'}`, {
                    entity: $tc(`$Entities.${ntf.payload.entity}`, 2),
                    url: ntf.payload.url,
                  })">
                </small>
                <small
                  v-else-if="ntf.type === $enums.AppNotifications.Type.INBOUND_SMS
                  || ntf.type === $enums.AppNotifications.Type.OPT_OUT">
                  {{
                    $t(`$AppNotifications.${ntf.type}.msg`, {
                      from: ntf.payload.from,
                    })
                  }}
                  <br>
                  <strong>
                    <router-link :to="ntf.type === $enums.AppNotifications.Type.INBOUND_SMS
                    ? '/sms-inbounds'
                    : '/contacts/blacklist'">
                      {{  $t(`$AppNotifications.${ntf.type}.viewAll`) }}
                    </router-link>
                  </strong>
                </small>
                <small
                  v-else-if="ntf.type === $enums.AppNotifications.Type.REVIEW_CONFIGURATION">
                  {{ $t(`$AppNotifications.${ntf.type}.msg`) }}
                  <strong>
                    <router-link :to="'/reviews'">
                      {{  $t(`$AppNotifications.${ntf.type}.linkMsg`) }}
                    </router-link>
                  </strong>
                </small>
                <small v-else>
                  {{ $t(`$AppNotifications.${ntf.type}.msg`) }}
                </small>
              </div>
            </div>

            <small class="mt-1">{{ ntf.createdAt
              | date(true, false, true, false, true, false) }}</small>
          </li>
        </ul>
      </VuePerfectScrollbar>

      <div class="
        checkout-footer
        fixed
        bottom-0
        rounded-b-lg
        text-primary
        w-full
        p-2
        font-semibold
        text-center
        border
        border-b-0
        border-l-0
        border-r-0
        border-solid
        d-theme-border-grey-light
        cursor-pointer">
        <span>
          <router-link :to="{ name: 'notifications' }">
            {{ $t('$AppNotifications.ViewAllNotifications') }}
          </router-link>
        </span>
      </div>
    </vs-dropdown-menu>
  </vs-dropdown>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import { mapState, mapActions, mapMutations } from 'vuex';
import moment from 'moment';
import enums from '@/enums';

export default {
  components: {
    VuePerfectScrollbar,
  },
  data() {
    return {
      registeredSocketListener: false,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.60,
      },
    };
  },
  computed: {
    ...mapState({
      authSocket: (state) => state.auth.socket,
      unseenNotificationsCount: (state) => state.notification.unseenCount,
      unseenNotifications: (state) => state.notification.unseenCollection,
    }),
  },
  watch: {
    authSocket: {
      immediate: true,
      handler(value) {
        if (value && !this.registeredSocketListener) {
          this.registerSocketListener();
        }
      },
    },
  },
  created() {
    this.fetchUnseenNotifications();
  },
  methods: {
    ...mapActions({
      fetchUnseenNotifications: 'notification/fetchUnseenNotifications',
      updateNotificationsAsViewed: 'notification/updateNotificationsAsViewed',
    }),
    ...mapMutations({
      addUnseenNotification: 'notification/ADD_UNSEEN_NOTIFICATION',
    }),
    registerSocketListener() {
      this.authSocket.on(this.$enums.SocketEvents.NOTIFICATION, (notification) => {
        this.addUnseenNotification(notification);
      });
      this.registeredSocketListener = true;
    },
    getIconByType(type) {
      switch (type) {
        case enums.AppNotifications.Type.EXPORT_SUCCESS:
          return 'DownloadCloudIcon';

        case enums.AppNotifications.Type.INBOUND_SMS:
          return 'InboxIcon';

        case enums.AppNotifications.Type.OPT_OUT:
          return 'UserXIcon';

        default:
          return '';
      }
    },
    getCategoryByType(type) {
      switch (type) {
        case enums.AppNotifications.Type.EXPORT_SUCCESS:
        case enums.AppNotifications.Type.INBOUND_SMS:
          return 'success';

        case enums.AppNotifications.Type.OPT_OUT:
          return 'warning';

        default:
          return '';
      }
    },
    getDaysOffset(createdAt) {
      const currentDate = moment.utc(new Date());
      const createdAtDate = moment.utc(createdAt);

      return currentDate.diff(createdAtDate, 'days');
    },
    onViewNotifications() {
      this.updateNotificationsAsViewed();
    },
  },
};

</script>
