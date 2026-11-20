import fs from 'fs';
import path from 'path';
import type {
  BlogPost,
  ComparisonResponse,
  ComparisonWinnerMap,
  EnrichedProperty,
  FAQ,
  FilterMetadata,
  Lead,
  PropertyComparison,
  ServiceDetail,
  Testimonial,
} from '../shared/types';
import {
  PLATFORM_STATS,
  SEED_AMENITIES,
  SEED_BLOG_POSTS,
  SEED_BUILDERS,
  SEED_FAQS,
  SEED_LOCATIONS,
  SEED_PROPERTIES,
  SEED_PROPERTY_IMAGES,
  SEED_SERVICES,
  SEED_TESTIMONIALS,
} from './seedData';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const COMPARISONS_FILE = path.join(DATA_DIR, 'comparisons.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJsonFile<T>(filePath: string, data: T): void {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

const builderMap = new Map(SEED_BUILDERS.map((b) => [b.id, b]));
const locationMap = new Map(SEED_LOCATIONS.map((l) => [l.id, l]));
const amenityMap = new Map(SEED_AMENITIES.map((a) => [a.id, a]));

export function enrichProperty(propIdOrSlug: string): EnrichedProperty | null {
  const prop = SEED_PROPERTIES.find((p) => p.id === propIdOrSlug || p.slug === propIdOrSlug);
  if (!prop) return null;
  const builder = builderMap.get(prop.builderId)!;
  const location = locationMap.get(prop.locationId)!;
  const amenities = prop.amenityIds
    .map((id) => amenityMap.get(id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  const images = SEED_PROPERTY_IMAGES.filter((img) => img.propertyId === prop.id);
  return {
    ...prop,
    builder,
    location,
    amenities,
    images,
  };
}

export function getAllEnrichedProperties(): EnrichedProperty[] {
  return SEED_PROPERTIES.map((p) => enrichProperty(p.id)!);
}

export interface PropertyQueryFilters {
  q?: string;
  city?: string;
  locality?: string;
  minBudget?: number; // in Lakhs
  maxBudget?: number; // in Lakhs
  propertyType?: string;
  bhk?: number;
  status?: string;
  possessionYear?: number;
  builder?: string;
  amenities?: string[];
  projectSize?: string;
  vastu?: string;
  sort?: string;
}

export function queryProperties(filters: PropertyQueryFilters): EnrichedProperty[] {
  let list = getAllEnrichedProperties();

  if (filters.q && filters.q.trim()) {
    const term = filters.q.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.builder.name.toLowerCase().includes(term) ||
        p.location.locality.toLowerCase().includes(term) ||
        p.location.city.toLowerCase().includes(term) ||
        p.overview.toLowerCase().includes(term)
    );
  }

  if (filters.city && filters.city !== 'All') {
    list = list.filter((p) => p.location.city.toLowerCase() === filters.city!.toLowerCase());
  }

  if (filters.locality && filters.locality !== 'All') {
    list = list.filter((p) => p.location.locality.toLowerCase() === filters.locality!.toLowerCase());
  }

  if (typeof filters.minBudget === 'number' && !Number.isNaN(filters.minBudget)) {
    list = list.filter((p) => p.maxPriceLakhs >= filters.minBudget!);
  }

  if (typeof filters.maxBudget === 'number' && !Number.isNaN(filters.maxBudget)) {
    list = list.filter((p) => p.minPriceLakhs <= filters.maxBudget!);
  }

  if (filters.propertyType && filters.propertyType !== 'All') {
    list = list.filter((p) => p.propertyType === filters.propertyType);
  }

  if (typeof filters.bhk === 'number' && !Number.isNaN(filters.bhk)) {
    list = list.filter((p) => p.bhkOptions.includes(filters.bhk!));
  }

  if (filters.status && filters.status !== 'All') {
    list = list.filter((p) => p.constructionStatus === filters.status);
  }

  if (typeof filters.possessionYear === 'number' && !Number.isNaN(filters.possessionYear)) {
    list = list.filter((p) => p.possessionYear <= filters.possessionYear!);
  }

  if (filters.builder && filters.builder !== 'All') {
    list = list.filter((p) => p.builder.id === filters.builder || p.builder.name === filters.builder);
  }

  if (filters.amenities && filters.amenities.length > 0) {
    list = list.filter((p) => filters.amenities!.every((amId) => p.amenityIds.includes(amId)));
  }

  if (filters.projectSize && filters.projectSize !== 'All') {
    list = list.filter((p) => p.projectSizeCategory === filters.projectSize);
  }

  if (filters.vastu && filters.vastu !== 'All') {
    list = list.filter((p) => p.vastuDirections.includes(filters.vastu as never));
  }

  // Sorting
  switch (filters.sort) {
    case 'price_asc':
      list.sort((a, b) => a.minPriceLakhs - b.minPriceLakhs);
      break;
    case 'price_desc':
      list.sort((a, b) => b.minPriceLakhs - a.minPriceLakhs);
      break;
    case 'new_launch':
      list.sort((a, b) => b.launchYear - a.launchYear || b.popularityScore - a.popularityScore);
      break;
    case 'possession_asc':
      list.sort((a, b) => a.possessionYear - b.possessionYear);
      break;
    case 'popularity':
    default:
      list.sort((a, b) => b.popularityScore - a.popularityScore);
      break;
  }

  return list;
}

export function getFilterMetadata(): FilterMetadata {
  const cities = Array.from(new Set(SEED_LOCATIONS.map((l) => l.city)));
  const localitiesByCity: Record<string, string[]> = {};
  for (const city of cities) {
    localitiesByCity[city] = SEED_LOCATIONS.filter((l) => l.city === city).map((l) => l.locality);
  }
  const possessionYears = Array.from(new Set(SEED_PROPERTIES.map((p) => p.possessionYear))).sort((a, b) => a - b);

  return {
    cities,
    localitiesByCity,
    builders: SEED_BUILDERS.map((b) => ({ id: b.id, name: b.name })),
    amenities: SEED_AMENITIES,
    propertyTypes: ['Apartment', 'Villa', 'Row House', 'Penthouse'],
    constructionStatuses: ['Ready to Move', 'Under Construction', 'New Launch'],
    projectSizes: ['Boutique (< 2 Acres)', 'Mid-Size (2–8 Acres)', 'Township (8+ Acres)'],
    vastuDirections: ['East', 'North', 'North-East', 'West', 'South-East'],
    possessionYears,
  };
}

export function comparePropertiesByIds(ids: string[]): ComparisonResponse {
  const uniqueIds = Array.from(new Set(ids)).slice(0, 3);
  const properties = uniqueIds
    .map((id) => enrichProperty(id))
    .filter((p): p is EnrichedProperty => Boolean(p));

  const pickBest = (
    items: EnrichedProperty[],
    scorer: (p: EnrichedProperty) => number,
    higherIsBetter = true
  ): string | null => {
    if (items.length < 2) return null;
    let best = items[0];
    let bestVal = scorer(best);
    for (let i = 1; i < items.length; i++) {
      const val = scorer(items[i]);
      if (higherIsBetter ? val > bestVal : val < bestVal) {
        best = items[i];
        bestVal = val;
      }
    }
    // Check if all equal
    const allEqual = items.every((item) => scorer(item) === bestVal);
    return allEqual ? null : best.id;
  };

  const winners: ComparisonWinnerMap = {
    pricing: pickBest(properties, (p) => p.pricePerSqFt, false),
    carpetArea: pickBest(properties, (p) => p.maxCarpetAreaSqFt, true),
    builderReputation: pickBest(properties, (p) => p.builder.reputationScore * 100 + p.builder.onTimeDeliveryRate, true),
    connectivity: pickBest(properties, (p) => p.location.connectivityScore, true),
    amenities: pickBest(properties, (p) => p.amenities.length * 100000 + p.clubhouseAreaSqFt, true),
    possession: pickBest(properties, (p) => p.possessionYear, false),
    investmentPotential: pickBest(properties, (p) => p.investmentPotentialScore, true),
    openSpace: pickBest(properties, (p) => p.openSpacePercent, true),
  };

  if (properties.length >= 2) {
    const existing = readJsonFile<PropertyComparison[]>(COMPARISONS_FILE, []);
    const record: PropertyComparison = {
      id: `cmp-${Date.now()}`,
      propertyIds: properties.map((p) => p.id),
      createdAt: new Date().toISOString(),
    };
    writeJsonFile(COMPARISONS_FILE, [record, ...existing].slice(0, 100));
  }

  return { properties, winners };
}

export function createLead(input: Omit<Lead, 'id' | 'referenceCode' | 'createdAt'>): Lead {
  const leads = readJsonFile<Lead[]>(LEADS_FILE, []);
  const numericCode = String(100000 + Math.floor(Math.random() * 900000));
  const lead: Lead = {
    ...input,
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    referenceCode: `MKN-${numericCode}`,
    createdAt: new Date().toISOString(),
  };
  writeJsonFile(LEADS_FILE, [lead, ...leads]);
  return lead;
}

export function getLeads(): Lead[] {
  return readJsonFile<Lead[]>(LEADS_FILE, []);
}

export function getTestimonials(): Testimonial[] {
  return SEED_TESTIMONIALS;
}

export function getFaqs(category?: string): FAQ[] {
  if (!category || category === 'All') return SEED_FAQS;
  return SEED_FAQS.filter((f) => f.category === category);
}

export function getBlogs(category?: string, query?: string): BlogPost[] {
  let posts = [...SEED_BLOG_POSTS];
  if (category && category !== 'All') {
    posts = posts.filter((b) => b.category === category);
  }
  if (query && query.trim()) {
    const term = query.trim().toLowerCase();
    posts = posts.filter(
      (b) =>
        b.title.toLowerCase().includes(term) ||
        b.excerpt.toLowerCase().includes(term) ||
        b.category.toLowerCase().includes(term)
    );
  }
  return posts;
}

export function getBlogBySlug(slug: string): BlogPost | null {
  return SEED_BLOG_POSTS.find((b) => b.slug === slug) ?? null;
}

export function getServices(): ServiceDetail[] {
  return SEED_SERVICES;
}

export function getServiceBySlug(slug: string): ServiceDetail | null {
  return SEED_SERVICES.find((s) => s.slug === slug) ?? null;
}

export function getPlatformStats() {
  return PLATFORM_STATS;
}
