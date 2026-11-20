import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Compass,
  MapPin,
  Scale,
  ShieldCheck,
  Star,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PropertyCard } from '../components/PropertyCard';
import { SmartImage } from '../components/SmartImage';
import { useAppContext } from '../context/AppContext';
import { formatINR, formatPriceRange, usePageSEO } from '../lib/formatters';
import type { EnrichedProperty } from '../shared/types';

export function PropertyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { openLeadModal, toggleCompareItem, isInCompare } = useAppContext();

  const [property, setProperty] = useState<EnrichedProperty | null>(null);
  const [similar, setSimilar] = useState<EnrichedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activePlanIdx, setActivePlanIdx] = useState(0);

  // Inline enquiry form state
  const [enqName, setEnqName] = useState('');
  const [enqMobile, setEnqMobile] = useState('');
  const [enqEmail, setEnqEmail] = useState('');
  const [enqNotes, setEnqNotes] = useState('');
  const [enqError, setEnqError] = useState<string | null>(null);
  const [enqSubmitting, setEnqSubmitting] = useState(false);
  const [enqRef, setEnqRef] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);
    setActiveImageIdx(0);
    setActivePlanIdx(0);
    setEnqRef(null);

    fetch(`/api/properties/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Property not found');
        return res.json();
      })
      .then((data) => {
        setProperty(data.property);
        setSimilar(Array.isArray(data.similar) ? data.similar : []);
      })
      .catch(() => setError('We could not find that property listing.'))
      .finally(() => setLoading(false));
  }, [slug]);

  const structuredData = useMemo(() => {
    if (!property) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: property.name,
      description: property.overview,
      address: {
        '@type': 'PostalAddress',
        addressLocality: property.location.locality,
        addressRegion: property.location.city,
        addressCountry: 'IN',
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'INR',
        lowPrice: property.minPriceLakhs * 100000,
        highPrice: property.maxPriceLakhs * 100000,
      },
    };
  }, [property]);

  usePageSEO(
    property ? `${property.name}, ${property.location.locality} | MAKANI` : 'Property Details | MAKANI',
    property
      ? `${property.name} by ${property.builder.name} in ${property.location.locality}, ${property.location.city}. RERA verified pricing, floor plans, pros & cons.`
      : 'Detailed property audit and RERA verification by MAKANI.',
    structuredData
  );

  const handleInlineEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnqError(null);
    if (!property) return;

    const digits = enqMobile.replace(/\D/g, '');
    const norm = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
    if (enqName.trim().length < 2) {
      setEnqError('Please enter your full name.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(norm)) {
      setEnqError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enqEmail.trim())) {
      setEnqError('Enter a valid email address.');
      return;
    }

    setEnqSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: enqName,
          mobile: norm,
          email: enqEmail,
          preferredCity: property.location.city,
          preferredLocality: property.location.locality,
          budget: formatPriceRange(property.minPriceLakhs, property.maxPriceLakhs),
          configuration: property.floorPlans[activePlanIdx]?.configuration || '3 BHK',
          requirements: enqNotes || `Property enquiry for ${property.name}`,
          sourcePage: `/properties/${property.slug}`,
          propertySlug: property.slug,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEnqError(data.error || 'Could not submit enquiry.');
        return;
      }
      setEnqRef(data.lead?.referenceCode || 'CONFIRMED');
      setEnqName('');
      setEnqMobile('');
      setEnqEmail('');
      setEnqNotes('');
    } catch {
      setEnqError('Network error while submitting. Please try again.');
    } finally {
      setEnqSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-slate-200 rounded w-1/4" />
          <div className="h-10 bg-slate-200 rounded w-1/2" />
          <div className="aspect-[16/7] bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="font-editorial text-3xl font-semibold text-slate-950">Property Not Found</h1>
        <p className="text-sm text-slate-600">{error}</p>
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-950 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Explore Properties
        </Link>
      </div>
    );
  }

  const gallery = property.images.length > 0 ? property.images : [{ id: 'main', propertyId: property.id, url: property.heroImage, caption: property.name, type: 'exterior' as const }];
  const activePlan = property.floorPlans[activePlanIdx] || property.floorPlans[0];
  const compared = isInCompare(property.id);

  return (
    <div className="bg-slate-50 pb-24">
      {/* Top Breadcrumb & Summary Header */}
      <section className="bg-white border-b border-slate-200 pt-6 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-5">
            <Link to="/properties" className="hover:text-slate-950 inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Explore Properties
            </Link>
            <span>/</span>
            <span>{property.location.city}</span>
            <span>/</span>
            <span className="text-slate-900 font-medium">{property.name}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>{property.location.locality}, {property.location.city}</span>
                <span>·</span>
                <span>{property.constructionStatus}</span>
                <span>·</span>
                <span>RERA Verified</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1 text-slate-900 font-semibold tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {property.rating.toFixed(1)} / 5
                </span>
              </div>
              <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-slate-950">
                {property.name}
              </h1>
              <p className="text-sm text-slate-600">
                Developed by <span className="font-semibold text-slate-900">{property.builder.name}</span> ·{' '}
                {property.propertyType} · Possession: <span className="font-medium text-slate-900">{property.possessionDate}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="sm:text-right sm:mr-2">
                <div className="text-xs text-slate-500">All-Inclusive Range</div>
                <div className="font-editorial text-2xl font-semibold text-slate-950 tabular-nums">
                  {formatPriceRange(property.minPriceLakhs, property.maxPriceLakhs)}
                </div>
                <div className="text-xs text-slate-500 tabular-nums">
                  ₹{property.pricePerSqFt.toLocaleString('en-IN')} / sq.ft. avg
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  openLeadModal({
                    title: `Schedule Site Visit — ${property.name}`,
                    preferredCity: property.location.city,
                    preferredLocality: property.location.locality,
                    propertySlug: property.slug,
                    propertyName: property.name,
                    defaultRequirements: `Would like an advisor-accompanied site visit for ${property.name}.`,
                  })
                }
                className="px-5 py-3 text-sm font-semibold text-white bg-[#4B5563] hover:bg-[#374151] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                Schedule Site Visit
              </button>

              <button
                type="button"
                onClick={() =>
                  toggleCompareItem({
                    id: property.id,
                    slug: property.slug,
                    name: property.name,
                    locality: property.location.locality,
                    city: property.location.city,
                    heroImage: property.heroImage,
                  })
                }
                className={`inline-flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                  compared
                    ? 'bg-[#F3F4F6] border-[#4B5563] text-[#374151]'
                    : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
                }`}
              >
                {compared ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
                {compared ? 'Added to Compare' : 'Add to Compare'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 8 Columns: Gallery & Detailed Audit Sections */}
          <div className="lg:col-span-8 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="relative aspect-[16/10] bg-slate-100">
                <SmartImage
                  src={gallery[activeImageIdx]?.url || property.heroImage}
                  alt={gallery[activeImageIdx]?.caption || property.name}
                  priority
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-md bg-slate-950/75 text-white text-xs">
                    {gallery[activeImageIdx]?.caption}
                  </span>
                </div>
              </div>
              <div className="p-3 grid grid-cols-3 gap-3 bg-slate-50 border-t border-slate-100">
                {gallery.map((img, idx) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      idx === activeImageIdx ? 'border-[#4B5563]' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <SmartImage src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Project Overview & Key Metrics */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="font-editorial text-2xl font-semibold text-slate-950">Project Overview</h2>
                <p className="text-sm text-slate-600 leading-relaxed mt-3">{property.overview}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-slate-100">
                <div>
                  <div className="text-xs text-slate-500">Land Area</div>
                  <div className="text-base font-semibold text-slate-950 tabular-nums mt-0.5">
                    {property.landAreaAcres} Acres
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Total Units / Density</div>
                  <div className="text-base font-semibold text-slate-950 tabular-nums mt-0.5">
                    {property.totalUnits} ({property.densityUnitsPerAcre}/ac)
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Open Green Space</div>
                  <div className="text-base font-semibold text-slate-950 tabular-nums mt-0.5">
                    {property.openSpacePercent}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Clubhouse Area</div>
                  <div className="text-base font-semibold text-slate-950 tabular-nums mt-0.5">
                    {property.clubhouseAreaSqFt.toLocaleString('en-IN')} sq.ft.
                  </div>
                </div>
              </div>
            </section>

            {/* Honest Pros and Cons */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
              <div>
                <p className="text-xs font-medium text-[#4B5563]">Unbiased MAKANI Verdict</p>
                <h2 className="font-editorial text-2xl font-semibold text-slate-950 mt-1">
                  Pros &amp; Things to Watch Out For
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-emerald-50/50 border border-emerald-200/70 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    What Works Well
                  </div>
                  <ul className="space-y-2.5 text-sm text-slate-700">
                    {property.pros.map((pro) => (
                      <li key={pro} className="leading-relaxed">
                        • {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-950">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    Honest Trade-Offs
                  </div>
                  <ul className="space-y-2.5 text-sm text-slate-700">
                    {property.cons.map((con) => (
                      <li key={con} className="leading-relaxed">
                        • {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Interactive Floor Plans & Pricing */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-editorial text-2xl font-semibold text-slate-950">
                    Floor Plans &amp; Pricing Breakdown
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    RERA carpet area efficiency verified against sanctioned CAD drawings.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {property.floorPlans.map((fp, idx) => (
                    <button
                      key={fp.id}
                      type="button"
                      onClick={() => setActivePlanIdx(idx)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        idx === activePlanIdx
                          ? 'bg-slate-950 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {fp.configuration}
                    </button>
                  ))}
                </div>
              </div>

              {activePlan && (
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-5">
                  <div>
                    <div className="text-xs text-slate-500">Indicative Price</div>
                    <div className="text-lg font-semibold text-slate-950 tabular-nums mt-0.5">
                      {formatINR(activePlan.priceLakhs)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">RERA Carpet Area</div>
                    <div className="text-lg font-semibold text-slate-950 tabular-nums mt-0.5">
                      {activePlan.carpetAreaSqFt.toLocaleString('en-IN')} sq.ft.
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Super Built-Up</div>
                    <div className="text-base font-medium text-slate-800 tabular-nums mt-0.5">
                      {activePlan.superBuiltUpAreaSqFt.toLocaleString('en-IN')} sq.ft.
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Carpet Efficiency</div>
                    <div className="text-base font-semibold text-emerald-800 tabular-nums mt-0.5">
                      {activePlan.efficiencyRatio}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Vastu Facing</div>
                    <div className="text-sm font-medium text-slate-800 mt-0.5 inline-flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-slate-400" />
                      {activePlan.facing}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Bathrooms</div>
                    <div className="text-sm font-medium text-slate-800 tabular-nums mt-0.5">
                      {activePlan.bathrooms}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Balconies</div>
                    <div className="text-sm font-medium text-slate-800 tabular-nums mt-0.5">
                      {activePlan.balconies}
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() =>
                        openLeadModal({
                          title: `Request Cost Sheet — ${activePlan.configuration}`,
                          preferredCity: property.location.city,
                          preferredLocality: property.location.locality,
                          propertySlug: property.slug,
                          propertyName: property.name,
                          defaultRequirements: `Please share detailed all-inclusive cost sheet & CAD plan for ${property.name} (${activePlan.configuration}).`,
                        })
                      }
                      className="text-xs font-semibold text-[#4B5563] hover:text-[#374151] cursor-pointer"
                    >
                      Request CAD &amp; Cost Sheet →
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Amenities & Specifications */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-8">
              <div>
                <h2 className="font-editorial text-2xl font-semibold text-slate-950 mb-4">
                  Amenities ({property.amenities.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((am) => (
                    <div
                      key={am.id}
                      className="flex items-center gap-2 text-sm text-slate-700 py-2 border-b border-slate-100"
                    >
                      <Check className="w-4 h-4 text-[#4B5563] shrink-0" />
                      <span>{am.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-editorial text-2xl font-semibold text-slate-950 mb-4">
                  Construction Specifications
                </h2>
                <div className="divide-y divide-slate-100 border-y border-slate-100">
                  {property.specifications.map((spec) => (
                    <div
                      key={spec.label}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm"
                    >
                      <span className="text-slate-500">{spec.label}</span>
                      <span className="font-medium text-slate-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Location & Connectivity */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-editorial text-2xl font-semibold text-slate-950">
                    Location &amp; Connectivity
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">{property.location.livabilitySummary}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-500">Connectivity</div>
                  <div className="font-mono text-lg font-semibold text-slate-950 tabular-nums">
                    {property.location.connectivityScore}/10
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {property.connectivityHighlights.map((c) => (
                  <div
                    key={c.place}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MapPin className="w-4 h-4 text-[#4B5563] shrink-0" />
                      <span className="text-sm font-medium text-slate-900 truncate">{c.place}</span>
                    </div>
                    <span className="text-xs text-slate-600 tabular-nums whitespace-nowrap shrink-0">
                      {c.distance} · {c.driveTime}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Builder Information & RERA Verification */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h2 className="font-editorial text-xl font-semibold text-slate-950">
                    Builder Track Record
                  </h2>
                  <div className="text-base font-semibold text-slate-900">{property.builder.name}</div>
                  <p className="text-sm text-slate-600 leading-relaxed">{property.builder.summary}</p>
                  <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
                    <div>
                      <div className="text-slate-500">Since</div>
                      <div className="font-semibold text-slate-900 tabular-nums">
                        {property.builder.foundedYear}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">Delivered</div>
                      <div className="font-semibold text-slate-900 tabular-nums">
                        {property.builder.completedProjects} Projects
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">On-Time</div>
                      <div className="font-semibold text-emerald-800 tabular-nums">
                        {property.builder.onTimeDeliveryRate}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 md:border-l md:border-slate-100 md:pl-8">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    <h2 className="font-editorial text-xl font-semibold text-slate-950">
                      RERA &amp; Timeline
                    </h2>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-[11px] text-slate-500">RERA Registration ID</div>
                    <div className="font-mono text-xs font-medium text-slate-900 break-all">
                      {property.reraId}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-1">
                    <span className="text-slate-500 inline-flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" /> Construction Status
                    </span>
                    <span className="font-semibold text-slate-900">{property.constructionStatus}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Target Possession</span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      {property.possessionDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Investment Rating</span>
                    <span className="font-semibold text-[#4B5563] tabular-nums">
                      {property.investmentPotentialScore}/10
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right 4 Columns: Sticky Customer Enquiry Form & Advisory Actions */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <div>
                <h2 className="font-editorial text-xl font-semibold text-slate-950">
                  Request More Information
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Get the full Peace of Mind audit summary, all-inclusive cost sheet, and unbiased
                  negotiation guidance for {property.name}.
                </p>
              </div>

              {enqRef ? (
                <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-700 mx-auto" />
                  <div className="text-sm font-semibold text-emerald-950">Enquiry Received</div>
                  <p className="text-xs text-emerald-800">
                    Reference <span className="font-mono font-semibold">{enqRef}</span>. Our{' '}
                    {property.location.city} advisor will reach out shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInlineEnquiry} noValidate className="space-y-3.5">
                  {enqError && (
                    <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                      {enqError}
                    </div>
                  )}
                  <div>
                    <label htmlFor="enq-name" className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      id="enq-name"
                      type="text"
                      required
                      value={enqName}
                      onChange={(e) => setEnqName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#4B5563]"
                    />
                  </div>
                  <div>
                    <label htmlFor="enq-mobile" className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      id="enq-mobile"
                      type="tel"
                      required
                      value={enqMobile}
                      onChange={(e) => setEnqMobile(e.target.value)}
                      placeholder="10-digit Indian mobile"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 tabular-nums focus:outline-none focus:border-[#4B5563]"
                    />
                  </div>
                  <div>
                    <label htmlFor="enq-email" className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      id="enq-email"
                      type="email"
                      required
                      value={enqEmail}
                      onChange={(e) => setEnqEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#4B5563]"
                    />
                  </div>
                  <div>
                    <label htmlFor="enq-notes" className="block text-xs font-semibold text-slate-700 mb-1">
                      Questions / Preferred Floor
                    </label>
                    <textarea
                      id="enq-notes"
                      rows={2}
                      value={enqNotes}
                      onChange={(e) => setEnqNotes(e.target.value)}
                      placeholder="e.g., East-facing 3 BHK above 10th floor..."
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#4B5563]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={enqSubmitting}
                    className="w-full py-2.5 text-sm font-semibold text-white bg-[#4B5563] hover:bg-[#374151] disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
                  >
                    {enqSubmitting ? 'Submitting...' : 'Request Full Property Dossier'}
                  </button>
                </form>
              )}

              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <button
                  type="button"
                  onClick={() =>
                    openLeadModal({
                      title: `Schedule Site Visit — ${property.name}`,
                      preferredCity: property.location.city,
                      preferredLocality: property.location.locality,
                      propertySlug: property.slug,
                      propertyName: property.name,
                    })
                  }
                  className="w-full py-2.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Schedule Expert-Accompanied Site Visit
                </button>
                <p className="text-[11px] text-slate-500 text-center">
                  Zero-spam guarantee · We never share your phone number with builder sales desks.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar Properties */}
        {similar.length > 0 && (
          <section className="mt-16 pt-12 border-t border-slate-200">
            <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-slate-950 mb-6">
              More vetted homes in {property.location.city}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map((sim) => (
                <PropertyCard key={sim.id} property={sim} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
