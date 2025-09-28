const API_URL = import.meta.env.VITE_API_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export const fetchData = async (endpoint, options = {}) => {
  const method = (options.method || 'GET').toUpperCase();
  const defaultOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
    },
    ...(method !== 'GET' && options.body
      ? { body: JSON.stringify(options.body) }
      : {}),
  };

  try {
    const response = await fetch(`${API_URL}/${endpoint}`, defaultOptions);
    if (!response.ok) {
      throw new Error(
        `Request failed: ${response.status} ${response.statusText}`,
      );
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Network or fetch error: ${error.message}`);
  }
};
