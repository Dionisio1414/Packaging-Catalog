export const routes = [
  {
    path: '/',
    name: 'home-catalog-view',
    component: () => import('@/packaging-catalog/views/home-catalog-view.vue'),
  },

  {
    path: '/search',
    name: 'search-view',
    component: () => import('@/packaging-catalog/views/search-view.vue'),
  },
];
