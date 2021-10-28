<template>
  <div class="vx-breadcrumb">
    <span
      class="flex items-center md:hidden cursor-pointer"
      @click.prevent="returnToPatch()">
      <feather-icon
        icon="ArrowLeftIcon"
        svgClasses="w-6 h-6" />
    </span>
    <ul class="flex flex-wrap items-center hidden md:block">
      <li
        v-for="(item, index) in breadcrumb.slice(0,-1)"
        :key="index"
        class="inline-flex items-center">
          <a
            v-if="item.fullPath"
            href="#"
            @click.prevent="returnToPatch(item.fullPath)">
            {{ $tc(item.title, 2) }}
          </a>
          <span
            v-else
            class="text-primary cursor-default">
            {{ $tc(item.title, 2) }}
          </span>
          <span class="breadcrumb-separator mx-2 flex items-start">
              <feather-icon
                icon="ChevronsRightIcon"
                svgClasses="w-4 h-4" />
          </span>
      </li>
      <li class="inline-flex">
          <span
            v-if="breadcrumb.slice(-1)[0].title"
            class="cursor-default">
              {{ $tc(breadcrumb.slice(-1)[0].title, 2) }}
          </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  name: 'TheBreadcrumb',
  computed: {
    ...mapState({
      breadcrumb: (state) => state.breadcrumb,
    }),
  },
  methods: {
    ...mapMutations({
      setIsReturningFromBreadcrumb: 'SET_IS_RETURNING_FROM_BREADCRUMB',
    }),
    ...mapActions({
      updateBreadcrumb: 'updateBreadcrumb',
    }),
    returnToPatch(patch = null) {
      this.setIsReturningFromBreadcrumb(true);

      console.log(this.$route.fullPath === patch);

      if (this.$route.fullPath === patch) {
        this.updateBreadcrumb({ to: this.$route, from: this.$route });
      } else if (patch) {
        this.$router.push(patch);
      } else {
        this.$router.back();
      }
    },
  },
};
</script>
