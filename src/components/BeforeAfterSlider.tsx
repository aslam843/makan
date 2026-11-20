import { MoveHorizontal } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';
import { ASSET_IMAGES } from '../lib/formatters';
import { SmartImage } from './SmartImage';

interface AuditFacet {
  id: string;
  label: string;
  brochureClaim: string;
  realityFinding: string;
  metricLabel: string;
  brochureMetric: string;
  realityMetric: string;
}

const AUDIT_FACETS: AuditFacet[] = [
  {
    id: 'surroundings',
    label: 'Views & Density',
    brochureClaim: 'Artists’ impression depicts uninterrupted parkland vistas and spacious open greens on all four sides.',
    realityFinding:
      'Physical site audit reveals an adjacent 22-storey tower just 16 metres away on the west wing, blocking afternoon sun below the 9th floor.',
    metricLabel: 'Tower-to-Tower Setback',
    brochureMetric: 'Open Park Render',
    realityMetric: '16m Adjacent Wall',
  },
  {
    id: 'floorplans',
    label: 'Floor Plans',
    brochureClaim: 'Marketed as a spacious 1,920 sq.ft. 3 BHK luxury layout with oversized room proportions.',
    realityFinding:
      'CAD audit shows 34% loading factor and a 98 sq.ft. dark corridor—leaving only 1,265 sq.ft. RERA carpet area and a tight 9.5×10 ft third bedroom.',
    metricLabel: 'Usable Carpet Efficiency',
    brochureMetric: '1,920 sq.ft. SBA',
    realityMetric: '65.8% True Carpet',
  },
  {
    id: 'amenities',
    label: 'Project Amenities',
    brochureClaim: 'Resort-style 50,000 sq.ft. clubhouse with heated lap pool and co-working spaces.',
    realityFinding:
      'At 1,450 total flats, peak weekend pool & gym density equals 14 sq.ft. of clubhouse per resident, with handover slated 14 months after Phase 1.',
    metricLabel: 'Clubhouse per Unit',
    brochureMetric: '50,000 sq.ft. Total',
    realityMetric: '34 sq.ft. / Family',
  },
  {
    id: 'construction',
    label: 'Construction Quality',
    brochureClaim: 'Premium international finishes and superior structural engineering guaranteed.',
    realityFinding:
      'We inspect thermal glazing grade, Mivan joint waterproofing, plumbing shaft accessibility, and past seepage history across the builder’s delivered towers.',
    metricLabel: 'Seepage & Structural Audit',
    brochureMetric: 'Show-Flat Finish',
    realityMetric: 'Site Core Verification',
  },
];

export function BeforeAfterSlider() {
  const [position, setPosition] = useState(50);
  const [activeFacetId, setActiveFacetId] = useState<string>(AUDIT_FACETS[0].id);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const activeFacet = AUDIT_FACETS.find((f) => f.id === activeFacetId) || AUDIT_FACETS[0];

  const updatePositionFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(4, Math.min(96, pct)));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updatePositionFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updatePositionFromClientX(e.clientX);
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') setPosition((p) => Math.max(4, p - 4));
    if (e.key === 'ArrowRight') setPosition((p) => Math.min(96, p + 4));
  };

  return (
    <div className="space-y-8">
      {/* Interactive Audit Dimension Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        {AUDIT_FACETS.map((facet) => (
          <button
            key={facet.id}
            type="button"
            onClick={() => setActiveFacetId(facet.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeFacetId === facet.id
                ? 'bg-slate-950 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {facet.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Draggable Comparison Slider */}
        <div className="lg:col-span-8">
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-slate-200 select-none touch-none cursor-ew-resize bg-slate-900"
          >
            {/* Base layer: Ground Reality (right side revealed as handle moves left) */}
            <SmartImage
              src={ASSET_IMAGES.reality}
              alt="Actual ground reality site inspection showing neighbouring towers and true spacing"
              fallbackTitle="Site Reality View"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Clipped top layer: Glossy Brochure (left side) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
              <SmartImage
                src={ASSET_IMAGES.brochure}
                alt="Glossy developer marketing brochure show-flat interior render"
                fallbackTitle="Marketing Brochure View"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Subtle top labels with high-contrast scrim */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-md bg-slate-950/80 text-white text-xs font-semibold tracking-wide pointer-events-none">
              Marketing Brochure
            </div>
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-md bg-[#4B5563] text-white text-xs font-semibold tracking-wide pointer-events-none">
              MAKANI Site Reality
            </div>

            {/* Divider vertical hairline + draggable handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md pointer-events-none"
              style={{ left: `${position}%` }}
            />
            <div
              role="slider"
              tabIndex={0}
              aria-label="Drag to compare marketing brochure with ground reality"
              aria-valuemin={4}
              aria-valuemax={96}
              aria-valuenow={Math.round(position)}
              onKeyDown={handleKeyDown}
              style={{ left: `${position}%` }}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-slate-950 border-2 border-[#4B5563] shadow-lg flex items-center justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4B5563]/40"
            >
              <MoveHorizontal className="w-5 h-5" />
            </div>

            <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none">
              <span className="inline-block px-3 py-1 rounded-md bg-slate-950/75 text-white/90 text-xs">
                Drag slider left or right to reveal site reality
              </span>
            </div>
          </div>
        </div>

        {/* Audit Findings Panel */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="text-xs font-medium text-slate-500">
              Reality Audit · {activeFacet.label}
            </div>

            <div className="space-y-2 pb-5 border-b border-slate-100">
              <div className="text-xs font-semibold text-slate-500">What the Brochure Highlights</div>
              <p className="text-sm text-slate-600 leading-relaxed">{activeFacet.brochureClaim}</p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-[#4B5563]">What MAKANI Audits Show</div>
              <p className="text-sm text-slate-900 font-medium leading-relaxed">
                {activeFacet.realityFinding}
              </p>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100 space-y-3">
            <div className="text-xs text-slate-500">{activeFacet.metricLabel}</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <div className="text-[11px] text-slate-500">Brochure</div>
                <div className="text-xs font-semibold text-slate-700 mt-0.5 tabular-nums">
                  {activeFacet.brochureMetric}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#F3F4F6] border border-[#4B5563]/25">
                <div className="text-[11px] text-[#374151]">Verified Reality</div>
                <div className="text-xs font-semibold text-slate-950 mt-0.5 tabular-nums">
                  {activeFacet.realityMetric}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
