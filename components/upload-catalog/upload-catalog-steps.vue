<template>
  <div class="upload-catalog-steps">
    <b-breadcrumb class="justify-content-center">
      <b-breadcrumb-item class="font-weight-bold" active>
        Steps:
      </b-breadcrumb-item>

      <b-breadcrumb-item
        v-for="(value, index) in steps"
        :key="index"
        active
        :class="{
          'font-weight-bold': value.step === step,
          'breadcrumb-item--active': value.step === step,
        }"
      >
        {{ value.text }}
      </b-breadcrumb-item>
    </b-breadcrumb>
  </div>
</template>

<script>
import steps from '@/packaging-catalog/constants/upload-catalog-steps';

export default {
  name: 'UploadCatalogSteps',

  props: {
    step: {
      type: Number,
      required: true,
    },
  },

  data: () => ({
    steps,
  }),
};
</script>

<style scoped>
.upload-catalog-steps {
  font-size: 1.15rem;
}

.upload-catalog-steps > .breadcrumb > .breadcrumb-item--active {
  color: var(--success);
}
</style>
