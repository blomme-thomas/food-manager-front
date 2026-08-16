import { environment } from '@environments/environment';

const API_BASE_URL = environment.apiBaseUrl;

export const API_ROUTES = {
  AUTH: {
    EXTERNAL: `${API_BASE_URL}/auth/external`,
  },
  USERS: {
    REGISTER: `${API_BASE_URL}/users/register`,
    ME: `${API_BASE_URL}/users/me`,
  },
  FOODS: {
    SEARCH: `${API_BASE_URL}/foods/search`,
    CREATE: `${API_BASE_URL}/foods`,
    UNITS: `${API_BASE_URL}/foods/units`,
    CATEGORIES: `${API_BASE_URL}/foods/categories`,
  },
};
