import { defineStore } from '@modules/pinia';

import { getCatalogTables } from '@/packaging-catalog/services/home-catalog-service';
import { ACTION_TYPES } from '@/packaging-catalog/constants/stores/home-catalog-store';
import { GETTER_TYPES } from '@/packaging-catalog/constants/stores/home-catalog-store';

export default defineStore('home-catalog-store', {
  state: () => ({
    catalog_tables: [],

    loading: false,
  }),

  actions: {
    async [ACTION_TYPES.GET_CATALOG_TABLES]() {
      try {
        this.loading = true;

        const data = await getCatalogTables();

        this.$patch((state) => {
          state.catalog_tables = data;
        });
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    [GETTER_TYPES.GET_CATALOG_TABLE]: (state) => {
      return (type) => {
        return state.catalog_tables[type];
      };
    },
  },
});