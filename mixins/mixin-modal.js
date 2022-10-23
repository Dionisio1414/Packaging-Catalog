import Vue from '@modules/vue';

import {
  MODAL_CLOSE,
  MODAL_SHOW,
} from '@/packaging-catalog/constants/modals/modal-event-types';

export default {
  data: () => ({
    modalId: null,
    visible: false,
    customProps: null,
  }),

  computed: {
    currentModal() {
      if (this.modalId) {
        return Vue.component(this.modalId, (resolve) => {
          require([`@/packaging-catalog/components/modals/${this.modalId}.vue`], resolve);
        });
      }

      return null;
    },
  },

  mounted() {
    this.$bus.$on(MODAL_SHOW, (modalId, customProps = {}) => {
      this.modalId = modalId;
      this.visible = true;
      this.customProps = customProps;
    });

    this.$bus.$on(MODAL_CLOSE, (callback) => {
      this.modalId = null;
      this.visible = false;
      this.customProps = null;

      if (callback) callback();
    });
  },
};
