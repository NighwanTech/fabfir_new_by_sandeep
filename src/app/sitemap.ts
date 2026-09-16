import { MetadataRoute } from 'next';
import { homeData } from '@/data/dummy';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fabfitperformance.com';

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/assessment`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  let servicePages: MetadataRoute.Sitemap = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      const res = await fetch(`${apiUrl}/api/services?public=true`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const json = await res.json();
        const services = json.success ? json.data : json;
        if (Array.isArray(services)) {
          servicePages = services.map((s: any) => ({
            url: `${baseUrl}/services/${s.slug || s.id}`,
            lastModified: new Date(s.updatedAt || Date.now()),
            changeFrequency: 'weekly',
            priority: 0.8,
          }));
        }
      }
    }
  } catch (error) {
    // Fallback
  }

  if (servicePages.length === 0) {
    servicePages = (homeData.services?.items || []).map((s: any) => ({
      url: `${baseUrl}/services/${s.slug || s.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  }

  return [...staticPages, ...servicePages];
}
