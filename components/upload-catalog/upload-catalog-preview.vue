<template>
  <b-card class="upload-catalog-preview">
    <template #header>
      <h5 class="mb-0">Preview file settings</h5>
    </template>

    <b-table-simple class="m-0" small bordered>
      <b-tbody>
        <b-tr>
          <b-td>Category</b-td>
          <b-td>
            <multiselect
              :class="{ 'multiselect--error': vv.$v.$error }"
              v-model="upload_form.category_guid"
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
                  v-show="upload_form.category_guid !== null"
                  class="multiselect__clear"
                  type="button"
                  @click.stop="onClearFormField('category_guid')"
                >
                  <font-awesome-icon icon="times" />
                </button>
              </template>

              <template #singleLabel="{ option }">
                {{ `${customLabelCategories(option)} - Category` }}
              </template>
            </multiselect>
          </b-td>
        </b-tr>

        <b-tr>
          <b-td>Supplier</b-td>
          <b-td>
            <multiselect
              :class="{ 'multiselect--error': vv.$v.$error }"
              v-model="upload_form.factory_guid"
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
                  v-show="upload_form.factory_guid !== null"
                  class="multiselect__clear"
                  type="button"
                  @click.stop="onClearFormField('factory_guid')"
                >
                  <font-awesome-icon icon="times" />
                </button>
              </template>

              <template #singleLabel="{ option }">
                {{ `${customLabelFactories(option)} - Supplier` }}
              </template>
            </multiselect>
          </b-td>
        </b-tr>

        <b-tr>
          <b-td>Width</b-td>
          <b-td>
            <b-form-input
              v-model.number="upload_form.width"
              id="width"
              placeholder="Width"
              :state="vv.$v.$error ? false : null"
              :disabled="loading"
              @input="vv.$v.$reset()"
            />
          </b-td>
        </b-tr>

        <b-tr>
          <b-td>Height</b-td>
          <b-td>
            <b-form-input
              v-model.number="upload_form.height"
              id="height"
              placeholder="Height"
              :state="vv.$v.$error ? false : null"
              :disabled="loading"
              @input="vv.$v.$reset()"
            />
          </b-td>
        </b-tr>

        <b-tr>
          <b-td>Depth</b-td>
          <b-td>
            <b-form-input
              v-model.number="upload_form.depth"
              id="depth"
              placeholder="Depth"
              :state="vv.$v.$error ? false : null"
              :disabled="loading"
              @input="vv.$v.$reset()"
            />
          </b-td>
        </b-tr>

        <b-tr>
          <b-td>Brand</b-td>
          <b-td>
            <multiselect
            :class="{ 'multiselect--error': vv.$v.$error }"
              v-model="upload_form.brand_guid"
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
                  v-show="upload_form.brand_guid !== null"
                  class="multiselect__clear"
                  type="button"
                  @click.stop="onClearFormField('brand_guid')"
                >
                  <font-awesome-icon icon="times" />
                </button>
              </template>

              <template #singleLabel="{ option }">
                {{ `${customLabelBrands(option)} - Brand` }}
              </template>
            </multiselect>
          </b-td>
        </b-tr>

        <b-tr>
          <b-td>Packaging type</b-td>
          <b-td>
            <multiselect
            :class="{ 'multiselect--error': vv.$v.$error }"
              v-model="upload_form.packaging_catalog_type_id"
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
                  v-show="upload_form.packaging_catalog_type_id !== null"
                  class="multiselect__clear"
                  type="button"
                  @click.stop="onClearFormField('packaging_catalog_type_id')"
                >
                  <font-awesome-icon icon="times" />
                </button>
              </template>

              <template #singleLabel="{ option }">
                {{ `${customLabelPackagingTypes(option)} - Packaging type` }}
              </template>
            </multiselect>
          </b-td>
        </b-tr>

        <b-tr>
          <b-td>Article ID</b-td>
          <b-td>
            <b-form-input
              v-model.number="upload_form.article_id"
              id="article_id"
              placeholder="Article ID"
              :disabled="loading"
              @input="vv.$v.$reset()"
            />
          </b-td>
        </b-tr>

        <b-tr>
          <b-td>Version</b-td>
          <b-td>
            <multiselect
            :class="{ 'multiselect--error': vv.$v.$error }"
              v-model="upload_form.version"
              id="version"
              placeholder="Version"
              :options="versionsOptions"
              :searchable="false"
              :show-labels="false"
              :allow-empty="false"
              :disabled="loading"
              :custom-label="customLabelVersions"
            >
              <template #clear>
                <button
                  v-show="upload_form.version !== null"
                  class="multiselect__clear"
                  type="button"
                  @click.stop="onClearFormField('version')"
                >
                  <font-awesome-icon icon="times" />
                </button>
              </template>

              <template #singleLabel="{ option }">
                {{ `${customLabelVersions(option)} - Version` }}
              </template>
            </multiselect>
          </b-td>
        </b-tr>

        <b-tr>
          <b-td>Design number</b-td>
          <b-td>
            <b-form-input
              v-model.number="upload_form.design_number"
              id="design_number"
              placeholder="Design number"
              :state="vv.$v.$error ? false : null"
              :disabled="loading"
              @input="vv.$v.$reset()"
            />
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
  </b-card>
</template>

<script>
import { mapWritableState } from '@modules/pinia';
import uploadCatalogStore from '@/packaging-catalog/stores/upload-catalog-store';

import MixinFilters from '@/packaging-catalog/mixins/mixin-filters';

import { library } from '@modules/@fortawesome/fontawesome-svg-core';

import { faTimes } from '@modules/@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@modules/@fortawesome/vue-fontawesome';

library.add(faTimes);

export default {
  name: 'UploadCatalogPreview',

  mixins: [MixinFilters],

  components: { FontAwesomeIcon },

  props: {
    loading: {
      type: Boolean,
      required: true,
    },

    formData: {
      type: Object,
      default: () => ({
        category_guid: null,
        factory_guid: null,
        width: null,
        depth: null,
        height: null,
        brand_guid: null,
        packaging_catalog_type_id: null,
        version: null,
        design_number: null,
        product_team_guid: null,
        article_id: null,
        comment: null,
      }),
    },
  },

  inject: ['vv', 'onResetValidation'],

  computed: {
    ...mapWritableState(uploadCatalogStore, ['upload_form']),
  },

  methods: {
    onClearFormField(key) {
      this.upload_form[key] = null;

      this.onResetValidation();
    },
  },

  watch: {
    formData(value) {
      this.upload_form = { ...value };
    },
  },
};
</script>

<style scoped>
.upload-catalog-preview::v-deep .card-body {
  padding: 0;
}
</style>
