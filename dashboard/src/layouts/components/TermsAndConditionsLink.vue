<template>
  <a
    href="https://grapesend.com.au"
    target="_blank">
    <slot>
      {{ $t('$General.TermsAndConditions') }}
    </slot>
  </a>
</template>

<script>
export default {
  name: 'TermsAndConditionsLink',
};
</script>
