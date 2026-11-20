import { ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatINR } from '../lib/formatters';

const BENEFITS = [
  {
    title: 'Builder & Micro-Location Research',
    detail: '10-year delivery history, escrow health, groundwater profile, and metro proximity verified on-ground.',
  },
  {
    title: 'Honest Property Pros & Cons',
    detail: 'Every shortlist starts with red flags—loading factor, shadow cast, approach road, and future FSI density.',
  },
  {
    title: 'Financial Risk Assessment',
    detail: 'True all-inclusive cost sheets comparing GST, stamp duty, pre-EMI, and 5-year resale liquidity.',
  },
  {
    title: 'Data-Backed Negotiation Assistance',
    detail: 'Benchmark against recent registered transactions in the exact tower to waive floor-rise & PLC markups.',
  },
  {
    title: 'Dedicated Salaried Expert Advisory',
    detail: 'Architects and analysts paid to protect buyer satisfaction—zero high-pressure sales scripts.',
  },
  {
    title: 'Home Loan Spread Optimization',
    detail: 'Objective sanction comparison across SBI, HDFC, ICICI & Axis to trim 25–40 bps off mortgage rates.',
  },
];

export function SavingsCalculator() {
  const { openLeadModal } = useAppContext();
  const [budgetLakhs, setBudgetLakhs] = useState(240); // ₹2.4 Cr default
  const [city, setCity] = useState<'Bengaluru' | 'Mumbai'>('Bengaluru');

  // Conservative, realistic advisory savings calculations
  const negotiationSavings = Math.round(budgetLakhs * 0.042); // ~4.2% average cost-sheet savings
  const loanSpreadSavings = Math.round(budgetLakhs * 0.75 * 0.036); // 25 bps over 20yr loan
  const totalEstimatedSavings = negotiationSavings + loanSpreadSavings;
  const hoursSaved = city === 'Mumbai' ? 135 : 120;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left: Interactive Calculator */}
      <div className="lg:col-span-5 bg-slate-950 text-white rounded-2xl p-7 sm:p-8 flex flex-col justify-between space-y-8">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-medium text-[#D1D5DB] mb-2">Interactive Advisory Calculator</p>
            <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-white">
              Estimate your intelligent buying advantage
            </h3>
          </div>

          {/* City Segmented Switch */}
          <div>
            <div className="text-xs text-slate-400 mb-2">Target City</div>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800">
              {(['Bengaluru', 'Mumbai'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCity(c)}
                  className={`py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    city === c ? 'bg-white text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Slider */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <label htmlFor="budget-range" className="text-xs text-slate-400">
                Planned Home Budget
              </label>
              <span className="font-mono text-lg font-semibold text-white tabular-nums">
                {formatINR(budgetLakhs)}
              </span>
            </div>
            <input
              id="budget-range"
              type="range"
              min={100}
              max={1000}
              step={20}
              value={budgetLakhs}
              onChange={(e) => setBudgetLakhs(Number(e.target.value))}
              className="w-full accent-[#4B5563] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1 tabular-nums">
              <span>₹1 Cr</span>
              <span>₹5 Cr</span>
              <span>₹10 Cr</span>
            </div>
          </div>

          {/* Computed Breakdown */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-slate-300">Estimated Total Savings</span>
              <span className="font-editorial text-3xl font-semibold text-[#D1D5DB] tabular-nums">
                {formatINR(totalEstimatedSavings)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[11px] text-slate-400">Negotiation</div>
                <div className="text-sm font-semibold text-white tabular-nums mt-1">
                  {formatINR(negotiationSavings)}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[11px] text-slate-400">Loan Spread</div>
                <div className="text-sm font-semibold text-white tabular-nums mt-1">
                  {formatINR(loanSpreadSavings)}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[11px] text-slate-400">Time Saved</div>
                <div className="text-sm font-semibold text-white tabular-nums mt-1">
                  {hoursSaved}+ hrs
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() =>
              openLeadModal({
                title: 'Unlock Your Custom Savings Plan',
                preferredCity: city,
                defaultRequirements: `Target budget around ${formatINR(budgetLakhs)} in ${city}.`,
              })
            }
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#4B5563] hover:bg-[#374151] rounded-lg transition-colors cursor-pointer"
          >
            Book a Free Call
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[11px] text-slate-500 text-center">
            Based on historical MAKANI negotiation (3.5–5%) & 25 bps mortgage benchmarks across {city}.
          </p>
        </div>
      </div>

      {/* Right: 6 Intelligent Buying Pillars */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-7 sm:p-8 flex flex-col justify-between">
        <div>
          <p className="text-xs font-medium text-[#4B5563] mb-2">Why Intelligent Home Buying Pays Off</p>
          <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-slate-950">
            Every decision backed by architecture, law, and registered data
          </h3>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
            A single overlooked setback violation or inflated loading factor can erode ₹15–30 Lakhs of
            long-term equity. Our advisory desk protects both your lifestyle and capital.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 mt-8">
          {BENEFITS.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#F3F4F6] text-[#4B5563] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-950">{item.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
