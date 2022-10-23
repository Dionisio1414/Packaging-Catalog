import BaseApiService from '@/packaging-catalog/services/base-api-service';

class UploadCatalogService extends BaseApiService {
  async uploadCatalog(params = {}) {
    const response = await super.post('upload', params);

    return response?.data;
  }
}

const { uploadCatalog } = new UploadCatalogService();

export { uploadCatalog };
