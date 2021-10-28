<template>
    <div>
        <h2 class="mb-6">Notifications</h2>

        <vx-card>
          <vs-list
          v-for="ntfGroup in notifications"
          :key="ntfGroup._id">
            <vs-list-header
              :title="ntfGroup._id | date(true, true, false)">
            </vs-list-header>
            <vs-list-item
              v-for="ntf in ntfGroup.notifications"
              :key="ntf._id"
              :title="$t(`$AppNotifications.${ntf.type}.title`)"
              :subtitle="$t(`$AppNotifications.${ntf.type}.msg`)">
              {{ ntf.createdAt | time }}
            </vs-list-item>
          </vs-list>
        </vx-card>

    </div>
</template>

<script>
import { mapActions } from 'vuex';


export default {
  name: 'Notifications',
  data() {
    return {
      notifications: [],
    };
  },
  computed: {
  },
  created() {
    this.fetchNotifications();
  },
  methods: {
    ...mapActions({
      updateNotificationsAsViewed: 'notification/updateNotificationsAsViewed',
      fetchAllNotifications: 'notification/fetchAllNotifications',
      fetchAllNotificationsByDay: 'notification/fetchAllNotificationsByDay',
    }),
    async fetchNotifications() {
      const resp = await this.fetchAllNotificationsByDay({});
      this.notifications = resp.data;
    },
  },
};

</script>
