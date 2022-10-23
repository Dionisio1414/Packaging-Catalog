import { defineStore } from '@modules/pinia';
import cloneDeep from '@modules/lodash.clonedeep';

import { GETTER_TYPES } from '@/packaging-catalog/constants/stores/tables-store';
import { ACTION_TYPES } from '@/packaging-catalog/constants/stores/tables-store';

import { DEFAULT_SELECTED_LAYOUTS } from '@/packaging-catalog/constants/default-selected-layouts';
import { DEFAULT_TABLE_PARAMS } from '@/packaging-catalog/constants/default-table-params';

export default defineStore('tables-store', {
  state: () => ({
    selected_layouts: {
      active: [],
      archived: [],
      search: [],
    },

    tables: {
      search: {
        per_page: 10,
        page: 1,
        sort_key: 'created_at',
        order: 'desc',
      },
    },
  }),

  actions: {
    [ACTION_TYPES.RESET_TABLE_PARAMS](type) {
      this.tables[type] = cloneDeep(DEFAULT_TABLE_PARAMS);
    },

    [ACTION_TYPES.RESET_SELECTED_LAYOUTS]() {
      this.selected_layouts = cloneDeep(DEFAULT_SELECTED_LAYOUTS);
    },

    [ACTION_TYPES.UPDATE_TABLE]({ key, type, value }) {
      this.$patch((state) => {
        if (typeof key === 'object') {
          const [sort_key, order] = key;
          const [sort_key_value, order_value] = value;

          state.tables[type][sort_key] = sort_key_value;
          state.tables[type][order] = order_value ? 'desc' : 'asc';
        } else {
          state.tables[type][key] = value;
        }
      });
    },
  },

  getters: {
    [GETTER_TYPES.IS_SELECT_LAYOUTS]: (state) => {
      const values = Object.values(state.selected_layouts);

      return values.some((item) => item.length);
    },

    [GETTER_TYPES.SELECTED_LAYOUTS_PARAMS]: (state) => {
      const ids = Object.values(state.selected_layouts).flatMap((item) => item);

      return ids.map((item) => item?.id);
    },
  },
});
