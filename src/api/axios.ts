import axios from "axios";
import type { AxiosRequestHeaders } from 'axios';
import toast from "react-hot-toast";

export const instance = axios.create({ baseURL: import.meta.env.VITE_BASE_URL });

let pendingToastId: string | null = null;
let activeRequests = 0;

instance.interceptors.request.use(config => {
  activeRequests++;

  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  const tenant = parts.length > 2 ? parts[0] : null; // "samkara"

  if (tenant) config.headers["X-Tenant-Id"] = tenant;

  if (!pendingToastId) pendingToastId = toast.loading('Working on it...');

  config = {
    ...config,
    headers: {
      ...config.headers,
      'Authorization': `Bearer ${localStorage.getItem('tlcify_access_token')}`
    } as AxiosRequestHeaders
  }
  return config;
}, config => {
  activeRequests = Math.max(0, activeRequests - 1);

  if (activeRequests === 0 && pendingToastId) {
    toast.dismiss(pendingToastId);
    pendingToastId = null;
  }

  return config;
});

instance.interceptors.response.use((config) => {
  const { data } = config;
  activeRequests = Math.max(0, activeRequests - 1);

  if (activeRequests === 0 && pendingToastId) {
    toast.dismiss(pendingToastId);
    pendingToastId = null;
  }

  if (data.accessToken) localStorage.setItem('tlcify_access_token', data.accessToken);

  return config;
}, (config) => {
  activeRequests = Math.max(0, activeRequests - 1);

  if (activeRequests === 0 && pendingToastId) {
    toast.dismiss(pendingToastId);
    pendingToastId = null;
  }
  // todo magic numbers
  if (config.status === 401) localStorage.removeItem('tlcify_access_token')
  console.log(config)
});
