<template>
  <default-layout>
    <template #title>
      <h1 class="h1 mb-0">Packaging Layout Catalog</h1>
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
        class="mb-5"
        title="Active"
        type="active"
        :items="activeTableItems"
        :fields="fields"
        :loading="loading"
        @export="onExportHandler"
      />

      <packaging-catalog-table
        title="Archived"
        type="archived"
        :items="archivedTableItems"
        :fields="fields"
        :loading="loading"
        @export="onExportHandler"
      />
    </template>
  </default-layout>
</template>

<script>
import { mapActions, mapState } from '@modules/pinia';

import MixinToast from '@/packaging-catalog/mixins/mixin-toast';
import MixinFileSaver from '@/packaging-catalog/mixins/mixin-file-saver';

import homeCatalogStore from '@/packaging-catalog/stores/home-catalog-store';
import filtersCatalogStore from '@/packaging-catalog/stores/filters-catalog-store';
import tablesStore from '@/packaging-catalog/stores/tables-store';

import DefaultLayout from '@/packaging-catalog/layouts/default-layout.vue';
import {
  PackagingCatalogFilters,
  PackagingCatalogTable,
} from '@/packaging-catalog/components';

import {
  ACTION_TYPES as ACTION_TYPES_CATALOG,
  GETTER_TYPES,
} from '@/packaging-catalog/constants/stores/home-catalog-store';
import { ACTION_TYPES as ACTION_TYPES_FILTERS } from '@/packaging-catalog/constants/stores/filters-catalog-store';
import { ACTION_TYPES as ACTION_TYPES_TABLES } from '@/packaging-catalog/constants/stores/tables-store';
import { GETTER_TYPES as GETTER_TYPES_TABLE } from '@/packaging-catalog/constants/stores/tables-store';

import { TABLE_HOME_CATALOG_FIELDS } from '@/packaging-catalog/constants/table-fields.js';

import { TOAST_VARIANTS } from '@/packaging-catalog/constants/base-toast-config';

export default {
  name: 'HomeCatalogView',

  mixins: [MixinToast, MixinFileSaver],

  components: {
    DefaultLayout,
    PackagingCatalogFilters,
    PackagingCatalogTable,
  },

  data: () => ({
    fields: TABLE_HOME_CATALOG_FIELDS,
  }),

  computed: {
    ...mapState(homeCatalogStore, {
      getTableByType: (store) => store[GETTER_TYPES.GET_CATALOG_TABLE],
      loadingHomeCatalog: (store) => store.loading,
    }),

    ...mapState(filtersCatalogStore, {
      filters: (store) => store.catalog_filters,
      loadingFiltersCatalog: (store) => store.loading,
      exportResults: (store) => store.export_results,
    }),

    ...mapState(tablesStore, {
      isExport: (store) => store[GETTER_TYPES_TABLE.IS_SELECT_LAYOUTS],
    }),

    activeTableItems() {
      return this.getTableByType('active') ?? [];
    },

    archivedTableItems() {
      return this.getTableByType('archived') ?? [];
    },

    loading() {
      return this.loadingHomeCatalog || this.loadingFiltersCatalog;
    },
  },

  methods: {
    ...mapActions(homeCatalogStore, [ACTION_TYPES_CATALOG.GET_CATALOG_TABLES]),

    ...mapActions(filtersCatalogStore, [
      ACTION_TYPES_FILTERS.GET_CATALOG_FILTERS,
      ACTION_TYPES_FILTERS.GET_EXPORT_LAYOUTS,
    ]),

    ...mapActions(tablesStore, [ACTION_TYPES_TABLES.RESET_SELECTED_LAYOUTS]),

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

    onSearchHandler() {
      this[ACTION_TYPES_TABLES.RESET_SELECTED_LAYOUTS]();
      this.$router.push({ name: 'search-view' });
    },
  },

  async mounted() {
    try {
      await this[ACTION_TYPES_CATALOG.GET_CATALOG_TABLES]();
      await this[ACTION_TYPES_FILTERS.GET_CATALOG_FILTERS]();
    } catch (error) {
      throw { ...error };
    }
  },
};
</script>
