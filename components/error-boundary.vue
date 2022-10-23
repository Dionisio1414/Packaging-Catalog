<template>
  <div class="error-boundary">
    <slot />
  </div>
</template>

<script>
import MixinToast from '@/packaging-catalog/mixins/mixin-toast';
import { TOAST_VARIANTS } from '@/packaging-catalog/constants/base-toast-config';

export default {
  name: 'ErrorBoundary',

  mixins: [MixinToast],

  errorCaptured(err) {
    const content = err.errorMessage
      ? err.errorMessage
      : err.response?.data
      ? err.response.data.message ?? err.response.data
      : err.message;

    const title = err.title ? err.title : err.response.statusText;

    this.onShowToast(content, { title, variant: TOAST_VARIANTS.DANGER });

    return false;
  },
};
</script>
