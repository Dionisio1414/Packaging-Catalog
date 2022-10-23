import Vue from '@modules/vue';
import VueRouter from '@modules/vue-router';

import { routes } from './routes';
import { BASE_ROUTER_PATH } from '@/packaging-catalog/constants/base-router-path';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: BASE_ROUTER_PATH,
  routes,
});

export default router;
