<template>
  <div id="packaging-catalog" class="packaging-catalog">
    <div class="packaging-catalog__wrapper">
      <error-boundary>
        <router-view />

        <div class="modal-wrapper">
          <component
            :is="currentModal"
            :modal-id="modalId"
            :visible="visible"
            :custom-props="customProps"
          />
        </div>
      </error-boundary>
    </div>
  </div>
</template>

<script>
import MixinModal from '@/packaging-catalog/mixins/mixin-modal';

import { ErrorBoundary } from '@/packaging-catalog/components';

export default {
  name: 'PackagingCatalog',

  mixins: [MixinModal],

  components: { ErrorBoundary },

  created() {
    const root = document.documentElement;

    root && root.classList.add('custom-root');
  },
};
</script>

<style lang="scss" scoped>
.packaging-catalog::v-deep {
  @import '@modules/bootstrap/scss/bootstrap.scss';
}
</style>
