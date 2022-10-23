import Vue from '@modules/vue';

export const eventBus = new Vue();

export default {
  install(Vue) {
    Vue.prototype.$bus = eventBus;
  },
};
