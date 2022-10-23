<template>
  <div class="default-layout">
    <div v-if="hasSlot('breadcrumbs')" class="default-layout__breadcrumbs mb-4">
      <slot name="breadcrumbs" />
    </div>

    <div v-if="hasSlot('title')" class="default-layout__title mb-4">
      <slot name="title" />
    </div>

    <div v-if="hasSlot('filters')" class="default-layout__filters mb-4">
      <slot name="filters" />
    </div>

    <div v-if="hasSlot('content')" class="default-layout__content">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
import mixinSlot from '@/packaging-catalog/mixins/mixin-slot.js';

export default {
  name: 'DefaultLayout',

  mixins: [mixinSlot],
};
</script>
