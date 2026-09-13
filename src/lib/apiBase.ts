export function getApiBase() {
  const configuredUrl = import.meta.env.VITE_API_URL;
  if (configuredUrl) return `${configuredUrl.replace(/\/$/, '')}/api`;

  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:4000/api';
  }

  return '/api';
}
