<template>
  <div class="packaging-catalog-filters">
    <div class="packaging-catalog-filters__selects d-flex align-items-center">
      <b-form-input
        v-model.trim="filters_form.search"
        id="search"
        placeholder="Name"
        :disabled="loading"
      />

      <multiselect
        v-model="filters_form.category_guid"
        id="category_guid"
        placeholder="Category"
        :options="categoriesOptions"
        :searchable="false"
        :show-labels="false"
        :allow-empty="false"
        :disabled="loading"
        :custom-label="customLabelCategories"
      >
        <template #clear>
          <button
            v-show="filters_form.category_guid !== null"
            class="multiselect__clear"
            type="button"
            @click.stop="onClearFilter({ key: 'category_guid', value: null })"
          >
            <font-awesome-icon icon="times" />
          </button>
        </template>

        <template #singleLabel="{ option }">
          {{ `${customLabelCategories(option)} - Category` }}
        </template>
      </multiselect>

      <multiselect
        v-model="filters_form.factory_guid"
        id="factory_guid"
        placeholder="Supplier"
        :options="factoriesOptions"
        :searchable="false"
        :show-labels="false"
        :allow-empty="false"
        :disabled="loading"
        :custom-label="customLabelFactories"
      >
        <template #clear>
          <button
            v-show="filters_form.factory_guid !== null"
            class="multiselect__clear"
            type="button"
            @click.stop="onClearFilter({ key: 'factory_guid', value: null })"
          >
            <font-awesome-icon icon="times" />
          </button>
        </template>

        <template #singleLabel="{ option }">
          {{ `${customLabelFactories(option)} - Supplier` }}
        </template>
      </multiselect>

      <multiselect
        v-model="filters_form.is_archived"
        id="is_archived"
        placeholder="Status"
        :options="statusesOptions"
        :searchable="false"
        :show-labels="false"
        :allow-empty="false"
        :disabled="loading"
        :custom-label="customLabelStatuses"
      >
        <template #clear>
          <button
            v-show="filters_form.is_archived !== null"
            class="multiselect__clear"
            type="button"
            @click.stop="onClearFilter({ key: 'is_archived', value: null })"
          >
            <font-awesome-icon icon="times" />
          </button>
        </template>

        <template #singleLabel="{ option }">
          {{ `${customLabelStatuses(option)} - Status` }}
        </template>
      </multiselect>

      <multiselect
        v-model="filters_form.brand_guid"
        id="brand_guid"
        placeholder="Brand"
        :options="brandsOptions"
        :searchable="false"
        :show-labels="false"
        :allow-empty="false"
        :disabled="loading"
        :custom-label="customLabelBrands"
      >
        <template #clear>
          <button
            v-show="filters_form.brand_guid !== null"
            class="multiselect__clear"
            type="button"
            @click.stop="onClearFilter({ key: 'brand_guid', value: null })"
          >
            <font-awesome-icon icon="times" />
          </button>
        </template>

        <template #singleLabel="{ option }">
          {{ `${customLabelBrands(option)} - Brand` }}
        </template>
      </multiselect>

      <multiselect
        v-model="filters_form.packaging_catalog_type_id"
        id="packaging_catalog_type_id"
        placeholder="Packing type"
        :options="packagingTypesOptions"
        :searchable="false"
        :show-labels="false"
        :allow-empty="false"
        :disabled="loading"
        :custom-label="customLabelPackagingTypes"
      >
        <template #clear>
          <button
            v-show="filters_form.packaging_catalog_type_id !== null"
            class="multiselect__clear"
            type="button"
            @click.stop="
              onClearFilter({ key: 'packaging_catalog_type_id', value: null })
            "
          >
            <font-awesome-icon icon="times" />
          </button>
        </template>

        <template #singleLabel="{ option }">
          {{ `${customLabelPackagingTypes(option)} - Packing type` }}
        </template>
      </multiselect>

      <multiselect
        v-model="filters_form.product_team_guid"
        id="product_team_guid"
        placeholder="Product team"
        :options="productTeamsOptions"
        :searchable="false"
        :show-labels="false"
        :allow-empty="false"
        :disabled="loading"
        :custom-label="customLabelProductTeams"
      >
        <template #clear>
          <button
            v-show="filters_form.product_team_guid !== null"
            class="multiselect__clear"
            type="button"
            @click.stop="
              onClearFilter({ key: 'product_team_guid', value: null })
            "
          >
            <font-awesome-icon icon="times" />
          </button>
        </template>

        <template #singleLabel="{ option }">
          {{ `${customLabelProductTeams(option)} - Product team` }}
        </template>
      </multiselect>

      <b-button
        variant="outline-success"
        :disabled="loading"
        @click="$emit('search')"
      >
        Search
      </b-button>
    </div>

    <div
      class="packaging-catalog-filters__actions d-flex align-items-center justify-content-end"
    >
      <span id="export-layouts">
        <b-button
          variant="info"
          :disabled="loading || !isExport"
          @click="$emit('export')"
        >
          Export
        </b-button>
      </span>

      <b-button
        variant="info"
        :disabled="loading"
        @click="$bus.$emit(modalShowAction, modalId)"
      >
        Add
      </b-button>

      <template v-if="!isExport">
        <b-tooltip
          target="export-layouts"
          triggers="hover"
          title="You must select at least one row"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from '@modules/pinia';
import filtersCatalogStore from '@/packaging-catalog/stores/filters-catalog-store';

import MixinFilters from '@/packaging-catalog/mixins/mixin-filters';

import { library } from '@modules/@fortawesome/fontawesome-svg-core';

import { faTimes } from '@modules/@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@modules/@fortawesome/vue-fontawesome';

import { MODAL_SHOW } from '@/packaging-catalog/constants/modals/modal-event-types';
import { MODAL_UPLOAD_CATALOG } from '@/packaging-catalog/constants/modals/modal-ids';

library.add(faTimes);

export default {
  name: 'PackagingCatalogFilters',

  mixins: [MixinFilters],

  components: { FontAwesomeIcon },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },

    isExport: {
      type: Boolean,
      default: true,
    },
  },

  data: () => ({
    modalShowAction: MODAL_SHOW,
    modalId: MODAL_UPLOAD_CATALOG,
  }),

  computed: {
    ...mapWritableState(filtersCatalogStore, ['filters_form']),
  },

  methods: {
    onClearFilter({ key, value }) {
      this.filters_form[key] = value;
    },
  },
};
</script>

<style scoped>
.packaging-catalog-filters {
  display: grid;
  grid-template-columns: 7fr 1fr;
  gap: var(--gap-1);
}

.packaging-catalog-filters__selects {
  gap: var(--gap-0);
}

.packaging-catalog-filters__selects > .multiselect,
.packaging-catalog-filters__selects > .form-control {
  flex-shrink: 1;
  flex-basis: calc((100% / 7) - var(--gap-1));
  width: calc((100% / 7) - var(--gap-1)) !important;
  min-width: calc((100% / 7) - var(--gap-1));
}

.packaging-catalog-filters__actions {
  gap: var(--gap-0);
}
</style>
