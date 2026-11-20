import {
  ArrowRight,
  Building,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Compass,
  FileSearch,
  Handshake,
  ListChecks,
  Mail,
  MapPin,
  Phone,
  PhoneCall,
  Play,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { SavingsCalculator } from '../components/SavingsCalculator';
import { SmartImage } from '../components/SmartImage';
import { useAppContext } from '../context/AppContext';
import { ASSET_IMAGES, usePageSEO } from '../lib/formatters';
import type { FAQ, Testimonial } from '../shared/types';

const TRUSTED_COMPANIES = [
  'Google',
  'Microsoft',
  'Goldman Sachs',
  'Atlassian',
  'Flipkart',
  'Zerodha',
  'Razorpay',
  'Swiggy',
  'Amazon',
  'Adobe',
  'McKinsey & Co.',
  'Bain & Company',
];

interface ComparisonRow {
  parameter: string;
  ours: string;
  localBrokers: string;
  onlinePortals: string;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    parameter: 'Sales Practices',
    ours: 'Consultative, zero-pressure advisory',
    localBrokers: 'High pressure to close quickly',
    onlinePortals: 'Lead-selling call centre follow-ups',
  },
  {
    parameter: 'Transparency',
    ours: 'Detailed written pros and cons',
    localBrokers: 'Limited information; hides red flags',
    onlinePortals: 'Paid builder-sponsored listings',
  },
  {
    parameter: 'Project Curation',
    ours: 'Data-driven across 80+ parameters',
    localBrokers: 'Not curated; pushes high-commission stock',
    onlinePortals: 'Algorithmic ad-ranked clutter',
  },
  {
    parameter: 'Spam',
    ours: 'Strict zero-spam privacy charter',
    localBrokers: 'Frequent unsolicited follow-ups',
    onlinePortals: 'Number sold to 15–30 third-party agents',
  },
  {
    parameter: 'Post-sale Support',
    ours: 'End-to-end through registration & handover',
    localBrokers: 'Limited after token cheque',
    onlinePortals: 'None — stops at lead generation',
  },
  {
    parameter: 'Site Visits',
    ours: 'Expert-assisted with architectural audit',
    localBrokers: 'Chauffeur-style with limited expertise',
    onlinePortals: 'Self-coordinated with developer reps',
  },
  {
    parameter: 'Negotiation',
    ours: 'Research-backed using registered comps',
    localBrokers: 'Limited insights; favours builder margin',
    onlinePortals: 'No negotiation representation',
  },
  {
    parameter: 'Property Reports',
    ours: '45-page Peace of Mind dossier',
    localBrokers: 'Not available — verbal assurances only',
    onlinePortals: 'Generic brochure downloads',
  },
  {
    parameter: 'Advisors',
    ours: 'Salaried architects & trained analysts',
    localBrokers: 'Commission-driven sales representatives',
    onlinePortals: 'No dedicated advisor assigned',
  },
];

const JOURNEY_STEPS = [
  {
    day: 'Today',
    title: 'Quick Free Call',
    shortDesc: '20-minute alignment on your home goals, budget, and preferred commute.',
    detail:
      'Speak directly with a senior advisor to clarify budget realism, ready vs under-construction trade-offs, and micro-market suitability—before spending a single weekend on the road.',
    icon: PhoneCall,
    image: ASSET_IMAGES.couplePortrait,
    deliverable: 'City & budget feasibility summary',
  },
  {
    day: 'Week 1',
    title: 'Discovery Form',
    shortDesc: 'Capture non-negotiables: carpet area, schools, Vastu, and possession horizon.',
    detail:
      'Our structured 8-minute lifestyle brief maps every family priority—from sunlight direction and balcony depth to builder tier and financing plan—into an objective scoring matrix.',
    icon: ClipboardList,
    image: ASSET_IMAGES.brochure,
    deliverable: 'Weighted homebuyer scorecard',
  },
  {
    day: 'Week 1',
    title: 'Longlist Call',
    shortDesc: 'Review 6–8 vetted matches side by side with real pros, cons, and pricing.',
    detail:
      'Skip 40 irrelevant listings. We present a sharp longlist filtered from 640+ tracked projects, showing carpet efficiency, tower density, and registered sale prices upfront.',
    icon: ListChecks,
    image: ASSET_IMAGES.bengaluruLake,
    deliverable: 'Curated 6–8 project comparison matrix',
  },
  {
    day: 'Week 2',
    title: 'Property Site Visits',
    shortDesc: 'Accompanied on-site visits without leaking your number to sales desks.',
    detail:
      'Your advisor schedules private walkthroughs of your top 3 finalists, evaluates surrounding approach roads, water-drainage buffers, and grills builder teams on structural specifications.',
    icon: Compass,
    image: ASSET_IMAGES.urbanMidrise,
    deliverable: 'Guided site audit checklist',
  },
  {
    day: 'Week 3',
    title: 'Detailed Property Analysis',
    shortDesc: 'Receive an 80-point Peace of Mind Report on your top 1–2 choices.',
    detail:
      'Before paying any token, our architects and legal analysts audit CAD furniture layouts, natural ventilation, RERA escrow health, litigation records, and 5-year appreciation drivers.',
    icon: FileSearch,
    image: ASSET_IMAGES.villaEnclave,
    deliverable: '45-page Peace of Mind Property Report',
  },
  {
    day: 'Final Week',
    title: 'Negotiation & Closure',
    shortDesc: 'Data-backed cost-sheet negotiation, loan comparison, and clean allotment.',
    detail:
      'We benchmark your quote against closed deals in the same tower to negotiate floor-rise and PLC waivers, compare multi-bank home loan spreads, and review your Agreement for Sale.',
    icon: Handshake,
    image: ASSET_IMAGES.mumbaiSkyline,
    deliverable: 'Negotiated cost sheet & loan sanction',
  },
];

const MEDIA_FEATURES = [
  {
    outlet: 'The Economic Times',
    date: 'Sep 2026',
    headline: 'How architect-led advisory desks are replacing India’s high-pressure brokerage model.',
  },
  {
    outlet: 'Mint',
    date: 'Aug 2026',
    headline: 'Inside MAKANI’s 80-point property audit that exposes hidden carpet-area loading.',
  },
  {
    outlet: 'YourStory',
    date: 'Jul 2026',
    headline: 'Why Bengaluru and Mumbai tech homebuyers are refusing to share phone numbers on portals.',
  },
  {
    outlet: 'Moneycontrol',
    date: 'Oct 2026',
    headline: 'Data-backed negotiation: How salaried advisors help families save ₹10–18L per home.',
  },
  {
    outlet: 'Inc42',
    date: 'Jun 2026',
    headline: 'Proptech’s shift from classifieds to full-stack fiduciary homebuyer advisory.',
  },
  {
    outlet: 'Architectural Digest',
    date: 'Nov 2026',
    headline: 'Reading floor plans like an architect: daylight, cross-ventilation, and true livability.',
  },
];

const FAQ_CATEGORIES: FAQ['category'][] = [
  'About the Service',
  'Fees',
  'Why Work With Us',
  'Trust',
];

export function HomePage() {
  usePageSEO(
    'MAKANI — Intelligent Home Buying & Real Estate Advisory',
    'Make confident property decisions in Bengaluru and Mumbai with MAKANI. Explore vetted projects, compare 80+ data points, and buy with unbiased advisory.'
  );

  const navigate = useNavigate();
  const { openLeadModal } = useAppContext();

  const [heroCity, setHeroCity] = useState('Bengaluru');
  const [heroQuery, setHeroQuery] = useState('');
  const [compareAgainst, setCompareAgainst] = useState<'localBrokers' | 'onlinePortals'>('localBrokers');
  const [activeJourneyIdx, setActiveJourneyIdx] = useState(0);

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [videoModalStory, setVideoModalStory] = useState<Testimonial | null>(null);

  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [activeFaqCategory, setActiveFaqCategory] = useState<FAQ['category']>('About the Service');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const [stats, setStats] = useState([
    { key: 'projectsAnalyzed', value: 640, suffix: '+', label: 'Projects Analyzed', context: 'Across Bengaluru & Mumbai' },
    { key: 'happyHomebuyers', value: 1850, suffix: '+', label: 'Happy Homebuyers', context: '₹3,400+ Cr advised value' },
    { key: 'researchHours', value: 48000, suffix: '+', label: 'Research Hours', context: 'Site audits & CAD checks' },
    { key: 'builderPartners', value: 95, suffix: '+', label: 'Vetted Builders', context: 'RERA-compliant partners' },
  ]);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.testimonials)) setTestimonials(d.testimonials);
      })
      .catch(() => {});

    fetch('/api/faqs')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.faqs)) {
          setFaqs(d.faqs);
          const firstInCat = d.faqs.find((f: FAQ) => f.category === 'About the Service');
          if (firstInCat) setOpenFaqId(firstInCat.id);
        }
      })
      .catch(() => {});

    fetch('/api/stats')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.stats)) setStats(d.stats);
      })
      .catch(() => {});
  }, []);

  const filteredFaqs = faqs.filter((f) => f.category === activeFaqCategory);

  const handleFaqCategoryChange = (cat: FAQ['category']) => {
    setActiveFaqCategory(cat);
    const first = faqs.find((f) => f.category === cat);
    setOpenFaqId(first ? first.id : null);
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (heroCity) params.set('city', heroCity);
    if (heroQuery.trim()) params.set('q', heroQuery.trim());
    navigate(`/properties?${params.toString()}`);
  };

  const activeTestimonial = testimonials[testimonialIdx];
  const activeStep = JOURNEY_STEPS[activeJourneyIdx];

  return (
    <div>
      {/* ===================================================================== */}
      {/* SECTION 1: HERO SECTION                                               */}
      {/* ===================================================================== */}
      <section className="bg-white pt-10 pb-14 lg:pt-16 lg:pb-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Left Copy & Quick Search */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
              <div className="space-y-5">
                <p className="text-sm font-medium text-[#4B5563]">
                  Intelligent Home Buying Advisory · Bengaluru &amp; Mumbai
                </p>
                <h1
                  className="font-editorial font-semibold tracking-tight text-slate-950 leading-[1.08]"
                  style={{ fontSize: 'clamp(2.35rem, 4.1vw, 3.75rem)' }}
                >
                  Buy your next home with research, not guesswork.
                </h1>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                  Work with salaried architects and real estate analysts who evaluate 80+ floor-plan,
                  legal, and financial data points—so you choose the right home in 25 days with zero
                  broker spam.
                </p>

                {/* Primary + Secondary CTAs */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <button
                    type="button"
                    onClick={() => openLeadModal({ title: 'Book Your Free 20-Min Advisory Call' })}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#4B5563] hover:bg-[#374151] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Book a Free Call
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <Link
                    to="/properties"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    Explore Properties
                  </Link>
                </div>
              </div>

              {/* Clean Quick Property Search Bar */}
              <form
                onSubmit={handleHeroSearch}
                className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
              >
                <select
                  aria-label="Select city"
                  value={heroCity}
                  onChange={(e) => setHeroCity(e.target.value)}
                  className="px-3.5 py-2.5 text-sm font-medium text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#4B5563]"
                >
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="All">All Cities</option>
                </select>
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={heroQuery}
                    onChange={(e) => setHeroQuery(e.target.value)}
                    placeholder="Search Whitefield, Powai, Sobha, Oberoi..."
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#4B5563]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Right Dominant Architectural Visual (matches left column height cleanly) */}
            <div className="lg:col-span-6">
              <div className="relative h-full min-h-[340px] lg:min-h-[460px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <SmartImage
                  src={ASSET_IMAGES.hero}
                  alt="Contemporary landscaped residential apartment enclave in Bengaluru at golden hour"
                  fallbackTitle="MAKANI Curated Residences"
                  priority
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-4 text-white">
                  <div>
                    <div className="text-xs text-white/80">Featured Audit · Bengaluru &amp; Mumbai</div>
                    <div className="text-base font-semibold mt-0.5">
                      80+ Architectural, RERA &amp; Financial Parameters per Project
                    </div>
                  </div>
                  <Link
                    to="/services/peace-of-mind-report"
                    className="text-xs font-semibold text-white underline underline-offset-4 hover:text-[#D1D5DB] whitespace-nowrap"
                  >
                    See sample report →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width Trust Indicator Strip Below Hero Split */}
          <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-sm font-semibold text-slate-950">RERA Registered Advisory</div>
              <div className="text-xs text-slate-500 mt-1">Karnataka &amp; Maharashtra compliant</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-950">Zero Spam Charter</div>
              <div className="text-xs text-slate-500 mt-1">Your number is never sold to brokers</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-950">4.9 / 5 Buyer Rating</div>
              <div className="text-xs text-slate-500 mt-1">Across 1,850+ closed families</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-950">₹12.4 L Median Savings</div>
              <div className="text-xs text-slate-500 mt-1">Through comp-backed negotiation</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 2: TRUSTED BY (AUTO-SCROLLING LOGO CAROUSEL)                  */}
      {/* ===================================================================== */}
      <section className="bg-slate-50 py-12 border-b border-slate-200/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
          <p className="text-sm font-medium text-slate-500">
            Trusted by homebuyers working at India’s leading technology and financial organisations
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-slate-50 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-slate-50 to-transparent z-10" />

          <div className="animate-marquee flex items-center gap-12 sm:gap-16 py-2">
            {[...TRUSTED_COMPANIES, ...TRUSTED_COMPANIES].map((company, idx) => (
              <div
                key={`${company}-${idx}`}
                className="text-lg sm:text-xl font-semibold tracking-tight text-slate-400 hover:text-slate-700 transition-colors whitespace-nowrap select-none"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 3: HOW ARE WE DIFFERENT? + ANIMATED STATS                     */}
      {/* ===================================================================== */}
      <section className="bg-white py-20 lg:py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-[#4B5563] mb-2">Built for Homebuyers, Not Commissions</p>
              <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-slate-950">
                How are we different?
              </h2>
              <p className="text-base text-slate-600 mt-3 leading-relaxed">
                Compare MAKANI’s structured advisory process against traditional brokerage channels
                and classified listing portals.
              </p>
            </div>

            {/* Toggle Buttons: Local Brokers | Online Portals */}
            <div
              role="tablist"
              aria-label="Compare MAKANI against"
              className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 self-start md:self-auto"
            >
              <button
                type="button"
                role="tab"
                aria-selected={compareAgainst === 'localBrokers'}
                onClick={() => setCompareAgainst('localBrokers')}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  compareAgainst === 'localBrokers'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                vs Local Brokers
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={compareAgainst === 'onlinePortals'}
                onClick={() => setCompareAgainst('onlinePortals')}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  compareAgainst === 'onlinePortals'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                vs Online Portals
              </button>
            </div>
          </div>

          {/* Comparison Table (Desktop & Mobile Responsive) */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-4 px-5 text-xs font-semibold text-slate-500 w-1/4">Parameters</th>
                  <th className="py-4 px-5 text-sm font-semibold text-slate-950 bg-[#F3F4F6] border-x border-[#4B5563]/15 w-[38%]">
                    MAKANI Advisory
                  </th>
                  <th className="py-4 px-5 text-sm font-semibold text-slate-600 w-[37%]">
                    {compareAgainst === 'localBrokers' ? 'Local Brokers' : 'Online Portals'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.parameter} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5 font-semibold text-slate-900">{row.parameter}</td>
                    <td className="py-4 px-5 bg-[#F3F4F6]/60 border-x border-[#4B5563]/10 text-slate-950 font-medium">
                      <span className="inline-flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#4B5563] shrink-0 mt-0.5" strokeWidth={2.5} />
                        <span>{row.ours}</span>
                      </span>
                    </td>
                    <td className="py-4 px-5 text-slate-600">
                      {compareAgainst === 'localBrokers' ? row.localBrokers : row.onlinePortals}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Animated Statistics Strip */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-slate-200">
            {stats.map((stat) => (
              <div key={stat.key} className="space-y-1">
                <div className="font-editorial text-3xl sm:text-4xl font-semibold text-slate-950">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-semibold text-slate-900">{stat.label}</div>
                <div className="text-xs text-slate-500">{stat.context}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 4: CUSTOMER TESTIMONIALS CAROUSEL                             */}
      {/* ===================================================================== */}
      <section className="bg-slate-50 py-20 lg:py-24 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-sm font-medium text-[#4B5563] mb-2">Verified Homebuyer Stories</p>
              <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-slate-950">
                Real families. Measurable clarity.
              </h2>
            </div>

            {testimonials.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length)
                  }
                  aria-label="Previous testimonial"
                  className="w-10 h-10 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setTestimonialIdx((prev) => (prev + 1) % testimonials.length)}
                  aria-label="Next testimonial"
                  className="w-10 h-10 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {activeTestimonial && (
            <motion.div
              key={activeTestimonial.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white rounded-2xl border border-slate-200 overflow-hidden"
            >
              {/* Video Thumbnail / Photo */}
              <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-[380px] bg-slate-900 group">
                <SmartImage
                  src={activeTestimonial.thumbnailUrl}
                  alt={activeTestimonial.customerName}
                  fallbackTitle={activeTestimonial.customerName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
                <button
                  type="button"
                  onClick={() => setVideoModalStory(activeTestimonial)}
                  aria-label={`Play buyer story video for ${activeTestimonial.customerName}`}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                >
                  <span className="w-16 h-16 rounded-full bg-white/95 text-slate-950 group-hover:scale-105 transition-transform flex items-center justify-center shadow-xl">
                    <Play className="w-6 h-6 fill-slate-950 ml-1" />
                  </span>
                </button>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                  <span>Watch Buyer Walkthrough</span>
                  <span className="font-mono tabular-nums">{activeTestimonial.videoDuration}</span>
                </div>
              </div>

              {/* Quote & Attribution */}
              <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="text-xs font-medium text-[#4B5563]">
                    {activeTestimonial.propertyBought} · {activeTestimonial.city}
                  </div>
                  <blockquote className="font-editorial text-xl sm:text-2xl text-slate-950 leading-snug">
                    “{activeTestimonial.quote}”
                  </blockquote>
                  <p className="text-sm font-semibold text-emerald-800 pt-1">
                    Outcome: {activeTestimonial.savingsAchieved}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-base font-semibold text-slate-950">
                      {activeTestimonial.customerName}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {activeTestimonial.designation} · {activeTestimonial.company}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVideoModalStory(activeTestimonial)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-[#4B5563] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Read full case story <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Subtle Carousel Indicators */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {testimonials.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTestimonialIdx(idx)}
                  aria-label={`View testimonial from ${item.customerName}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === testimonialIdx ? 'w-8 bg-[#4B5563]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 5: BROKERS SHOW YOU THE BROCHURE. WE SHOW THE REALITY.        */}
      {/* ===================================================================== */}
      <section className="bg-white py-20 lg:py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <p className="text-sm font-medium text-[#4B5563] mb-2">Architectural Ground Truth</p>
            <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-slate-950">
              Brokers show you the brochure. We show the reality.
            </h2>
            <p className="text-base text-slate-600 mt-3 leading-relaxed">
              Every project looks idyllic inside a backlit experience centre. Drag the slider below
              to see how our architects verify actual tower spacing, floor-plan efficiency,
              construction quality, and amenity density before you pay a booking amount.
            </p>
          </div>

          <BeforeAfterSlider />
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 6: HOW IT WORKS – 25 DAYS                                     */}
      {/* ===================================================================== */}
      <section className="bg-slate-50 py-20 lg:py-24 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-sm font-medium text-[#4B5563] mb-2">Structured Home-Buying Process</p>
            <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-slate-950">
              How it works — 25 days to a confident decision
            </h2>
            <p className="text-base text-slate-600 mt-3 leading-relaxed">
              A disciplined six-step roadmap that replaces months of chaotic weekend visits with
              calm, research-led milestones.
            </p>
          </div>

          {/* Desktop Horizontal Timeline Selector */}
          <div className="hidden lg:block mb-10">
            <div className="relative grid grid-cols-6 gap-4">
              <div className="absolute top-6 left-8 right-8 h-px bg-slate-300 pointer-events-none" />
              {JOURNEY_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const active = idx === activeJourneyIdx;
                return (
                  <button
                    key={step.title}
                    type="button"
                    onClick={() => setActiveJourneyIdx(idx)}
                    className="relative text-left group cursor-pointer focus-visible:outline-none"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors mb-4 relative z-10 ${
                        active
                          ? 'bg-[#4B5563] text-white border-[#4B5563]'
                          : 'bg-white text-slate-700 border-slate-200 group-hover:border-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={1.8} />
                    </div>
                    <div className="text-xs font-mono text-slate-500">{step.day}</div>
                    <div
                      className={`text-sm font-semibold mt-1 transition-colors ${
                        active ? 'text-[#4B5563]' : 'text-slate-950'
                      }`}
                    >
                      0{idx + 1}. {step.title}
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{step.shortDesc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Active Step Detail Card */}
          <div className="hidden lg:grid grid-cols-12 gap-8 items-stretch bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="col-span-6 p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="text-xs font-mono text-[#4B5563]">
                  Step 0{activeJourneyIdx + 1} · {activeStep.day}
                </div>
                <h3 className="font-editorial text-2xl font-semibold text-slate-950">
                  {activeStep.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{activeStep.detail}</p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500">Key Deliverable</div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5">
                    {activeStep.deliverable}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openLeadModal({ title: 'Start Your 25-Day Guided Journey' })}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Start Day 1 Call <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="col-span-6 relative min-h-[300px] bg-slate-100">
              <SmartImage
                src={activeStep.image}
                alt={activeStep.title}
                fallbackTitle={activeStep.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Mobile & Tablet Vertical Timeline */}
          <div className="lg:hidden space-y-5 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-slate-300">
            {JOURNEY_STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative pl-14">
                  <div className="absolute left-0 top-1 w-10 h-10 rounded-lg bg-white border border-slate-300 text-[#4B5563] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-2">
                    <div className="text-xs font-mono text-[#4B5563]">
                      0{idx + 1} · {step.day}
                    </div>
                    <h3 className="text-base font-semibold text-slate-950">{step.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{step.detail}</p>
                    <div className="pt-2 text-xs text-slate-500">
                      Deliverable: <span className="font-medium text-slate-800">{step.deliverable}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 7: FEATURED MEDIA                                             */}
      {/* ===================================================================== */}
      <section className="bg-white py-20 lg:py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-medium text-[#4B5563] mb-2">Press &amp; Recognition</p>
            <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-slate-950">
              Featured across India’s leading business &amp; design press
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MEDIA_FEATURES.map((item) => (
              <article
                key={item.outlet}
                className="p-6 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="flex items-baseline justify-between gap-2 border-b border-slate-100 pb-3">
                  <span className="font-editorial text-lg font-semibold text-slate-950">
                    {item.outlet}
                  </span>
                  <span className="text-xs text-slate-400 tabular-nums">{item.date}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{item.headline}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 8: BENEFITS / SAVINGS CALCULATOR                              */}
      {/* ===================================================================== */}
      <section className="bg-slate-50 py-20 lg:py-24 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-medium text-[#4B5563] mb-2">Value of Unbiased Advisory</p>
            <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-slate-950">
              Calculate what intelligent home buying saves you
            </h2>
          </div>

          <SavingsCalculator />
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 9: FAQ ACCORDION WITH CATEGORIES                              */}
      {/* ===================================================================== */}
      <section className="bg-white py-20 lg:py-24 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-sm font-medium text-[#4B5563] mb-2">Clear Answers</p>
            <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-slate-950">
              Frequently asked questions
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Everything you need to know about our advisory process, transparent fees, legal
              verification, and timelines.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {FAQ_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleFaqCategoryChange(category)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeFaqCategory === category
                    ? 'bg-slate-950 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Single-Open Accordion */}
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div key={faq.id} className="py-1">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full py-4 text-left flex items-center justify-between gap-4 cursor-pointer group"
                  >
                    <span className="text-base font-semibold text-slate-950 group-hover:text-[#4B5563] transition-colors">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#4B5563]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pb-5 pr-8 text-sm text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 10: FINAL CTA — STILL HAVE QUESTIONS?                         */}
      {/* ===================================================================== */}
      <section className="bg-slate-50 py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-sm font-medium text-[#4B5563]">Speak With an Architect-Led Advisor</p>
              <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-slate-950">
                Still have questions?
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Whether you are six months away from buying or comparing two cost sheets this week,
                our advisory team will give you an honest, unhurried perspective.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => openLeadModal({ title: 'Book a Free Advisory Call' })}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#4B5563] hover:bg-[#374151] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  Book a Free Call
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/compare"
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
                >
                  Compare Projects
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 lg:border-l lg:border-slate-200 lg:pl-8 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#4B5563] mt-1 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-950">Advisory Desk (Mon–Sun, 9 AM–8 PM)</div>
                  <a href="tel:+919870666662" className="text-slate-600 hover:text-[#4B5563] tabular-nums">
                    +91 98 7066 6662
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#4B5563] mt-1 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-950">Email Our Research Team</div>
                  <a href="mailto:makaniproperties@gmail.com" className="text-slate-600 hover:text-[#4B5563]">
                    makaniproperties@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#4B5563] mt-1 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-950">Office</div>
                  <div className="text-slate-600">
                    Office No. 08, Grit Residency, GM Link Road, Chembur, Mumbai (W) - 400043
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#4B5563] mt-1 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-950">Zero-Spam Guarantee</div>
                  <div className="text-slate-600">No unsolicited calls. Ever.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* VIDEO STORY MODAL (TESTIMONIAL PLAY INTERACTION)                      */}
      {/* ===================================================================== */}
      {videoModalStory && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Homebuyer case story"
        >
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xl">
            <div className="relative aspect-[16/9] bg-slate-900">
              <SmartImage
                src={videoModalStory.thumbnailUrl}
                alt={videoModalStory.customerName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
              <button
                type="button"
                onClick={() => setVideoModalStory(null)}
                aria-label="Close buyer story"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/75 text-white hover:bg-slate-950 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <div className="text-xs text-[#D1D5DB] font-medium">
                  Buyer Case Study · {videoModalStory.propertyBought}
                </div>
                <h3 className="font-editorial text-2xl font-semibold mt-1">
                  {videoModalStory.customerName}
                </h3>
                <p className="text-xs text-white/80 mt-0.5">
                  {videoModalStory.designation} · {videoModalStory.company}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <Building className="w-4 h-4" />
                <span>{videoModalStory.savingsAchieved}</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{videoModalStory.fullStory}</p>
              <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setVideoModalStory(null)}
                  className="text-sm font-medium text-slate-600 hover:text-slate-950 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const storyCity = videoModalStory.city;
                    setVideoModalStory(null);
                    openLeadModal({
                      title: 'Get a Similar Advisory Experience',
                      preferredCity: storyCity,
                    });
                  }}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-[#4B5563] hover:bg-[#374151] rounded-lg transition-colors cursor-pointer"
                >
                  Book a Free Call
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
