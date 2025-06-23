import axios from "axios";

export const instance = axios.create({ baseURL: 'http://localhost:8080' });

instance.interceptors.request.use(config => {
  config = {
    ...config,
    headers: {
      ...config.headers,
      'Authorization': `Bearer ${localStorage.getItem('tlcify_access_token')}`
    }
  }
  return config;
}, config => config);

instance.interceptors.response.use((config) => {
  const { data } = config;

  if (data.accessToken) localStorage.setItem('tlcify_access_token', data.accessToken);

  return config;
}, (config) => {
  // todo magic numbers
  if (config.status === 401 && !location.pathname.includes('login')) location.assign('/login')
  console.log(config)
});
