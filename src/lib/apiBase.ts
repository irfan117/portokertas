export function getApiBase() {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL;
  if (configuredUrl) return `${configuredUrl.replace(/\/$/, '')}/api`;

  return '/api';
}
