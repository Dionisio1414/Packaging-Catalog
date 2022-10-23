<template>
  <b-breadcrumb>
    <b-breadcrumb-item>
      <router-link to="/">Home</router-link>
    </b-breadcrumb-item>

    <b-breadcrumb-item
      v-for="(breadcrumb, index) in breadcrumbs"
      :key="index"
      :active="index === linkLimit"
    >
      <template v-if="index < linkLimit">
        <router-link :to="breadcrumb.link">{{ breadcrumb.name }}</router-link>
      </template>

      <template v-else>{{ breadcrumb.name }}</template>
    </b-breadcrumb-item>
  </b-breadcrumb>
</template>

<script>
export default {
  name: 'PackagingCatalogBreadcrumbs',

  props: {
    breadcrumbs: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  computed: {
    linkLimit() {
      return this.breadcrumbs.length - 1;
    },
  },
};
</script>
