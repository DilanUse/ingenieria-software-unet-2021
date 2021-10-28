<template>
  <vs-dropdown
    vs-custom-content
    vs-trigger-click
    class="cursor-pointer">

    <feather-icon
      icon="HelpCircleIcon"
      class="cursor-pointer mt-1"/>

    <vs-dropdown-menu class="vx-navbar-dropdown">
      <ul style="min-width: 9rem">
        <li
          class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
          @click="$router.push('/pages/faq')">
          <span>
            <i class="fas fa-question"></i>
          </span>
          <span class="ml-2">{{ $tc('$General.FAQ', 2) }}</span>
        </li>

        <li
          class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
          @click="$router.push('/pages/knowledge-base')">
          <feather-icon
            icon="BookOpenIcon"
            svgClasses="w-4 h-4" />
          <span class="ml-2">{{ $t('$General.Documentation') }}</span>
        </li>

        <li
          class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
          @click="openChat()">
          <span>
            <i class="far fa-comments"></i>
          </span>
          <span class="ml-2">{{ $t('$General.Contact') }}</span>
        </li>
      </ul>
    </vs-dropdown-menu>
  </vs-dropdown>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'HelpDropdown',
  methods: {
    ...mapMutations({
      openChat: 'INCREASE_OPEN_CHAT_KEY',
    }),
  },
};
</script>
