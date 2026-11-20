import { CheckCircle2, Lock, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const LOCALITIES_BY_CITY: Record<string, string[]> = {
  Bengaluru: ['Whitefield', 'Hebbal', 'Sarjapur Road', 'Indiranagar', 'HSR Layout', 'Yelahanka', 'Open to Recommendations'],
  Mumbai: ['Powai', 'Worli', 'Bandra East', 'Thane West', 'Lower Parel', 'Open to Recommendations'],
};

const BUDGET_OPTIONS = [
  '₹1 Cr – ₹1.5 Cr',
  '₹1.5 Cr – ₹2.5 Cr',
  '₹2.5 Cr – ₹4 Cr',
  '₹4 Cr – ₹7 Cr',
  '₹7 Cr+',
];

const CONFIG_OPTIONS = ['2 BHK', '3 BHK', '3 BHK + Study', '4 BHK', 'Villa / Row House'];

export function LeadModal() {
  const { isLeadModalOpen, leadContext, closeLeadModal } = useAppContext();
  const location = useLocation();

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [preferredCity, setPreferredCity] = useState('Bengaluru');
  const [preferredLocality, setPreferredLocality] = useState('Whitefield');
  const [budget, setBudget] = useState('₹1.5 Cr – ₹2.5 Cr');
  const [configuration, setConfiguration] = useState('3 BHK');
  const [requirements, setRequirements] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (isLeadModalOpen) {
      const city = leadContext.preferredCity || 'Bengaluru';
      setPreferredCity(city);
      const validLocalities = LOCALITIES_BY_CITY[city] || LOCALITIES_BY_CITY.Bengaluru;
      setPreferredLocality(
        leadContext.preferredLocality && validLocalities.includes(leadContext.preferredLocality)
          ? leadContext.preferredLocality
          : validLocalities[0]
      );
      setRequirements(
        leadContext.defaultRequirements ||
          (leadContext.propertyName ? `Interested in ${leadContext.propertyName}.` : '')
      );
      setErrors({});
      setServerError(null);
      setSubmittedRef(null);
    }
  }, [isLeadModalOpen, leadContext]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLeadModalOpen) closeLeadModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isLeadModalOpen, closeLeadModal]);

  if (!isLeadModalOpen) return null;

  const handleCityChange = (city: string) => {
    setPreferredCity(city);
    const list = LOCALITIES_BY_CITY[city] || [];
    setPreferredLocality(list[0] || '');
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.';
    }
    const digits = mobile.replace(/\D/g, '');
    const normalized = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
    if (!/^[6-9]\d{9}$/.test(normalized)) {
      nextErrors.mobile = 'Enter a valid 10-digit Indian mobile number.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!preferredCity) nextErrors.preferredCity = 'Select a city.';
    if (!budget) nextErrors.budget = 'Select a budget range.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          mobile,
          email,
          preferredCity,
          preferredLocality,
          budget,
          configuration,
          requirements,
          sourcePage: location.pathname,
          propertySlug: leadContext.propertySlug,
          serviceSlug: leadContext.serviceSlug,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.fields) setErrors(data.fields);
        setServerError(data.error || 'Could not submit your request. Please check your details.');
        return;
      }

      setSubmittedRef(data.lead?.referenceCode || 'MKN-CONFIRMED');
      setFullName('');
      setMobile('');
      setEmail('');
    } catch {
      setServerError('Network error while submitting. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-auto">
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h2 id="lead-modal-title" className="font-editorial text-2xl font-semibold text-slate-950">
              {leadContext.title || 'Book a Free Advisory Call'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {leadContext.subtitle ||
                'Speak with a salaried MAKANI advisor for 20 minutes. Zero spam, zero sales pressure.'}
            </p>
          </div>
          <button
            type="button"
            onClick={closeLeadModal}
            aria-label="Close modal"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {submittedRef ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-2xl font-semibold text-slate-950">
                Advisory Call Confirmed
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you for reaching out. Our senior advisor for{' '}
                <span className="font-semibold text-slate-900">{preferredCity}</span> will call you
                within 2 business hours to understand your brief.
              </p>
              <div className="inline-block bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-xs text-slate-600">
                Reference ID:{' '}
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {submittedRef}
                </span>
              </div>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={closeLeadModal}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Continue Exploring
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {serverError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  {serverError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lead-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    id="lead-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Rahul Sharma"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#4B5563]/25 focus:border-[#4B5563] ${
                      errors.fullName ? 'border-red-400' : 'border-slate-300'
                    }`}
                  />
                  {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="lead-mobile" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mobile Number (India) *
                  </label>
                  <input
                    id="lead-mobile"
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="98801 23456"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white tabular-nums focus:outline-none focus:ring-2 focus:ring-[#4B5563]/25 focus:border-[#4B5563] ${
                      errors.mobile ? 'border-red-400' : 'border-slate-300'
                    }`}
                  />
                  {errors.mobile && <p className="text-xs text-red-600 mt-1">{errors.mobile}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="lead-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  id="lead-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul.sharma@company.com"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#4B5563]/25 focus:border-[#4B5563] ${
                    errors.email ? 'border-red-400' : 'border-slate-300'
                  }`}
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lead-city" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Preferred City *
                  </label>
                  <select
                    id="lead-city"
                    value={preferredCity}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#4B5563]/25 focus:border-[#4B5563]"
                  >
                    {Object.keys(LOCALITIES_BY_CITY).map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="lead-locality" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Preferred Locality
                  </label>
                  <select
                    id="lead-locality"
                    value={preferredLocality}
                    onChange={(e) => setPreferredLocality(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#4B5563]/25 focus:border-[#4B5563]"
                  >
                    {(LOCALITIES_BY_CITY[preferredCity] || []).map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lead-budget" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Estimated Budget *
                  </label>
                  <select
                    id="lead-budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#4B5563]/25 focus:border-[#4B5563]"
                  >
                    {BUDGET_OPTIONS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="lead-config" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Property Configuration
                  </label>
                  <select
                    id="lead-config"
                    value={configuration}
                    onChange={(e) => setConfiguration(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#4B5563]/25 focus:border-[#4B5563]"
                  >
                    {CONFIG_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="lead-req" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Additional Requirements (Optional)
                </label>
                <textarea
                  id="lead-req"
                  rows={2}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Possession timeline, commute hub, Vastu preference, or specific projects..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#4B5563]/25 focus:border-[#4B5563]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Zero-spam guarantee. Never shared with third-party brokers.</span>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-[#4B5563] hover:bg-[#374151] disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {submitting ? 'Confirming...' : 'Confirm Free Call'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
