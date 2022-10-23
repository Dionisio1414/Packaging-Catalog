<template>
  <div class="packaging-catalog-table">
    <h3 v-if="title" class="h3 mb-3" v-html="title" />

    <div class="table-responsive">
      <b-table
        :fields="fieldsList"
        :items="items"
        :current-page="pagination.page"
        :busy="loading"
        outlined
        striped
        bordered
        show-empty
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        @sort-changed="onSorting($event, type)"
      >
        <template #table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner label="Loading..." variant="dark" />
          </div>
        </template>

        <template #head(checkbox)>
          <b-form-checkbox
            plain
            size="lg"
            :checked="isAllSelected"
            :disabled="!isAllCheckbox"
            @click.stop
            @change="onChangeAllSelected"
          />
        </template>

        <template #cell(checkbox)="{ item }">
          <b-form-checkbox
            v-model="selected_layouts[type]"
            plain
            size="lg"
            :value="item"
            @click.stop
          />
        </template>

        <template #cell(name)="{ item }">
          <template v-if="item.name && item.id">
            <b-button
              class="text-decoration p-0"
              variant="link"
              style="color: var(--dark)"
              @click.prevent.stop="$emit('export', [item.id])"
            >
              {{ item.name }}
            </b-button>
          </template>

          <span v-else v-html="$options.filters.columnValue(item.name)" />
        </template>

        <template #cell(category)="{ item }">
          <span
            v-html="$options.filters.columnValue(item.category.name.nameEn)"
          />
        </template>

        <template #cell(factory)="{ item }">
          <span v-html="$options.filters.columnValue(item.factory.name)" />
        </template>

        <template #cell(width)="{ item }">
          <span v-html="$options.filters.columnValue(item.width)" />
        </template>

        <template #cell(depth)="{ item }">
          <span v-html="$options.filters.columnValue(item.depth)" />
        </template>

        <template #cell(height)="{ item }">
          <span v-html="$options.filters.columnValue(item.height)" />
        </template>

        <template #cell(brand)="{ item }">
          <span v-html="$options.filters.columnValue(item.brand.name)" />
        </template>

        <template #cell(archived_at)="{ item }">
          <span v-html="$options.filters.dateValue(item.archived_at)" />
        </template>

        <template #cell(created_at)="{ item }">
          <span v-html="$options.filters.dateValue(item.created_at)" />
        </template>

        <template #cell(packaging_catalog_type)="{ item }">
          <span
            v-html="
              $options.filters.columnValue(item.packaging_catalog_type.name)
            "
          />
        </template>

        <template #cell(product_team)="{ item }">
          <span v-html="$options.filters.columnValue(item.product_team.name)" />
        </template>

        <template #cell(comment)="{ item }">
          <span v-html="$options.filters.columnValue(item.comment)" />
        </template>
      </b-table>
    </div>

    <div
      class="d-flex justify-content-center align-items-center"
    >
      <packaging-catalog-pagination
        v-if="isPagination"
        class="ml-auto mr-auto"
        v-bind="pagination"
        @change-page="$emit('change-table', $event)"
      />

      <multiselect
        v-if="isPerPage"
        :class="{ 'ml-auto': isPagination === false }"
        :value="pagination.perPage"
        :options="perPageOptions"
        :searchable="false"
        :show-labels="false"
        :allow-empty="false"
        :disabled="loading"
        placeholder="Choose a value"
        style="max-width: 5rem"
        @input="$emit('change-table', { key: 'per_page', type, value: $event })"
      />
    </div>
  </div>
</template>

<script>
import { mapWritableState } from '@modules/pinia';
import cloneDeep from '@modules/lodash.clonedeep';

import tablesStore from '@/packaging-catalog/stores/tables-store';

import { PackagingCatalogPagination } from '@/packaging-catalog/components';
import PER_PAGE_TABLE from '@/packaging-catalog/constants/per-page-table';

export default {
  name: 'PackagingCatalogTable',

  components: { PackagingCatalogPagination },

  props: {
    fields: {
      type: Array,
      required: true,
    },

    items: {
      type: Array,
      required: true,
    },

    title: {
      type: [String, null],
      default: () => null,
    },

    pagination: {
      type: Object,
      default: () => ({}),
    },

    loading: {
      type: Boolean,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    sort: {
      type: Boolean,
      default: false,
    },

    sortDesc: {
      type: Boolean,
      default: true,
    },

    sortBy: {
      type: String,
      default: () => 'created_at',
    },

    sortableFields: {
      type: Array,
      default: () => [],
    },

    isPerPage: {
      type: Boolean,
      default: false,
    }
  },

  filters: {
    columnValue(value) {
      return value ? value : '<span class="font-weight-bold">&#8212;</span>';
    },

    dateValue(value) {
      return value
        ? new Date(value).toLocaleDateString()
        : '<span class="font-weight-bold">&#8212;</span>';
    },
  },

  data: () => ({
    isAllSelected: false,
    perPageOptions: PER_PAGE_TABLE,
  }),

  computed: {
    ...mapWritableState(tablesStore, ['selected_layouts']),

    isPagination() {
      return (
        !!Object.keys(this.pagination)?.length && this.pagination.totalPages > 1
      );
    },

    isAllCheckbox() {
      return !!this.items.length;
    },

    selectedTableLayouts() {
      return this.selected_layouts[this.type];
    },

    fieldsList() {
      return this.sort
        ? this.fields.map((field) => ({
            ...field,
            sortable:
              field.key !== 'checkbox' &&
              this.sortableFields.includes(field.key),
          }))
        : this.fields;
    },
  },

  methods: {
    onChangeAllSelected() {
      if (this.isAllSelected) {
        this.isAllSelected = false;
        this.selected_layouts[this.type] = [];
      } else {
        this.isAllSelected = true;
        this.selected_layouts[this.type] = cloneDeep(this.items);
      }
    },

    onSorting({ sortBy: sort_key, sortDesc: order }, type) {
      this.$emit('change-table', {
        key: ['sort_key', 'order'],
        type,
        value: [sort_key, Boolean(sort_key) ? order : true],
      });
    },
  },

  watch: {
    selectedTableLayouts(value) {
      value.length === this.items.length
        ? (this.isAllSelected = true)
        : (this.isAllSelected = false);
    },

    immediate: false,
  },
};
</script>
