import httpClient from '@/packaging-catalog/utils/http-client';

export default class BaseApiService {
  async get(url = '', params = {}, config = {}) {
    const response = await httpClient(config).get(url, {
      params,
      onDownloadProgress: (ProgressEvent) => {
        console.log(ProgressEvent);
      },
    });

    return response;
  }

  async post(url = '', params = {}, config = {}) {
    const response = await httpClient(config).post(url, params);

    return response;
  }
}
