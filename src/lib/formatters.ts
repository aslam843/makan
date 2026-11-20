import { useEffect } from 'react';

export const ASSET_IMAGES = {
  hero: '/src/assets/images/hero_residential_tower_1795195024534.jpg',
  brochure: '/src/assets/images/brochure_render_interior_1795195022403.jpg',
  reality: '/src/assets/images/reality_site_inspection_1795195025539.jpg',
  bengaluruLake: '/src/assets/images/property_bengaluru_lakeview_1795195023403.jpg',
  mumbaiSkyline: '/src/assets/images/property_mumbai_skyline_1795195022050.jpg',
  villaEnclave: '/src/assets/images/property_villa_enclave_1795195024000.jpg',
  urbanMidrise: '/src/assets/images/property_urban_midrise_1795195025066.jpg',
  couplePortrait: '/src/assets/images/testimonial_homebuyer_couple_1795195023998.jpg',
};

export function formatINR(lakhs: number): string {
  if (lakhs >= 100) {
    const cr = lakhs / 100;
    return `₹${cr.toFixed(cr % 1 === 0 ? 1 : 2)} Cr`;
  }
  return `₹${Math.round(lakhs)} L`;
}

export function formatPriceRange(minLakhs: number, maxLakhs: number): string {
  if (minLakhs === maxLakhs) return formatINR(minLakhs);
  return `${formatINR(minLakhs)} – ${formatINR(maxLakhs)}`;
}

export function formatNumberIN(value: number): string {
  return value.toLocaleString('en-IN');
}

export function formatDateReadable(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function usePageSEO(
  title: string,
  description: string,
  structuredData?: Record<string, unknown> | null
) {
  useEffect(() => {
    document.title = title;
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    const scriptId = 'dynamic-page-jsonld';
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();

    if (structuredData) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => {
      const s = document.getElementById(scriptId);
      if (s) s.remove();
    };
  }, [title, description, structuredData]);
}
