import { RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PropertyCard } from '../components/PropertyCard';
import { useAppContext } from '../context/AppContext';
import { formatINR, usePageSEO } from '../lib/formatters';
import type { EnrichedProperty, FilterMetadata } from '../shared/types';

export function ExplorePropertiesPage() {
  usePageSEO(
    'Explore Vetted Properties in Bengaluru & Mumbai | MAKANI',
    'Discover RERA-verified apartments, villas, and row houses across Bengaluru and Mumbai. Filter by budget, BHK, possession date, builder, amenities, and Vastu.'
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const { openLeadModal } = useAppContext();

  const [meta, setMeta] = useState<FilterMetadata | null>(null);
  const [properties, setProperties] = useState<EnrichedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // All 12 filter dimensions + search + sort
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [city, setCity] = useState(searchParams.get('city') || 'All');
  const [locality, setLocality] = useState(searchParams.get('locality') || 'All');
  const [minBudget, setMinBudget] = useState(searchParams.get('minBudget') || '');
  const [maxBudget, setMaxBudget] = useState(searchParams.get('maxBudget') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || 'All');
  const [bhk, setBhk] = useState(searchParams.get('bhk') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [possessionYear, setPossessionYear] = useState(searchParams.get('possessionYear') || '');
  const [builder, setBuilder] = useState(searchParams.get('builder') || 'All');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    searchParams.get('amenities') ? searchParams.get('amenities')!.split(',').filter(Boolean) : []
  );
  const [projectSize, setProjectSize] = useState(searchParams.get('projectSize') || 'All');
  const [vastu, setVastu] = useState(searchParams.get('vastu') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'popularity');

  useEffect(() => {
    fetch('/api/properties/meta')
      .then((r) => r.json())
      .then((d: FilterMetadata) => setMeta(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (city !== 'All') params.set('city', city);
    if (locality !== 'All') params.set('locality', locality);
    if (minBudget) params.set('minBudget', minBudget);
    if (maxBudget) params.set('maxBudget', maxBudget);
    if (propertyType !== 'All') params.set('propertyType', propertyType);
    if (bhk) params.set('bhk', bhk);
    if (status !== 'All') params.set('status', status);
    if (possessionYear) params.set('possessionYear', possessionYear);
    if (builder !== 'All') params.set('builder', builder);
    if (selectedAmenities.length > 0) params.set('amenities', selectedAmenities.join(','));
    if (projectSize !== 'All') params.set('projectSize', projectSize);
    if (vastu !== 'All') params.set('vastu', vastu);
    if (sort !== 'popularity') params.set('sort', sort);

    setSearchParams(params, { replace: true });

    let cancelled = false;
    setLoading(true);
    fetch(`/api/properties?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          setProperties(Array.isArray(d.properties) ? d.properties : []);
        }
      })
      .catch(() => {
        if (!cancelled) setProperties([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    q,
    city,
    locality,
    minBudget,
    maxBudget,
    propertyType,
    bhk,
    status,
    possessionYear,
    builder,
    selectedAmenities,
    projectSize,
    vastu,
    sort,
    setSearchParams,
  ]);

  const availableLocalities =
    meta && city !== 'All'
      ? meta.localitiesByCity[city] || []
      : meta
      ? Object.values(meta.localitiesByCity).flat()
      : [];

  const handleCityChange = (nextCity: string) => {
    setCity(nextCity);
    setLocality('All');
  };

  const toggleAmenity = (amId: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amId) ? prev.filter((id) => id !== amId) : [...prev, amId]
    );
  };

  const resetAllFilters = () => {
    setQ('');
    setCity('All');
    setLocality('All');
    setMinBudget('');
    setMaxBudget('');
    setPropertyType('All');
    setBhk('');
    setStatus('All');
    setPossessionYear('');
    setBuilder('All');
    setSelectedAmenities([]);
    setProjectSize('All');
    setVastu('All');
    setSort('popularity');
  };

  const activeFilterCount = [
    city !== 'All',
    locality !== 'All',
    Boolean(minBudget),
    Boolean(maxBudget),
    propertyType !== 'All',
    Boolean(bhk),
    status !== 'All',
    Boolean(possessionYear),
    builder !== 'All',
    selectedAmenities.length > 0,
    projectSize !== 'All',
    vastu !== 'All',
  ].filter(Boolean).length;

  const FilterControls = (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <h2 className="text-sm font-semibold text-slate-950">
          Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
        </h2>
        <button
          type="button"
          onClick={resetAllFilters}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#4B5563] hover:text-[#374151] cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset all
        </button>
      </div>

      {/* City */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">City</label>
        <div className="grid grid-cols-3 gap-1.5">
          {['All', 'Bengaluru', 'Mumbai'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => handleCityChange(c)}
              className={`py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                city === c
                  ? 'bg-slate-950 text-white border-slate-950'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Locality */}
      <div>
        <label htmlFor="filter-locality" className="block text-xs font-semibold text-slate-700 mb-1.5">
          Locality
        </label>
        <select
          id="filter-locality"
          value={locality}
          onChange={(e) => setLocality(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#4B5563]"
        >
          <option value="All">All Localities</option>
          {availableLocalities.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Min & Max Budget */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Budget Range (INR)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <select
            aria-label="Minimum Budget"
            value={minBudget}
            onChange={(e) => setMinBudget(e.target.value)}
            className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-200 bg-white tabular-nums"
          >
            <option value="">Min Budget</option>
            {[100, 150, 200, 300, 400, 500, 800].map((v) => (
              <option key={v} value={String(v)}>
                {formatINR(v)}
              </option>
            ))}
          </select>
          <select
            aria-label="Maximum Budget"
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
            className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-200 bg-white tabular-nums"
          >
            <option value="">Max Budget</option>
            {[150, 200, 300, 450, 600, 900, 1500].map((v) => (
              <option key={v} value={String(v)}>
                {formatINR(v)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* BHK Configuration */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          BHK Configuration
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: 'Any', value: '' },
            { label: '2 BHK', value: '2' },
            { label: '3 BHK', value: '3' },
            { label: '4 BHK', value: '4' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setBhk(item.value)}
              className={`py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                bhk === item.value
                  ? 'bg-slate-950 text-white border-slate-950'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div>
        <label htmlFor="filter-type" className="block text-xs font-semibold text-slate-700 mb-1.5">
          Property Type
        </label>
        <select
          id="filter-type"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
        >
          <option value="All">All Property Types</option>
          {(meta?.propertyTypes || ['Apartment', 'Villa', 'Row House', 'Penthouse']).map((pt) => (
            <option key={pt} value={pt}>
              {pt}
            </option>
          ))}
        </select>
      </div>

      {/* Construction Status */}
      <div>
        <label htmlFor="filter-status" className="block text-xs font-semibold text-slate-700 mb-1.5">
          Construction Status
        </label>
        <select
          id="filter-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
        >
          <option value="All">Any Status</option>
          {(meta?.constructionStatuses || ['Ready to Move', 'Under Construction', 'New Launch']).map(
            (st) => (
              <option key={st} value={st}>
                {st}
              </option>
            )
          )}
        </select>
      </div>

      {/* Possession Date */}
      <div>
        <label htmlFor="filter-possession" className="block text-xs font-semibold text-slate-700 mb-1.5">
          Possession By
        </label>
        <select
          id="filter-possession"
          value={possessionYear}
          onChange={(e) => setPossessionYear(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white tabular-nums"
        >
          <option value="">Any Possession Date</option>
          <option value="2026">Ready Now (2026)</option>
          <option value="2027">By Dec 2027</option>
          <option value="2028">By Dec 2028</option>
          <option value="2029">By Dec 2029</option>
        </select>
      </div>

      {/* Builder */}
      <div>
        <label htmlFor="filter-builder" className="block text-xs font-semibold text-slate-700 mb-1.5">
          Builder
        </label>
        <select
          id="filter-builder"
          value={builder}
          onChange={(e) => setBuilder(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
        >
          <option value="All">All Vetted Builders</option>
          {(meta?.builders || []).map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Project Size */}
      <div>
        <label htmlFor="filter-size" className="block text-xs font-semibold text-slate-700 mb-1.5">
          Project Size
        </label>
        <select
          id="filter-size"
          value={projectSize}
          onChange={(e) => setProjectSize(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
        >
          <option value="All">Any Scale</option>
          {(meta?.projectSizes || []).map((sz) => (
            <option key={sz} value={sz}>
              {sz}
            </option>
          ))}
        </select>
      </div>

      {/* Vastu Direction */}
      <div>
        <label htmlFor="filter-vastu" className="block text-xs font-semibold text-slate-700 mb-1.5">
          Vastu Direction
        </label>
        <select
          id="filter-vastu"
          value={vastu}
          onChange={(e) => setVastu(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
        >
          <option value="All">Any Facing</option>
          {(meta?.vastuDirections || ['East', 'North', 'North-East', 'West', 'South-East']).map(
            (v) => (
              <option key={v} value={v}>
                {v} Facing
              </option>
            )
          )}
        </select>
      </div>

      {/* Amenities */}
      {meta && (
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">Key Amenities</label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {meta.amenities.slice(0, 10).map((am) => (
              <label key={am.id} className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(am.id)}
                  onChange={() => toggleAmenity(am.id)}
                  className="rounded border-slate-300 text-[#4B5563] focus:ring-[#4B5563]"
                />
                <span>{am.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Page Header */}
      <section className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-[#4B5563] mb-1.5">
                Curated Primary Residences · RERA Verified
              </p>
              <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-slate-950">
                Explore Vetted Properties
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl">
                Every project listed here has been audited by our architects for floor-plan
                efficiency, builder delivery track record, and clear RERA documentation.
              </p>
            </div>

            {/* Search + Sort Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search project, builder, locality..."
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#4B5563]"
                />
              </div>

              <select
                aria-label="Sort properties"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3.5 py-2.5 text-sm font-medium bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#4B5563]"
              >
                <option value="popularity">Sort: Popularity</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="new_launch">Sort: New Launch</option>
                <option value="possession_asc">Possession: Earliest First</option>
              </select>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-slate-950 text-white rounded-lg cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-xl border border-slate-200 p-5 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
            {FilterControls}
          </aside>

          {/* Property Listing Results */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
              <div className="tabular-nums">
                Showing <span className="font-semibold text-slate-950">{properties.length}</span>{' '}
                {properties.length === 1 ? 'property' : 'properties'}
                {city !== 'All' ? ` in ${city}` : ''}
                {locality !== 'All' ? ` · ${locality}` : ''}
              </div>
              <button
                type="button"
                onClick={() =>
                  openLeadModal({
                    title: 'Get a Custom Shortlist in 24 Hours',
                    preferredCity: city !== 'All' ? city : 'Bengaluru',
                  })
                }
                className="text-xs font-semibold text-[#4B5563] hover:text-[#374151] cursor-pointer"
              >
                Need help shortlisting? Talk to an advisor →
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse"
                  >
                    <div className="aspect-[4/3] bg-slate-200" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                      <div className="h-5 bg-slate-200 rounded w-3/4" />
                      <div className="h-10 bg-slate-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
                <h3 className="font-editorial text-2xl font-semibold text-slate-950">
                  No exact matches for those filters
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Try widening your budget range, clearing a few amenity checkboxes, or ask our
                  advisory team to pull off-market inventory matching your brief.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="px-5 py-2.5 text-sm font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    Reset Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => openLeadModal({ title: 'Request Custom Property Search' })}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-[#4B5563] hover:bg-[#374151] rounded-lg cursor-pointer"
                  >
                    Ask an Advisor
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-slate-950/60">
          <div className="w-full max-w-sm bg-white h-full overflow-y-auto p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                <span className="font-semibold text-slate-950">Filter Properties</span>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  aria-label="Close filters"
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {FilterControls}
            </div>
            <div className="pt-5 mt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 text-sm font-semibold text-white bg-[#4B5563] rounded-lg"
              >
                Show {properties.length} Properties
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
