<template>
  <b-card>
    <template #header>
      <h5 class="mb-0">Confirm settings</h5>
    </template>

    <b-container fluid class="p-0">
      <b-row>
        <b-col cols="6">
          <upload-catalog-list
            :files="files"
            :filters="filters"
            :loading="loading"
            @parse-file="onParseFile"
          />
        </b-col>

        <b-col cols="6">
          <upload-catalog-preview
            :filters="filters"
            :form-data="formData"
            :loading="loading"
          />
        </b-col>
      </b-row>
    </b-container>
  </b-card>
</template>

<script>
import UploadCatalogPreview from '@/packaging-catalog/components/upload-catalog/upload-catalog-preview.vue';
import UploadCatalogList from '@/packaging-catalog/components/upload-catalog/upload-catalog-list.vue';

export default {
  name: 'UploadCatalogSettings',

  components: {
    'upload-catalog-list': UploadCatalogList,
    'upload-catalog-preview': UploadCatalogPreview,
  },

  props: {
    loading: {
      type: Boolean,
      required: true,
    },

    files: {
      type: Array,
      required: true,
    },

    filters: {
      type: Object,
    },
  },

  data: () => ({
    formData: {},
  }),

  methods: {
    onParseFile(form) {
      this.formData = form;
    },
  },
};
</script>
