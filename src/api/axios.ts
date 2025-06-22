import axios from "axios";

export const instance = axios.create({ baseURL: 'http://localhost:8080' });

instance.interceptors.request.use(config => config, () => {
  // todo access token putting logic
});

instance.interceptors.response.use((config) => config, (config) => {
  // todo on token expiration logic
});
