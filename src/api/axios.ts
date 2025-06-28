import axios from "axios";
import type { AxiosRequestHeaders } from 'axios';

export const instance = axios.create({ baseURL: import.meta.env.VITE_BASE_URL });

instance.interceptors.request.use(config => {
  config = {
    ...config,
    headers: {
      ...config.headers,
      'Authorization': `Bearer ${localStorage.getItem('tlcify_access_token')}`
    } as AxiosRequestHeaders
  }
  return config;
}, config => config);

instance.interceptors.response.use((config) => {
  const { data } = config;

  if (data.accessToken) localStorage.setItem('tlcify_access_token', data.accessToken);

  return config;
}, (config) => {
  // todo magic numbers
  if (config.status === 401) localStorage.removeItem('tlcify_access_token')
  console.log(config)
});
