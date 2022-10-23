<template>
  <div
    class="upload-catalog-list-item"
    :class="{ 'upload-catalog-list-item--not-allowed': !fileNameToParse }"
    @click="onParseFile"
  >
    <div class="upload-catalog-list-item-col">
      <b-img
        v-if="filePreview"
        class="upload-catalog-list-item-image"
        :src="filePreview"
        thumbnail
        :alt="file.name"
      />

      <div v-else class="upload-catalog-list-item-empty">
        <b-img
          thumbnail
          blank
          blankColor="#777"
          rounded
          height="125"
          :alt="file.name"
        />

        <div class="file-extension">
          {{ fileExtension }}
        </div>
      </div>
    </div>
    <div class="upload-catalog-list-item-col">
      <b-progress
        class="mb-2"
        value="0"
        max="100"
        show-progress
        animated
        variant="success"
      />
      <div class="upload-catalog-list-item-text">{{ file.name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadCatalogListItem',

  props: {
    file: {
      type: Object,
      required: true,
    },

    filters: {
      type: Object,
      default: () => {},
    },
  },

  data: () => ({
    fileNameRegExp:
      /\d+_\d+_\d+[x,х]\d+[x,х]\d+_[R|RP|RR|S|T]_[C|B|BT|BL|L|T]_\d*_{0,1}[A-Z]\d+/,
  }),

  computed: {
    filePreview() {
      const isImage = this.file?.type?.split('/')[0];

      if (isImage === 'image') {
        return URL.createObjectURL(this.file.content);
      }

      return null;
    },

    fileExtension() {
      return this.file?.name?.split('.')?.pop();
    },

    fileNameToParse() {
      return this.fileNameRegExp.test(this.file.name);
    },

    fileNameParsed() {
      if (this.fileNameToParse) {
        if (this.file.name.split('_').length > 6) {
          const [
            category_id,
            factory_id,
            characteristics,
            brand_alias,
            packaging_catalog_type_alias,
            article_id,
            design_characteristics,
          ] = this.file?.name?.split('.')[0].split('_');

          const [width, height, depth] = characteristics.split(/[x,х]/);

          return {
            category_guid:
              this.filters?.categories?.find(
                (item) => item.names.genericId === +category_id
              )?.guid ?? null,
            factory_guid:
              this.filters?.factories?.find((item) => item.id === +factory_id)
                ?.guid ?? null,
            width,
            depth,
            height,
            brand_guid:
              this.filters?.brands?.find((item) => item.alias === brand_alias)
                ?.guid ?? null,
            packaging_catalog_type_id:
              this.filters?.packaging_catalog_types?.find(
                (item) => item.alias === packaging_catalog_type_alias
              )?.id ?? null,
            version: this.filters?.versions.find(
              (item) => item.version === design_characteristics.slice(0, 1)
            )?.version,
            design_number: design_characteristics.slice(1),
            article_id,
          };
        } else {
          const [
            category_id,
            factory_id,
            characteristics,
            brand_alias,
            packaging_catalog_type_alias,
            design_characteristics,
          ] = this.file?.name?.split('.')[0]?.split('_');

          const [width, height, depth] = characteristics.split(/[x,х]/);

          return {
            category_guid:
              this.filters?.categories?.find(
                (item) => item.names.genericId === +category_id
              )?.guid ?? null,
            factory_guid:
              this.filters?.factories?.find((item) => item.id === +factory_id)
                ?.guid ?? null,
            width,
            depth,
            height,
            brand_guid:
              this.filters?.brands?.find((item) => item.alias === brand_alias)
                ?.guid ?? null,
            packaging_catalog_type_id:
              this.filters?.packaging_catalog_types?.find(
                (item) => item.alias === packaging_catalog_type_alias
              )?.id ?? null,
            version: this.filters?.versions.find(
              (item) => item.version === design_characteristics.slice(0, 1)
            )?.version,
            design_number: design_characteristics.slice(1),
          };
        }
      }

      return null;
    },
  },

  methods: {
    onParseFile() {
      this.fileNameToParse && this.$emit('parse-file', this.fileNameParsed);
    },
  },
};
</script>

<style scoped>
.upload-catalog-list-item {
  display: flex;
  gap: var(--gap-0);
  cursor: pointer;
}

.upload-catalog-list-item--not-allowed {
  cursor: not-allowed;
}

.upload-catalog-list-item .upload-catalog-list-item-col:first-child {
  flex: 0 1 calc(35% - var(--gap-0));
}

.upload-catalog-list-item .upload-catalog-list-item-col:last-child {
  flex: 0 1 calc(65% - var(--gap-0));
}
.upload-catalog-list-item .upload-catalog-list-item-text {
  font-size: 0.95rem;
  line-height: 1;
  word-break: break-word;
}

.upload-catalog-list-item .upload-catalog-list-item-image {
  max-height: 125px;
  object-fit: cover;
  object-position: left;
  width: 100%;
  height: 100% !important;
  transition: opacity 0.25s ease;
}

.upload-catalog-list-item:hover .upload-catalog-list-item-image {
  opacity: 0.65;
}

.upload-catalog-list-item .upload-catalog-list-item-empty {
  position: relative;
}

.upload-catalog-list-item .upload-catalog-list-item-empty img {
  height: 100% !important;
  max-height: 125px;
  transition: opacity 0.25s ease;
}

.upload-catalog-list-item:hover .upload-catalog-list-item-empty img {
  opacity: 0.65;
}

.upload-catalog-list-item .upload-catalog-list-item-empty .file-extension {
  font-size: 1.25rem;
  font-weight: bold;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--light-gray);
}
</style>
