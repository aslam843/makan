import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SmartImage } from '../components/SmartImage';
import { useAppContext } from '../context/AppContext';
import { ASSET_IMAGES, usePageSEO } from '../lib/formatters';

const PRINCIPLES = [
  {
    number: '01',
    title: 'Lead With Trade-Offs First',
    body: 'Every developer brochure highlights amenities. Our advisors begin every walkthrough by documenting structural constraints, approach road widths, and surrounding land-use risks.',
  },
  {
    number: '02',
    title: 'Salaried, Trained Professionals',
    body: 'MAKANI advisors are licensed architects, civil engineers, and financial analysts compensated on buyer satisfaction—never individual project-specific commission bonuses.',
  },
  {
    number: '03',
    title: 'Registered Transaction Truth',
    body: 'We benchmark pricing against sub-registrar sale deeds and RERA filings rather than inflated asking rates on classifieds portals.',
  },
  {
    number: '04',
    title: 'Zero-Spam Privacy Charter',
    body: 'Your contact details stay encrypted inside MAKANI and are never sold or shared with third-party agents or developer call centres.',
  },
];

const LEADERSHIP = [
  {
    name: 'Ar. Devika Menon',
    role: 'Co-Founder & Head of Architectural Audits',
    bio: '14 years in residential urban design and high-rise spatial audits across Bengaluru and Singapore. Designed MAKANI’s 80-point livability framework.',
  },
  {
    name: 'Karthik Narayanan',
    role: 'Co-Founder & Lead Real Estate Economist',
    bio: 'Former institutional real-estate private equity analyst overseeing micro-market valuation models, builder escrow health checks, and negotiation playbooks.',
  },
  {
    name: 'Adv. Nandini Rao',
    role: 'Head of Legal & RERA Verification',
    bio: 'Real estate property counsel specializing in Karnataka RERA, MahaRERA compliance, land title chains, and Joint Development Agreements.',
  },
];

export function AboutPage() {
  usePageSEO(
    'About MAKANI — India’s Intelligent Real Estate Advisory',
    'Learn how MAKANI’s architects, legal analysts, and real estate economists are replacing high-pressure brokerage with unbiased homebuyer advisory.'
  );

  const { openLeadModal } = useAppContext();

  return (
    <div className="bg-white pb-24">
      <section className="bg-slate-50 border-b border-slate-200 py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <p className="text-sm font-medium text-[#4B5563]">About MAKANI</p>
              <h1 className="font-editorial text-3xl sm:text-5xl font-semibold text-slate-950 leading-tight">
                Rebuilding home buying around truth, architecture, and data.
              </h1>
              <p className="text-base text-slate-600 leading-relaxed">
                Buying a home is the largest financial decision most Indian families make—yet the
                industry has historically left buyers navigating glossy brochures, unverified claims,
                and relentless spam calls. MAKANI was founded to put institutional-grade research
                on the homebuyer’s side of the table.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => openLeadModal({ title: 'Meet Your Dedicated Advisor' })}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#4B5563] hover:bg-[#374151] rounded-lg transition-colors cursor-pointer"
              >
                Book a Free Call <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Explore Vetted Projects
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[300px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <SmartImage
                src={ASSET_IMAGES.couplePortrait}
                alt="Happy Indian homebuyers inside their sunlit apartment"
                priority
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Operating Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-b border-slate-100">
        <div className="max-w-2xl mb-10">
          <p className="text-sm font-medium text-[#4B5563] mb-2">Our Fiduciary Charter</p>
          <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-slate-950">
            Four non-negotiable standards we hold ourselves to
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRINCIPLES.map((p) => (
            <div key={p.number} className="p-7 rounded-xl border border-slate-200 bg-white space-y-2.5">
              <div className="text-xs font-mono text-[#4B5563] font-semibold">{p.number}</div>
              <h3 className="text-lg font-semibold text-slate-950">{p.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-2xl mb-10">
          <p className="text-sm font-medium text-[#4B5563] mb-2">Research &amp; Advisory Leadership</p>
          <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-slate-950">
            Architects, economists, and legal minds—not brokers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LEADERSHIP.map((person) => (
            <div key={person.name} className="p-6 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div>
                <h3 className="text-base font-semibold text-slate-950">{person.name}</h3>
                <p className="text-xs font-medium text-[#4B5563] mt-0.5">{person.role}</p>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{person.bio}</p>
              <div className="pt-2 flex items-center gap-1.5 text-xs text-slate-500">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>RERA Certified Advisory Leadership</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
