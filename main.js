import Vue from '@modules/vue';
import router from '@/packaging-catalog/router';

import '@/packaging-catalog/plugins/vue-composition-api';
import '@/packaging-catalog/plugins/vue-multiselect';
import { pinia } from '@/packaging-catalog/plugins/pinia';
import BootstrapVue from '@modules/bootstrap-vue';
import VueEventBus from '@/packaging-catalog/plugins/vue-event-bus';

import App from '@/packaging-catalog/app.vue';

import '@/packaging-catalog/assets/styles/main.css';

Vue.use(BootstrapVue);
Vue.use(VueEventBus);

Vue.config.productionTip = false;
Vue.config.devtools = true;

new Vue({
  pinia,
  router,
  render: (h) => h(App),
}).$mount('#packaging-catalog');
