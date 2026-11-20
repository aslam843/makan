import { ArrowRight, Check, Scale, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { formatPriceRange } from '../lib/formatters';
import type { EnrichedProperty } from '../shared/types';
import { SmartImage } from './SmartImage';

interface PropertyCardProps {
  property: EnrichedProperty;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { isInCompare, toggleCompareItem } = useAppContext();
  const compared = isInCompare(property.id);

  const bhkLabel = property.bhkOptions.map((n) => `${n} BHK`).join(', ');
  const topAmenities = property.amenities.slice(0, 3).map((a) => a.name);

  return (
    <article className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors overflow-hidden flex flex-col">
      <Link to={`/properties/${property.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-slate-100">
        <SmartImage
          src={property.heroImage}
          alt={`${property.name} in ${property.location.locality}, ${property.location.city}`}
          fallbackTitle={property.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/75 via-slate-950/25 to-transparent pointer-events-none" />
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/95 font-medium">
          <span className="truncate">{property.constructionStatus}</span>
          <span className="inline-flex items-center gap-1 tabular-nums shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {property.rating.toFixed(1)}
          </span>
        </div>
      </Link>

      <div className="p-5 flex-1 flex flex-col">
        {/* Clean unboxed quiet metadata kicker */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 truncate">
          <span>{property.location.locality}</span>
          <span aria-hidden="true">·</span>
          <span>{property.location.city}</span>
          <span aria-hidden="true">·</span>
          <span>{property.propertyType}</span>
        </div>

        <Link
          to={`/properties/${property.slug}`}
          className="text-lg font-semibold text-slate-950 hover:text-[#4B5563] transition-colors line-clamp-1"
        >
          {property.name}
        </Link>
        <p className="text-xs text-slate-500 mt-0.5">by {property.builder.name}</p>

        {/* Key numeric metrics with tabular numerals */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
          <div>
            <div className="text-[11px] text-slate-500">Price Range</div>
            <div className="text-sm font-semibold text-slate-950 tabular-nums mt-0.5">
              {formatPriceRange(property.minPriceLakhs, property.maxPriceLakhs)}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500">Configuration</div>
            <div className="text-sm font-medium text-slate-800 mt-0.5 truncate">{bhkLabel}</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500">Possession</div>
            <div className="text-xs font-medium text-slate-800 tabular-nums mt-0.5">
              {property.possessionDate}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500">Carpet Area</div>
            <div className="text-xs font-medium text-slate-800 tabular-nums mt-0.5">
              {property.minCarpetAreaSqFt.toLocaleString('en-IN')}–
              {property.maxCarpetAreaSqFt.toLocaleString('en-IN')} sq.ft.
            </div>
          </div>
        </div>

        {/* Clean unboxed amenities list */}
        <p className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 line-clamp-1">
          {topAmenities.join(' · ')}
          {property.amenities.length > 3 ? ` · +${property.amenities.length - 3} more` : ''}
        </p>

        {/* Actions */}
        <div className="mt-5 pt-3 flex items-center gap-2.5">
          <Link
            to={`/properties/${property.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
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
            aria-pressed={compared}
            className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
              compared
                ? 'bg-[#4B5563]/10 border-[#4B5563] text-[#374151]'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {compared ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
            {compared ? 'Added' : 'Compare'}
          </button>
        </div>
      </div>
    </article>
  );
}
