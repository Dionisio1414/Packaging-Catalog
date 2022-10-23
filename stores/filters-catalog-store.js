import { defineStore } from '@modules/pinia';
import tablesStore from '@/packaging-catalog/stores/tables-store';

import cloneDeep from '@modules/lodash.clonedeep';
import removeNullValues from '@/packaging-catalog/utils/remove-null-values';

import {
  getCatalogFilters,
  getExportLayouts,
  getSearchList,
} from '@/packaging-catalog/services/filters-catalog-service';
import { ACTION_TYPES as ACTION_TYPES_FILTERS } from '@/packaging-catalog/constants/stores/filters-catalog-store';
import { GETTER_TYPES as GETTER_TYPES_TABLES } from '@/packaging-catalog/constants/stores/tables-store';
import { ACTION_TYPES as ACTION_TYPES_TABLES } from '@/packaging-catalog/constants/stores/tables-store';

import FILTER_LAYOUT_TYPES from '@/packaging-catalog/constants/filter-layout-types';
import { DEFAULT_FILTERS_FORM } from '@/packaging-catalog/constants/default-filters-form';

export default defineStore('filters-catalog-store', {
  state: () => ({
    catalog_filters: {},
    filters_results: null,
    export_results: null,

    filters_form: {
      search: null,
      category_guid: null,
      brand_guid: null,
      is_archived: null,
      packaging_catalog_type_id: null,
      product_team_guid: null,
      factory_guid: null,
    },

    loading: false,
  }),

  actions: {
    async [ACTION_TYPES_FILTERS.GET_CATALOG_FILTERS]() {
      try {
        this.loading = true;

        const data = await getCatalogFilters();

        this.$patch((state) => {
          state.catalog_filters = {
            ...data,
            statuses: cloneDeep(FILTER_LAYOUT_TYPES),
          };
        });
      } finally {
        this.loading = false;
      }
    },

    async [ACTION_TYPES_FILTERS.GET_EXPORT_LAYOUTS](id = null) {
      try {
        const tablesStores = tablesStore();
        const params = {
          guids: id
            ? [...id]
            : [...tablesStores[GETTER_TYPES_TABLES.SELECTED_LAYOUTS_PARAMS]],
        };

        this.loading = true;

        const data = await getExportLayouts(params);

        this.$patch((state) => {
          state.export_results = data;
        });
      } finally {
        this.loading = false;
      }
    },

    async [ACTION_TYPES_FILTERS.GET_SEARCH_LIST](type) {
      try {
        const tablesStores = tablesStore();
        const params = {
          ...removeNullValues(tablesStores.tables[type]),
          ...removeNullValues(this.filters_form),
        };

        this.loading = true;

        const { order, sort_key, ...rest } = await getSearchList(params);

        this.$patch((state) => state.filters_results = rest);

        tablesStores[ACTION_TYPES_TABLES.UPDATE_TABLE]({ key: 'order', type, value: order });
        tablesStores[ACTION_TYPES_TABLES.UPDATE_TABLE]({ key: 'sort_key', type, value: sort_key });
      } finally {
        this.loading = false;
      }
    },

    [ACTION_TYPES_FILTERS.RESET_FILTERS_FORM]() {
      this.filters_form = cloneDeep(DEFAULT_FILTERS_FORM);
    },
  },
});