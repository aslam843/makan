import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SmartImage } from '../components/SmartImage';
import { useAppContext } from '../context/AppContext';
import { usePageSEO } from '../lib/formatters';
import type { ServiceDetail } from '../shared/types';

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { openLeadModal } = useAppContext();

  const [service, setService] = useState<ServiceDetail | null>(null);
  const [allServices, setAllServices] = useState<ServiceDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetch(`/api/services/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((d) => {
        setService(d.service);
        setAllServices(Array.isArray(d.allServices) ? d.allServices : []);
      })
      .catch(() => setService(null))
      .finally(() => setLoading(false));
  }, [slug]);

  usePageSEO(
    service ? `${service.title} | MAKANI Advisory` : 'Advisory Service | MAKANI',
    service ? service.summary : 'Data-driven real estate advisory by MAKANI.'
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="h-64 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="font-editorial text-3xl font-semibold text-slate-950">Service Not Found</h1>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-950 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          View All Services
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Service Hero */}
      <section className="bg-white border-b border-slate-200 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-950 mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Advisory Services
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="text-sm font-medium text-[#4B5563]">{service.timeline}</p>
                <h1 className="font-editorial text-3xl sm:text-5xl font-semibold text-slate-950 leading-tight">
                  {service.title}
                </h1>
                <p className="text-lg text-slate-700 font-medium">{service.tagline}</p>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {service.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Fee Transparency</span>
                    <span className="font-semibold text-slate-950 mt-0.5 block">
                      {service.feeStructure}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Ideal For</span>
                    <span className="font-semibold text-slate-950 mt-0.5 block">
                      {service.idealFor}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      openLeadModal({
                        title: `Get Started — ${service.title}`,
                        serviceSlug: service.slug,
                        defaultRequirements: `Interested in ${service.title}.`,
                      })
                    }
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#4B5563] hover:bg-[#374151] rounded-lg transition-colors cursor-pointer"
                  >
                    Book a Free Consultation
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <Link
                    to="/properties"
                    className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Explore Properties
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="h-full min-h-[280px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <SmartImage
                  src={service.heroImage}
                  alt={service.title}
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Quantified Outcomes Strip */}
          <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {service.outcomes.map((o) => (
              <div key={o.label}>
                <div className="font-editorial text-3xl font-semibold text-slate-950 tabular-nums">
                  {o.metric}
                </div>
                <div className="text-sm text-slate-600 mt-1">{o.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables & Process */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        <section>
          <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-slate-950 mb-6">
            What you receive
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.deliverables.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl border border-slate-200 p-6 flex items-start gap-3.5"
              >
                <div className="w-6 h-6 rounded-full bg-[#F3F4F6] text-[#4B5563] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-950">{item.title}</h3>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-slate-950 mb-6">
            How we execute it
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {service.processSteps.map((ps) => (
              <div key={ps.step} className="bg-white rounded-xl border border-slate-200 p-6 space-y-2">
                <div className="text-xs font-mono text-[#4B5563] font-semibold">{ps.step}</div>
                <h3 className="text-base font-semibold text-slate-950">{ps.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{ps.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Switch to Other Services */}
        <section className="pt-8 border-t border-slate-200">
          <h2 className="font-editorial text-xl font-semibold text-slate-950 mb-4">
            Other MAKANI Advisory Services
          </h2>
          <div className="flex flex-wrap gap-3">
            {allServices
              .filter((s) => s.slug !== service.slug)
              .map((other) => (
                <Link
                  key={other.slug}
                  to={`/services/${other.slug}`}
                  className="px-4 py-2.5 text-sm font-medium bg-white border border-slate-200 hover:border-[#4B5563] rounded-lg text-slate-800 hover:text-[#4B5563] transition-colors"
                >
                  {other.shortTitle} →
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
