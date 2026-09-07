// Simple utility for managing auth tokens in localStorage
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

export const isAuthenticated = () => {
  return !!getToken();
};

// Simplified API client wrapper
export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const headers = {
    ...options.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(endpoint, config);
  
  if (response.status === 401) {
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  return response;
};
