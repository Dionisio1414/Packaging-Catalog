<template>
  <b-pagination
    :value="page"
    :total-rows="totalItems"
    :per-page="perPage"
    prev-text="Prev"
    next-text="Next"
    first-number
    last-number
    :disabled="disabled"
    @change="$emit('change-page', { key: 'page', type, value: $event })"
  />
</template>

<script>
export default {
  name: 'PackagingCatalogPagination',

  props: {
    page: {
      type: Number,
      required: true,
    },

    perPage: {
      type: Number,
      required: true,
    },

    totalItems: {
      type: Number,
      required: true,
    },

    disabled: {
      type: Boolean,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },
  },
};
</script>
