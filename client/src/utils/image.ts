export const getImageUrl = (path?: string | null, size: string = 'w300'): string => {
  if (!path || path === 'N/A') return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `https://image.tmdb.org/t/p/${size}${cleanPath}`;
};
