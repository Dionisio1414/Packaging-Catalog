<template>
  <default-layout>
    <template #breadcrumbs>
      <packaging-catalog-breadcrumbs :breadcrumbs="breadcrumbs" />
    </template>

    <template #title>
      <h1 class="h1 mb-0">Search results</h1>
    </template>

    <template #filters>
      <packaging-catalog-filters
        :filters="filters"
        :is-export="isExport"
        :loading="loading"
        @export="onExportHandler"
        @search="onSearchHandler"
      />
    </template>

    <template #content>
      <packaging-catalog-table
        v-bind="sortParams"
        :type="type"
        :items="items"
        :fields="fields"
        :pagination="pagination"
        :loading="loading"
        :sortable-fields="sortableFields"
        is-per-page
        @change-table="onChangeTable"
        @export="onExportHandler"
      />
    </template>
  </default-layout>
</template>

<script>
import { mapActions, mapState } from '@modules/pinia';

import MixinToast from '@/packaging-catalog/mixins/mixin-toast';
import MixinFileSaver from '@/packaging-catalog/mixins/mixin-file-saver';

import filtersCatalogStore from '@/packaging-catalog/stores/filters-catalog-store';
import tablesStore from '@/packaging-catalog/stores/tables-store';

import DefaultLayout from '@/packaging-catalog/layouts/default-layout.vue';
import {
  PackagingCatalogBreadcrumbs,
  PackagingCatalogFilters,
  PackagingCatalogTable,
} from '@/packaging-catalog/components';

import { ACTION_TYPES as ACTION_TYPES_FILTERS } from '@/packaging-catalog/constants/stores/filters-catalog-store';
import { ACTION_TYPES as ACTION_TYPES_TABLES } from '@/packaging-catalog/constants/stores/tables-store';
import { GETTER_TYPES as GETTER_TYPES_TABLE } from '@/packaging-catalog/constants/stores/tables-store';

import { TABLE_HOME_CATALOG_FIELDS } from '@/packaging-catalog/constants/table-fields.js';

import { TOAST_VARIANTS } from '@/packaging-catalog/constants/base-toast-config';
import TABLE_SORTABLE_FIELDS from '@/packaging-catalog/constants/table-sortable-fields';

export default {
  name: 'SearchView',

  mixins: [MixinToast, MixinFileSaver],

  components: {
    DefaultLayout,
    PackagingCatalogBreadcrumbs,
    PackagingCatalogFilters,
    PackagingCatalogTable,
  },

  data: () => ({
    fields: TABLE_HOME_CATALOG_FIELDS,
    sortableFields: TABLE_SORTABLE_FIELDS,
    type: 'search',
  }),

  computed: {
    ...mapState(filtersCatalogStore, {
      filters: (store) => store.catalog_filters,
      loading: (store) => store.loading,
      exportResults: (store) => store.export_results,
      items: (store) => store.filters_results?.items ?? [],
      totalPages: (store) => store.filters_results?.total_pages ?? 0,
      totalItems: (store) => store.filters_results?.total_items ?? 0,
    }),

    ...mapState(tablesStore, {
      isExport: (store) => store[GETTER_TYPES_TABLE.IS_SELECT_LAYOUTS],
      tablesStore: (store) => store.tables,
    }),

    breadcrumbs() {
      return [
        {
          link: null,
          name: 'Search results',
        },
      ];
    },

    pagination() {
      return {
        page: this.tablesStore[this.type].page,
        perPage: this.tablesStore[this.type].per_page,
        totalPages: this.totalPages,
        totalItems: this.totalItems,
        disabled: this.loading,
        type: this.type,
      };
    },

    sortParams() {
      return {
        sort: true,
        sortBy: this.tablesStore[this.type].sort_key,
        sortDesc: this.tablesStore[this.type].order === 'desc' ? true : false,
      };
    },
  },

  methods: {
    ...mapActions(filtersCatalogStore, [
      ACTION_TYPES_FILTERS.GET_SEARCH_LIST,
      ACTION_TYPES_FILTERS.GET_CATALOG_FILTERS,
      ACTION_TYPES_FILTERS.GET_EXPORT_LAYOUTS,
      ACTION_TYPES_FILTERS.RESET_FILTERS_FORM,
    ]),

    ...mapActions(tablesStore, [
      ACTION_TYPES_TABLES.RESET_SELECTED_LAYOUTS,
      ACTION_TYPES_TABLES.UPDATE_TABLE,
      ACTION_TYPES_TABLES.RESET_TABLE_PARAMS,
    ]),

    async onSearchHandler() {
      try {
        await this[ACTION_TYPES_TABLES.RESET_TABLE_PARAMS](this.type);
        await this[ACTION_TYPES_FILTERS.GET_SEARCH_LIST](this.type);
        await this[ACTION_TYPES_TABLES.RESET_SELECTED_LAYOUTS]();

        this.onShowToast('Successfully search', {
          title: 'Search results',
          variant: TOAST_VARIANTS.SUCCESS,
        });
      } catch (error) {
        throw { ...error };
      }
    },

    async onChangeTable(value) {
      try {
        if (value.key === 'per_page' || typeof value.key === 'object') {
          await this[ACTION_TYPES_TABLES.UPDATE_TABLE]({ key: 'page', type: value.type, value: 1 });
          await this[ACTION_TYPES_TABLES.UPDATE_TABLE]({ ...value });
        } else {
          await this[ACTION_TYPES_TABLES.UPDATE_TABLE]({ ...value });
        }

        await this[ACTION_TYPES_FILTERS.GET_SEARCH_LIST](this.type);
      } catch (error) {
        throw { ...error };
      }
    },

    async onExportHandler(id = null) {
      try {
        await this[ACTION_TYPES_FILTERS.GET_EXPORT_LAYOUTS](id);

        this.onSaveAs(
          this.exportResults,
          { type: 'application/octet-stream' },
          'packaging_catalog.zip'
        );
        this[ACTION_TYPES_TABLES.RESET_SELECTED_LAYOUTS]();

        this.onShowToast('Successfully export', {
          title: 'Export the layouts',
          variant: TOAST_VARIANTS.SUCCESS,
        });
      } catch (error) {
        if (error.response.status !== 200) {
          const errorMessage = await error?.response?.data?.text();
          throw {
            ...error,
            errorMessage: JSON.parse(errorMessage)?.message,
            title: 'Error of export',
          };
        } else {
          throw { ...error };
        }
      }
    },
  },

  async beforeRouteLeave(to, from, next) {
    await this[ACTION_TYPES_FILTERS.RESET_FILTERS_FORM]();
    await this[ACTION_TYPES_TABLES.RESET_SELECTED_LAYOUTS]();
    await this[ACTION_TYPES_TABLES.RESET_TABLE_PARAMS](this.type);

    next();
  },

  async mounted() {
    try {
      await this[ACTION_TYPES_FILTERS.GET_SEARCH_LIST](this.type);
      await this[ACTION_TYPES_FILTERS.GET_CATALOG_FILTERS]();
    } catch (error) {
      throw { ...error };
    }
  },
};
</script>
