export const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '');
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:3000';
};

export const fixImageUrl = (url: string | null | undefined): string => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return '/fabfit.jpeg';
  }

  // Active Cloudinary URLs
  if (url.includes('cloudinary.com')) {
    return url;
  }

  // Legacy dead backend URLs (Express on 5000, Render, old local /uploads/) fallback to high quality default
  if (
    url.includes('localhost:5000') ||
    url.includes('onrender.com') ||
    url.includes('/uploads/')
  ) {
    return '/fabfit.jpeg';
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  if (url.startsWith('/')) {
    return url;
  }

  return `/${url}`;
};


