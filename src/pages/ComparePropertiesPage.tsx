import { ArrowRight, Award, Plus, Scale, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SmartImage } from '../components/SmartImage';
import { useAppContext } from '../context/AppContext';
import { formatPriceRange, usePageSEO } from '../lib/formatters';
import type { ComparisonResponse, EnrichedProperty } from '../shared/types';

export function ComparePropertiesPage() {
  usePageSEO(
    'Compare Residential Projects Side-by-Side | MAKANI',
    'Compare up to 3 RERA-verified projects across pricing, carpet area, builder reputation, connectivity, floor plans, and investment potential.'
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const { compareList, openLeadModal } = useAppContext();

  const [allProperties, setAllProperties] = useState<EnrichedProperty[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const fromUrl = searchParams.get('ids');
    if (fromUrl) return fromUrl.split(',').filter(Boolean).slice(0, 3);
    if (compareList.length > 0) return compareList.map((c) => c.id).slice(0, 3);
    return ['prop-1', 'prop-5', 'prop-7'];
  });

  const [comparison, setComparison] = useState<ComparisonResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/properties')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.properties)) setAllProperties(d.properties);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const clean = selectedIds.filter(Boolean).slice(0, 3);
    if (clean.length > 0) {
      setSearchParams({ ids: clean.join(',') }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }

    if (clean.length === 0) {
      setComparison({
        properties: [],
        winners: {
          pricing: null,
          carpetArea: null,
          builderReputation: null,
          connectivity: null,
          amenities: null,
          possession: null,
          investmentPotential: null,
          openSpace: null,
        },
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/compare?ids=${clean.join(',')}`)
      .then((r) => r.json())
      .then((data: ComparisonResponse) => setComparison(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedIds, setSearchParams]);

  const handleSelectAtSlot = (slotIdx: number, propId: string) => {
    setSelectedIds((prev) => {
      const next = [...prev];
      if (!propId) {
        next.splice(slotIdx, 1);
      } else {
        next[slotIdx] = propId;
      }
      return Array.from(new Set(next.filter(Boolean))).slice(0, 3);
    });
  };

  const removeSlot = (id: string) => {
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const compared = comparison?.properties || [];
  const winners = comparison?.winners;

  const isWinner = (winnerId: string | null | undefined, propId: string) =>
    Boolean(winnerId && winnerId === propId && compared.length >= 2);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <section className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-[#4B5563] mb-1.5">
              Objective Side-by-Side Comparison
            </p>
            <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-slate-950">
              Compare Projects
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl">
              Select up to three vetted projects to compare pricing per sq.ft., usable RERA carpet
              area, builder on-time delivery, connectivity, legal standing, and investment potential.
              Best-in-class metrics are automatically highlighted.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              openLeadModal({
                title: 'Get a Custom 3-Project Peace of Mind Comparison',
                defaultRequirements: `Comparing: ${compared.map((p) => p.name).join(', ')}`,
              })
            }
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#4B5563] hover:bg-[#374151] rounded-lg transition-colors whitespace-nowrap self-start lg:self-auto cursor-pointer"
          >
            Discuss This Comparison With an Advisor
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Property Selector Slots (Up to 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[0, 1, 2].map((slotIdx) => {
            const currentId = selectedIds[slotIdx] || '';
            const prop = compared.find((p) => p.id === currentId);
            return (
              <div
                key={slotIdx}
                className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between gap-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Property 0{slotIdx + 1}
                  </span>
                  {prop && (
                    <button
                      type="button"
                      onClick={() => removeSlot(prop.id)}
                      aria-label={`Remove ${prop.name}`}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <select
                  aria-label={`Select property ${slotIdx + 1}`}
                  value={currentId}
                  onChange={(e) => handleSelectAtSlot(slotIdx, e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#4B5563]"
                >
                  <option value="">+ Select a project to compare...</option>
                  {allProperties.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                      disabled={selectedIds.includes(item.id) && item.id !== currentId}
                    >
                      {item.name} ({item.location.locality}, {item.location.city})
                    </option>
                  ))}
                </select>

                {prop ? (
                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                      <SmartImage
                        src={prop.heroImage}
                        alt={prop.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`/properties/${prop.slug}`}
                        className="text-sm font-semibold text-slate-950 hover:text-[#4B5563] truncate block"
                      >
                        {prop.name}
                      </Link>
                      <div className="text-xs text-slate-500 truncate">
                        {prop.location.locality} · {formatPriceRange(prop.minPriceLakhs, prop.maxPriceLakhs)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-3 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 border border-dashed border-slate-200 rounded-lg">
                    <Plus className="w-3.5 h-3.5" />
                    Choose a project from the dropdown
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Comparison Matrix Table */}
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-sm text-slate-500">
            Loading comparison metrics...
          </div>
        ) : compared.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
            <Scale className="w-8 h-8 text-slate-400 mx-auto" />
            <h2 className="font-editorial text-2xl font-semibold text-slate-950">
              Select properties to start comparing
            </h2>
            <p className="text-sm text-slate-600">
              Pick two or three properties above to see a structured side-by-side breakdown.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-4 px-5 text-xs font-semibold text-slate-500 w-52">
                    Comparison Criteria
                  </th>
                  {compared.map((p) => (
                    <th key={p.id} className="py-4 px-5 border-l border-slate-200">
                      <Link
                        to={`/properties/${p.slug}`}
                        className="text-base font-semibold text-slate-950 hover:text-[#4B5563]"
                      >
                        {p.name}
                      </Link>
                      <div className="text-xs font-normal text-slate-500 mt-0.5">
                        {p.builder.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {/* 1. Builder Reputation */}
                <tr>
                  <td className="py-4 px-5 font-semibold text-slate-800 bg-slate-50/50">
                    Builder Reputation
                  </td>
                  {compared.map((p) => {
                    const win = isWinner(winners?.builderReputation, p.id);
                    return (
                      <td
                        key={p.id}
                        className={`py-4 px-5 border-l border-slate-100 align-top ${
                          win ? 'bg-emerald-50/50' : ''
                        }`}
                      >
                        <div className="font-semibold text-slate-950 tabular-nums">
                          {p.builder.reputationScore}/5 · {p.builder.onTimeDeliveryRate}% On-Time
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {p.builder.completedProjects} delivered projects ({p.builder.tier})
                        </div>
                        {win && (
                          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 mt-1.5">
                            <Award className="w-3.5 h-3.5" /> Top Builder Track Record
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* 2. Location */}
                <tr>
                  <td className="py-4 px-5 font-semibold text-slate-800 bg-slate-50/50">
                    Location &amp; Micro-Market
                  </td>
                  {compared.map((p) => (
                    <td key={p.id} className="py-4 px-5 border-l border-slate-100 align-top">
                      <div className="font-medium text-slate-950">
                        {p.location.locality}, {p.location.city}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{p.location.microMarket}</div>
                    </td>
                  ))}
                </tr>

                {/* 3. Pricing */}
                <tr>
                  <td className="py-4 px-5 font-semibold text-slate-800 bg-slate-50/50">
                    Pricing &amp; Rate / sq.ft.
                  </td>
                  {compared.map((p) => {
                    const win = isWinner(winners?.pricing, p.id);
                    return (
                      <td
                        key={p.id}
                        className={`py-4 px-5 border-l border-slate-100 align-top ${
                          win ? 'bg-emerald-50/50' : ''
                        }`}
                      >
                        <div className="font-semibold text-slate-950 tabular-nums">
                          {formatPriceRange(p.minPriceLakhs, p.maxPriceLakhs)}
                        </div>
                        <div className="text-xs text-slate-500 tabular-nums mt-0.5">
                          ₹{p.pricePerSqFt.toLocaleString('en-IN')} / sq.ft. avg
                        </div>
                        {win && (
                          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 mt-1.5">
                            <Award className="w-3.5 h-3.5" /> Best Rate Value
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* 4. Carpet Area */}
                <tr>
                  <td className="py-4 px-5 font-semibold text-slate-800 bg-slate-50/50">
                    RERA Carpet Area
                  </td>
                  {compared.map((p) => {
                    const win = isWinner(winners?.carpetArea, p.id);
                    return (
                      <td
                        key={p.id}
                        className={`py-4 px-5 border-l border-slate-100 align-top ${
                          win ? 'bg-emerald-50/50' : ''
                        }`}
                      >
                        <div className="font-semibold text-slate-950 tabular-nums">
                          {p.minCarpetAreaSqFt.toLocaleString('en-IN')} –{' '}
                          {p.maxCarpetAreaSqFt.toLocaleString('en-IN')} sq.ft.
                        </div>
                        <div className="text-xs text-slate-500 tabular-nums mt-0.5">
                          Avg efficiency: {p.floorPlans[0]?.efficiencyRatio || 71}%
                        </div>
                        {win && (
                          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 mt-1.5">
                            <Award className="w-3.5 h-3.5" /> Largest Usable Carpet
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* 5. Configuration */}
                <tr>
                  <td className="py-4 px-5 font-semibold text-slate-800 bg-slate-50/50">
                    Configuration &amp; Type
                  </td>
                  {compared.map((p) => (
                    <td key={p.id} className="py-4 px-5 border-l border-slate-100 align-top">
                      <div className="font-medium text-slate-950">
                        {p.bhkOptions.map((n) => `${n} BHK`).join(', ')}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {p.propertyType} · {p.vastuDirections.join(', ')} Vastu
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 6. Possession Date */}
                <tr>
                  <td className="py-4 px-5 font-semibold text-slate-800 bg-slate-50/50">
                    Possession Date
                  </td>
                  {compared.map((p) => {
                    const win = isWinner(winners?.possession, p.id);
                    return (
                      <td
                        key={p.id}
                        className={`py-4 px-5 border-l border-slate-100 align-top ${
                          win ? 'bg-emerald-50/50' : ''
                        }`}
                      >
                        <div className="font-semibold text-slate-950 tabular-nums">
                          {p.possessionDate}
                        </div>
                        {win && (
                          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 mt-1">
                            <Award className="w-3.5 h-3.5" /> Earliest Handover
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* 7. Construction Status */}
                <tr>
                  <td className="py-4 px-5 font-semibold text-slate-800 bg-slate-50/50">
                    Construction Status
                  </td>
                  {compared.map((p) => (
                    <td key={p.id} className="py-4 px-5 border-l border-slate-100 align-top">
                      <div className="font-medium text-slate-950">{p.constructionStatus}</div>
                      <div className="text-xs text-slate-500 tabular-nums mt-0.5">
                        Density: {p.densityUnitsPerAcre} units/acre · {p.openSpacePercent}% open
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 8. Amenities */}
                <tr>
                  <td className="py-4 px-5 font-semibold text-slate-800 bg-slate-50/50">
                    Amenities &amp; Clubhouse
                  </td>
                  {compared.map((p) => {
                    const win = isWinner(winners?.amenities, p.id);
                    return (
                      <td
                        key={p.id}
                        className={`py-4 px-5 border-l border-slate-100 align-top ${
                          win ? 'bg-emerald-50/50' : ''
                        }`}
                      >
                        <div className="font-semibold text-slate-950 tabular-nums">
                          {p.amenities.length} Key Amenities ·{' '}
                          {p.clubhouseAreaSqFt.toLocaleString('en-IN')} sq.ft.
                        </div>
                        <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {p.amenities
                            .slice(0, 4)
                            .map((a) => a.name)
                            .join(' · ')}
                        </div>
                        {win && (
                          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 mt-1.5">
                            <Award className="w-3.5 h-3.5" /> Best Amenity Scale
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* 9. Connectivity */}
                <tr>
                  <td className="py-4 px-5 font-semibold text-slate-800 bg-slate-50/50">
                    Connectivity
                  </td>
                  {compared.map((p) => {
                    const win = isWinner(winners?.connectivity, p.id);
                    return (
                      <td
                        key={p.id}
                        className={`py-4 px-5 border-l border-slate-100 align-top ${
                          win ? 'bg-emerald-50/50' : ''
                        }`}
                      >
                        <div className="font-semibold text-slate-950 tabular-nums">
                          Score: {p.location.connectivityScore}/10
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 tabular-nums">
                          Metro: {p.location.nearestMetroKm} km ({p.location.nearestMetroName})
                        </div>
                        <div className="text-xs text-slate-500 tabular-nums">
                          Airport: {p.location.airportDistanceKm} km
                        </div>
                        {win && (
                          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 mt-1.5">
                            <Award className="w-3.5 h-3.5" /> Highest Connectivity
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* 10. Floor Plans */}
                <tr>
                  <td className="py-4 px-5 font-semibold text-slate-800 bg-slate-50/50">
                    Floor Plan Options
                  </td>
                  {compared.map((p) => (
                    <td key={p.id} className="py-4 px-5 border-l border-slate-100 align-top">
                      <ul className="space-y-1 text-xs text-slate-700 tabular-nums">
                        {p.floorPlans.map((fp) => (
                          <li key={fp.id}>
                            <span className="font-medium text-slate-900">{fp.configuration}:</span>{' '}
                            {fp.carpetAreaSqFt} sq.ft. ({fp.efficiencyRatio}%)
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* 11. Legal Information */}
                <tr>
                  <td className="py-4 px-5 font-semibold text-slate-800 bg-slate-50/50">
                    Legal &amp; RERA Status
                  </td>
                  {compared.map((p) => (
                    <td key={p.id} className="py-4 px-5 border-l border-slate-100 align-top">
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                        <ShieldCheck className="w-4 h-4" /> RERA Verified
                      </div>
                      <div className="font-mono text-[11px] text-slate-500 mt-1 break-all">
                        {p.reraId}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 12. Investment Potential */}
                <tr>
                  <td className="py-4 px-5 font-semibold text-slate-800 bg-slate-50/50">
                    Investment Potential
                  </td>
                  {compared.map((p) => {
                    const win = isWinner(winners?.investmentPotential, p.id);
                    return (
                      <td
                        key={p.id}
                        className={`py-4 px-5 border-l border-slate-100 align-top ${
                          win ? 'bg-emerald-50/50' : ''
                        }`}
                      >
                        <div className="font-semibold text-slate-950 tabular-nums">
                          {p.investmentPotentialScore}/10 · +{p.location.fiveYearAppreciation}% 5-yr
                          corridor growth
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {p.investmentVerdict}
                        </p>
                        {win && (
                          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 mt-1.5">
                            <Award className="w-3.5 h-3.5" /> Strongest Investment Score
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Actions Row */}
                <tr className="bg-slate-50/60">
                  <td className="py-4 px-5 text-xs font-semibold text-slate-500">Next Steps</td>
                  {compared.map((p) => (
                    <td key={p.id} className="py-4 px-5 border-l border-slate-100">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/properties/${p.slug}`}
                          className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg"
                        >
                          View Details
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            openLeadModal({
                              title: `Site Visit — ${p.name}`,
                              preferredCity: p.location.city,
                              preferredLocality: p.location.locality,
                              propertySlug: p.slug,
                              propertyName: p.name,
                            })
                          }
                          className="px-3.5 py-2 text-xs font-semibold text-[#4B5563] bg-white border border-[#4B5563]/30 hover:bg-[#F3F4F6] rounded-lg cursor-pointer"
                        >
                          Book Visit
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
