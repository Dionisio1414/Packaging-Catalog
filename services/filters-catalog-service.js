import BaseApiService from '@/packaging-catalog/services/base-api-service';

class FiltersCatalogService extends BaseApiService {
  async getCatalogFilters(params = {}) {
    const response = await super.get('filters', params);

    return response?.data;
  }

  async getExportLayouts(params = {}) {
    const response = await super.get('download', params, {
      responseType: 'blob',
    });

    return response?.data;
  }

  async getSearchList(params = {}) {
    const response = await super.get('list', params);

    return response?.data;
  }
}

const { getCatalogFilters, getExportLayouts, getSearchList } =
  new FiltersCatalogService();

export { getCatalogFilters, getExportLayouts, getSearchList };