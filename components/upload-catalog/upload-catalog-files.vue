<template>
  <div class="upload-catalog-files">
    <b-alert show variant="info">
      Confirm settings will be available after uploading files.
    </b-alert>

    <b-form-file
      id="upload-catalog-files"
      size="lg"
      multiple
      :accept="accept"
      :disabled="loading"
      @input="onUploadFiles"
    >
      <template #placeholder>
        <div class="text-center">
          <font-awesome-icon icon="cloud-download-alt" />
          <div class="text">
            Drag & Drop file here or click for select file.
          </div>
        </div>
      </template>
    </b-form-file>
  </div>
</template>

<script>
import { validationMixin } from '@modules/vuelidate';
import { required } from '@modules/vuelidate/lib/validators';

import { library } from '@modules/@fortawesome/fontawesome-svg-core';

import { faCloudDownloadAlt } from '@modules/@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@modules/@fortawesome/vue-fontawesome';

library.add(faCloudDownloadAlt);

export default {
  name: 'UploadCatalogFiles',

  mixins: [validationMixin],

  components: { FontAwesomeIcon },

  props: {
    step: {
      type: Number,
      required: true,
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },

  validations: {
    files: {
      required,
    },
  },

  data: () => ({
    accept: '.cdr, .psd, .jpg, .jpeg, .png, .zip, .rar, .fnt, .fon, .otf, .ttf',
  }),

  computed: {
    filesList() {
      return this.files.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
        content: file,
        base64content: file.base64content,
      }));
    },
  },

  methods: {
    onUploadFiles(filesList) {
      const files = filesList.map(async (file) => {
        const base64content = await this.getBase64(file);

        return {
          name: file.name,
          type: file.type,
          size: file.size,
          content: file,
          base64content,
        };
      });

      Promise.all(files).then((results) => {
        this.$emit('upload-files', results, this.step + 1);
      });
    },

    getBase64(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
          resolve(reader.result);
        };

        reader.onerror = reject;
      });
    },
  },
};
</script>

<style scoped>
.upload-catalog-files .alert {
  font-size: 1rem;
}
.upload-catalog-files::v-deep {
  min-height: 24rem;
}
.upload-catalog-files::v-deep .custom-file .custom-file-label {
  display: flex !important;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  border-radius: 0 !important;
  margin-bottom: 0 !important;
  height: 20rem !important;
  border: 2px dashed var(--gray) !important;
  cursor: pointer;
}

.upload-catalog-files::v-deep .custom-file .custom-file-label::after {
  display: none;
}
</style>
