import { getApiBaseUrl } from '@/lib/apiConfig';

const getUrl = (endpoint: string) => {
  const base = getApiBaseUrl();
  const formatted = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const cleanEndpoint = formatted.length > 1 ? formatted.replace(/\/+$/, '') : formatted;
  return `${base}/api${cleanEndpoint}`;
};

export const api = {
  get: async (endpoint: string) => {
    return fetch(getUrl(endpoint), {
      credentials: 'include',
    });
  }, 
  post: async (endpoint: string, data: any) => {
    return fetch(getUrl(endpoint), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },
  patch: async (endpoint: string, data: any) => {
    return fetch(getUrl(endpoint), {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },
  put: async (endpoint: string, data: any) => {
    return fetch(getUrl(endpoint), {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },
  delete: async (endpoint: string) => {
    return fetch(getUrl(endpoint), {
      method: 'DELETE',
      credentials: 'include',
    });
  },
};
