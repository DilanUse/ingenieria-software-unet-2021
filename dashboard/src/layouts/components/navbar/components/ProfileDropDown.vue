<template>
  <div
    v-if="authUser.name"
    class="the-navbar__user-meta flex items-center">

    <div class="text-right leading-tight hidden sm:block">
      <p class="font-semibold">{{ authUser.name  }}</p>
    </div>

    <vs-dropdown
      vs-custom-content
      vs-trigger-click
      class="cursor-pointer"
      style="max-height: 40px">

      <vs-avatar
        :src="avatarUrl"
        :text="authUser.name"
        color="primary"
        size="40px"
        class="text-2xl ml-3 m-0"/>

      <vs-dropdown-menu class="vx-navbar-dropdown">
        <ul style="min-width: 9rem">
          <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            @click="logout">
            <feather-icon
              icon="LogOutIcon"
              svgClasses="w-4 h-4" />
            <span class="ml-2">{{ $tc('$General.Logout') }}</span>
          </li>
        </ul>
      </vs-dropdown-menu>
    </vs-dropdown>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      authUser: (state) => state.auth.user,
    }),
    ...mapGetters({
      avatarUrl: 'auth/avatarUrl',
    }),
  },
  methods: {
    ...mapActions({
      actionLogout: 'auth/logout',
    }),
    async logout() {
      await this.actionLogout();
      this.$router.push({ name: 'login' }).catch(() => {});
    },
  },
};
</script>
