import Vue from '@modules/vue';
import { PiniaVuePlugin, createPinia } from '@modules/pinia';

Vue.use(PiniaVuePlugin);

const pinia = createPinia();

export { pinia };
