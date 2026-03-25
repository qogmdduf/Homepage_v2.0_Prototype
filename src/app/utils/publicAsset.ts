const baseUrl = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export function publicAssetPath(path: string): string {
  if (/^(?:[a-z]+:)?\/\//i.test(path)) return path;

  const trimmed = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}${trimmed}`;
}
