export type PropertyType = 'Apartment' | 'Villa' | 'Penthouse' | 'Row House';
export type ConstructionStatus = 'Ready to Move' | 'Under Construction' | 'New Launch';
export type ProjectSizeCategory = 'Boutique (< 2 Acres)' | 'Mid-Size (2–8 Acres)' | 'Township (8+ Acres)';
export type VastuDirection = 'East' | 'North' | 'North-East' | 'West' | 'South-East';

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: 'buyer' | 'advisor' | 'admin';
  preferredCity: string;
  createdAt: string;
}

export interface Builder {
  id: string;
  name: string;
  slug: string;
  foundedYear: number;
  headquarters: string;
  completedProjects: number;
  ongoingProjects: number;
  onTimeDeliveryRate: number; // percentage
  reputationScore: number; // out of 5
  tier: 'Tier 1' | 'Boutique Luxury' | 'Regional Leader';
  summary: string;
}

export interface Location {
  id: string;
  city: 'Bengaluru' | 'Mumbai';
  locality: string;
  microMarket: string;
  avgPricePerSqFt: number;
  fiveYearAppreciation: number; // percentage
  nearestMetroKm: number;
  nearestMetroName: string;
  airportDistanceKm: number;
  itHubDistanceKm: number;
  connectivityScore: number; // out of 10
  livabilitySummary: string;
}

export interface Amenity {
  id: string;
  name: string;
  category: 'Wellness' | 'Sports' | 'Community' | 'Sustainability' | 'Security';
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  url: string;
  caption: string;
  type: 'exterior' | 'interior' | 'amenity' | 'masterplan';
}

export interface FloorPlan {
  id: string;
  configuration: string; // e.g., "3 BHK + Study"
  bhk: number;
  carpetAreaSqFt: number;
  superBuiltUpAreaSqFt: number;
  efficiencyRatio: number; // percentage
  priceLakhs: number;
  facing: VastuDirection;
  balconies: number;
  bathrooms: number;
}

export interface Property {
  id: string;
  slug: string;
  name: string;
  builderId: string;
  locationId: string;
  propertyType: PropertyType;
  bhkOptions: number[];
  minPriceLakhs: number;
  maxPriceLakhs: number;
  pricePerSqFt: number;
  minCarpetAreaSqFt: number;
  maxCarpetAreaSqFt: number;
  constructionStatus: ConstructionStatus;
  possessionDate: string; // e.g., "Dec 2027"
  possessionYear: number;
  launchYear: number;
  landAreaAcres: number;
  projectSizeCategory: ProjectSizeCategory;
  totalUnits: number;
  densityUnitsPerAcre: number;
  openSpacePercent: number;
  vastuDirections: VastuDirection[];
  reraId: string;
  reraVerified: boolean;
  rating: number; // out of 5
  popularityScore: number; // 1-100
  investmentPotentialScore: number; // out of 10
  investmentVerdict: string;
  clubhouseAreaSqFt: number;
  amenityIds: string[];
  heroImage: string;
  overview: string;
  specifications: { label: string; value: string }[];
  pros: string[];
  cons: string[];
  floorPlans: FloorPlan[];
  connectivityHighlights: { place: string; distance: string; driveTime: string }[];
}

export interface EnrichedProperty extends Property {
  builder: Builder;
  location: Location;
  amenities: Amenity[];
  images: PropertyImage[];
}

export interface PropertyComparison {
  id: string;
  propertyIds: string[];
  createdAt: string;
}

export interface ComparisonWinnerMap {
  pricing: string | null;
  carpetArea: string | null;
  builderReputation: string | null;
  connectivity: string | null;
  amenities: string | null;
  possession: string | null;
  investmentPotential: string | null;
  openSpace: string | null;
}

export interface ComparisonResponse {
  properties: EnrichedProperty[];
  winners: ComparisonWinnerMap;
}

export interface Lead {
  id: string;
  referenceCode: string;
  fullName: string;
  mobile: string;
  email: string;
  preferredCity: string;
  preferredLocality: string;
  budget: string;
  configuration: string;
  requirements: string;
  sourcePage: string;
  propertySlug?: string;
  serviceSlug?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  designation: string;
  company: string;
  city: string;
  propertyBought: string;
  savingsAchieved: string;
  quote: string;
  fullStory: string;
  thumbnailUrl: string;
  videoDuration: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category:
    | 'Buying Guides'
    | 'Market Updates'
    | 'Legal Documentation'
    | 'Home Loans'
    | 'Location Analysis'
    | 'Investment Insights';
  excerpt: string;
  authorName: string;
  authorRole: string;
  publishedAt: string;
  readTimeMinutes: number;
  coverImage: string;
  keyTakeaways: string[];
  sections: { heading: string; body: string }[];
}

export interface FAQ {
  id: string;
  category: 'About the Service' | 'Fees' | 'Why Work With Us' | 'Trust';
  question: string;
  answer: string;
}

export interface ServiceDetail {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  summary: string;
  timeline: string;
  feeStructure: string;
  idealFor: string;
  heroImage: string;
  deliverables: { title: string; description: string }[];
  processSteps: { step: string; title: string; detail: string }[];
  outcomes: { metric: string; label: string }[];
}

export interface FilterMetadata {
  cities: string[];
  localitiesByCity: Record<string, string[]>;
  builders: { id: string; name: string }[];
  amenities: Amenity[];
  propertyTypes: PropertyType[];
  constructionStatuses: ConstructionStatus[];
  projectSizes: ProjectSizeCategory[];
  vastuDirections: VastuDirection[];
  possessionYears: number[];
}
