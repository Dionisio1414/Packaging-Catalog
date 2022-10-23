import { BASE_TOAST_CONFIG } from '@/packaging-catalog/constants/base-toast-config';

export default {
  methods: {
    onShowToast(content, config) {
      this.$bvToast.toast(content, { ...BASE_TOAST_CONFIG, ...config });
    },
  },
};
