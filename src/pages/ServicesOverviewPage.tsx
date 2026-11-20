import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SmartImage } from '../components/SmartImage';
import { useAppContext } from '../context/AppContext';
import { usePageSEO } from '../lib/formatters';
import type { ServiceDetail } from '../shared/types';

export function ServicesOverviewPage() {
  usePageSEO(
    'Real Estate Advisory Services | MAKANI',
    'Explore Guided Home Buying, Peace of Mind Property Reports, Property Research, Negotiation Assistance, and Home Loan Advisory by MAKANI.'
  );

  const { openLeadModal } = useAppContext();
  const [services, setServices] = useState<ServiceDetail[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch('/api/services')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.services)) setServices(d.services);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <section className="bg-white border-b border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <p className="text-sm font-medium text-[#4B5563] mb-2">Fiduciary Homebuyer Services</p>
          <h1 className="font-editorial text-3xl sm:text-5xl font-semibold text-slate-950">
            Advisory services designed for every stage of buying a home
          </h1>
          <p className="text-base text-slate-600 mt-4 leading-relaxed max-w-2xl">
            Whether you want end-to-end 25-day guidance or an independent 80-point architectural
            audit on a single shortlisted apartment, choose the exact level of support you need.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-6">
        {services.map((service, idx) => (
          <article
            key={service.slug}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch"
          >
            <div className="lg:col-span-4 relative min-h-[220px] bg-slate-100">
              <SmartImage
                src={service.heroImage}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-8 p-7 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="text-xs font-mono text-[#4B5563]">
                  0{idx + 1}. {service.timeline}
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-slate-950">
                  {service.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">{service.summary}</p>
                <div className="text-xs text-slate-500 pt-1">
                  <span className="font-semibold text-slate-800">Fees:</span> {service.feeStructure}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <Link
                  to={`/services/${service.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-950 hover:text-[#4B5563] transition-colors"
                >
                  Explore deliverables &amp; process <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    openLeadModal({
                      title: `Enquire — ${service.title}`,
                      serviceSlug: service.slug,
                      defaultRequirements: `Interested in ${service.title}.`,
                    })
                  }
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#4B5563] hover:bg-[#374151] rounded-lg transition-colors cursor-pointer"
                >
                  Book a Free Call
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
