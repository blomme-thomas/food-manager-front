import { environment } from '@environments/environment';

const API_BASE_URL = environment.apiBaseUrl;

export const API_ROUTES = {
  AUTH: {
    EXTERNAL: `${API_BASE_URL}/auth/external`,
  },
};
