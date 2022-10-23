<template>
  <div class="upload-catalog-list">
    <upload-catalog-list-item
      v-for="(file, index) in files"
      :class="{ 'mb-3': (files.length - 1) !== index }"
      :file="file"
      :filters="filters"
      :key="index"
      @parse-file="$emit('parse-file', $event)"
    />
  </div>
</template>

<script>
import UploadCatalogListItem from '@/packaging-catalog/components/upload-catalog/upload-catalog-list-item.vue';

export default {
  name: 'UploadCatalogList',

  components: {
    UploadCatalogListItem,
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
      default: () => {},
    },
  },
};
</script>
