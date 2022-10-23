import BaseApiService from '@/packaging-catalog/services/base-api-service';

class HomeCatalogService extends BaseApiService {
  async getCatalogTables(params = {}) {
    const response = await super.get('short', params);

    return response?.data;
  }
}

const { getCatalogTables } = new HomeCatalogService();

export { getCatalogTables };
