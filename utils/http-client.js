import axios from '@modules/axios';

import { BASE_URL as baseURL } from '@/packaging-catalog/environment';

const headers = {};

const config = {
  baseURL,
  headers,
};

const httpClient = (extraConfig = {}) =>
  axios.create({ ...config, ...extraConfig });

httpClient().interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default httpClient;
