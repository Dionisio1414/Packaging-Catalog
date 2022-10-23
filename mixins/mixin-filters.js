export default {
  props: {
    filters: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    categoriesOptions() {
      return (this.filters.categories || [])?.map((item) => item.guid);
    },

    brandsOptions() {
      return (this.filters.brands || [])?.map((item) => item.guid);
    },

    factoriesOptions() {
      return (this.filters.factories || [])?.map((item) => item.guid);
    },

    packagingTypesOptions() {
      return (this.filters.packaging_catalog_types || [])?.map(
        (item) => item.id
      );
    },

    productTeamsOptions() {
      return (this.filters.product_teams || [])?.map((item) => item.guid);
    },

    statusesOptions() {
      return (this.filters.statuses || [])?.map((item) => item.id);
    },

    versionsOptions() {
      return (this.filters.versions || [])?.map((item) => item.version);
    },
  },

  methods: {
    customLabelCategories(guid) {
      const option = this.filters?.categories?.find(
        (item) => item.guid === guid
      );

      return option.names.nameEn ?? '';
    },

    customLabelBrands(guid) {
      const option = this.filters?.brands?.find((item) => item.guid === guid);

      return option.name ?? '';
    },

    customLabelFactories(guid) {
      const option = this.filters?.factories?.find(
        (item) => item.guid === guid
      );

      return option.name ?? '';
    },

    customLabelPackagingTypes(id) {
      const option = this.filters?.packaging_catalog_types?.find(
        (item) => item.id === id
      );

      return option.name ?? '';
    },

    customLabelProductTeams(guid) {
      const option = this.filters?.product_teams?.find(
        (item) => item.guid === guid
      );

      return option.name ?? '';
    },

    customLabelStatuses(id) {
      const option = this.filters?.statuses?.find((item) => item.id === id);

      return option.name ?? '';
    },

    customLabelVersions(version) {
      const option = this.filters?.versions?.find((item) => item.version === version);

      return option.version ??  '';
    },
  },
};
