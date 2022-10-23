<template>
  <b-modal
    :id="modalId"
    :visible="visible"
    :hide-footer="hideFooter"
    static
    size="lg"
    scrollable
    @hidden="closeHandler"
  >
    <template #modal-header="{ close }">
      <div class="d-flex align-items-center w-100">
        <h4 class="modal-title">Import layouts</h4>
        <button
          style="font-size: 2rem"
          type="button"
          class="close"
          @click="close"
        >
          ×
        </button>
      </div>
    </template>

    <template #default>
      <b-overlay class="position-absolute" :show="loading" />

      <upload-catalog-steps :step="step" />

      <transition name="fade" mode="out-in">
        <component
          :is="currentComponent"
          :step="step"
          v-bind="componentProps"
          @next-step="onNextStepHandler"
          @upload-files="onUploadFiles"
        />
      </transition>
    </template>

    <template #modal-footer="{ hide }">
      <div class="d-flex align-items-center justify-content-between w-100">
        <b-button variant="primary" @click="onValidationHandler(hide)">
          Start upload
        </b-button>

        <b-button variant="danger" @click="onResetStep"> Reset </b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import MixinToast from '@/packaging-catalog/mixins/mixin-toast';

import { mapState, mapWritableState, mapActions } from '@modules/pinia';
import cloneDeep from '@modules/lodash.clonedeep';

import { validationMixin } from '@modules/vuelidate';

import { required } from '@modules/vuelidate/lib/validators';

import filtersCatalogStore from '@/packaging-catalog/stores/filters-catalog-store';
import uploadCatalogStore from '@/packaging-catalog/stores/upload-catalog-store';

import {
  UploadCatalogSteps,
  UploadCatalogFiles,
  UploadCatalogSettings,
} from '@/packaging-catalog/components/upload-catalog';

import { MODAL_CLOSE } from '@/packaging-catalog/constants/modals/modal-event-types';
import { DEFAULT_UPLOAD_CATALOG_FORM } from '@/packaging-catalog/constants/default-upload-catalog-form';

import { ACTION_TYPES as ACTION_TYPES_UPLOAD_CATALOG } from '@/packaging-catalog/constants/stores/upload-catalog-store';

import { TOAST_VARIANTS } from '@/packaging-catalog/constants/base-toast-config';

export default {
  name: 'ModalUploadCatalog',

  mixins: [validationMixin, MixinToast],

  components: {
    'upload-catalog-steps': UploadCatalogSteps,
    'upload-catalog-files': UploadCatalogFiles,
    'upload-catalog-settings': UploadCatalogSettings,
  },

  props: {
    modalId: {
      type: String,
      required: true,
    },

    visible: {
      type: Boolean,
      required: true,
    },

    customProps: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    step: 1,
    files: [],
  }),

  validations() {
    return {
      form: {
        category_guid: { required },
        factory_guid: { required },
        width: { required },
        depth: { required },
        height: { required },
        brand_guid: { required },
        packaging_catalog_type_id: { required },
        version: { required },
        design_number: { required },
      },
    };
  },

  provide() {
    const vv = {};

    Object.defineProperty(vv, '$v', {
      enumerable: true,
      get: () => this.$v,
    });

    return {
      vv,
      onResetValidation: this.onResetValidation,
    };
  },

  computed: {
    ...mapState(filtersCatalogStore, {
      filters: (store) => store.catalog_filters,
    }),

    ...mapState(uploadCatalogStore, {
      uploadResults: (store) => store.upload_results,
      loading: (store) => store.loading,
    }),

    ...mapWritableState(uploadCatalogStore, ['upload_form']),

    form() {
      return {
        category_guid: this.upload_form.category_guid,
        factory_guid: this.upload_form.factory_guid,
        width: this.upload_form.width,
        depth: this.upload_form.depth,
        height: this.upload_form.height,
        brand_guid: this.upload_form.brand_guid,
        packaging_catalog_type_id: this.upload_form.packaging_catalog_type_id,
        version: this.upload_form.version,
        design_number: this.upload_form.design_number,
        product_team_guid: this.upload_form.product_team_guid,
        article_id: this.upload_form.article_id,
        comment: this.upload_form.comment,
      };
    },

    currentComponent() {
      switch (this.step) {
        case 1:
          return 'upload-catalog-files';
        case 2:
        case 3:
          return 'upload-catalog-settings';
        case 4:
          return 'upload-catalog-results';
        default:
          return 'upload-catalog-files';
      }
    },

    componentProps() {
      switch (this.step) {
        case 2:
        case 3:
          return {
            files: this.files ?? [],
            filters: this.filters ?? {},
            loading: this.loading,
          };
        case 4:
          return {
            uploadResults: this.uploadResults ?? {},
            loading: this.loading,
          };
        default:
          return {};
      }
    },

    hideFooter() {
      return this.step === 1;
    },
  },

  methods: {
    ...mapActions(uploadCatalogStore, [
      ACTION_TYPES_UPLOAD_CATALOG.UPLOAD_CATALOG,
    ]),

    onUploadFiles(files, step) {
      this.files = files;
      this.onNextStepHandler(step);
    },

    closeHandler(callback) {
      const typeCallback = callback.vueTarget
        ? callback.vueTarget.hide
        : callback;

      this.$bus.$emit(MODAL_CLOSE, typeCallback);
    },

    onResetStep() {
      this.step = 1;
      this.upload_form = cloneDeep(DEFAULT_UPLOAD_CATALOG_FORM);
      this.onResetValidation();
    },

    onNextStepHandler(step) {
      this.step = step;
    },

    onResetValidation() {
      this.$v.$reset();
    },

    onScrollToTop() {
      const modalContent = this.$el.querySelector(
        `#${this.modalId}___BV_modal_body_`
      );
      const isScroll = modalContent.scrollHeight > modalContent.clientHeight;
      const el = this.$el.querySelector('.breadcrumb');

      if (el && isScroll) {
        el.scrollIntoView({ block: 'end', behavior: 'smooth' });
      }
    },

    onTransformFiles(files) {
      return files.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
        content: file.base64content,
      }));
    },

    async onUploadHandler() {
      try {
        const files = this.onTransformFiles(this.files);

        await this[ACTION_TYPES_UPLOAD_CATALOG.UPLOAD_CATALOG](files);

        this.onShowToast('Successfully uploaded files', {
          title: 'Uploading files',
          variant: TOAST_VARIANTS.SUCCESS,
        });
      } catch (error) {
        this.step = 2;
        throw { ...error };
      }
    },

    async onValidationHandler(hideCallback) {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.step = this.step + 1;
        await this.onUploadHandler();
        this.step = this.step + 1;
      } else {
        this.onScrollToTop();
      }
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
