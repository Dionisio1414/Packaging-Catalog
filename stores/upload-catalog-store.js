import { defineStore } from '@modules/pinia';

import removeNullValues from '@/packaging-catalog/utils/remove-null-values';

import { ACTION_TYPES } from '@/packaging-catalog/constants/stores/upload-catalog-store';
import { uploadCatalog } from '@/packaging-catalog/services/upload-catalog-service';

export default defineStore('upload-catalog-store', {
  state: () => ({
    upload_results: null,

    upload_form: {
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
    },

    loading: false,
  }),

  actions: {
    async [ACTION_TYPES.UPLOAD_CATALOG](files = []) {
      try {
        const params = removeNullValues(this.upload_form);

        this.loading = true;

        const data = await uploadCatalog({ ...params, files });

        this.$patch((state) => {
          state.upload_results = data; 
        });
      } finally {
        this.loading = false;
      }
    },
  },
});