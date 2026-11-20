import { CheckCircle2, Clock, Mail, MapPin, Phone } from 'lucide-react';
import React, { useState } from 'react';
import { usePageSEO } from '../lib/formatters';

const LOCALITIES: Record<string, string[]> = {
  Bengaluru: ['Whitefield', 'Hebbal', 'Sarjapur Road', 'Indiranagar', 'HSR Layout', 'Yelahanka', 'Other'],
  Mumbai: ['Powai', 'Worli', 'Bandra East', 'Thane West', 'Other'],
};

export function ContactPage() {
  usePageSEO(
    'Contact MAKANI Properties — Chembur, Mumbai',
    'Reach MAKANI Properties at Office No. 08, Grit Residency, GM Link Road, Chembur, Mumbai (W) - 400043, call +91 98 7066 6662, or book a free consultation online.'
  );

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
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (fullName.trim().length < 2) nextErrors.fullName = 'Please enter your full name.';
    const digits = mobile.replace(/\D/g, '');
    const norm = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
    if (!/^[6-9]\d{9}$/.test(norm)) nextErrors.mobile = 'Enter a valid 10-digit Indian mobile number.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = 'Enter a valid email address.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          mobile: norm,
          email,
          preferredCity,
          preferredLocality,
          budget,
          configuration,
          requirements,
          sourcePage: '/contact',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.fields) setErrors(data.fields);
        return;
      }
      setConfirmedRef(data.lead?.referenceCode || 'MKN-CONFIRMED');
      setFullName('');
      setMobile('');
      setEmail('');
      setRequirements('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <p className="text-sm font-medium text-[#4B5563] mb-2">Contact MAKANI</p>
          <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-slate-950">
            Speak directly with our advisory desks
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Have a specific project you want audited, or starting a fresh home search in Bengaluru or
            Mumbai? Drop us a note and a salaried advisor will respond within two business hours.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Offices & Direct Contact */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <h2 className="font-editorial text-xl font-semibold text-slate-950">Advisory Office</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#4B5563] mt-1 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-950">MAKANI Properties Office</div>
                  <p className="text-slate-600 mt-0.5">
                    Office No. 08, Grit Residency, GM Link Road, Chembur, Mumbai (W) - 400043
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                <Phone className="w-4 h-4 text-[#4B5563] mt-1 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-950">Phone</div>
                  <a href="tel:+919870666662" className="text-slate-600 hover:text-[#4B5563] tabular-nums">
                    +91 98 7066 6662
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#4B5563] mt-1 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-950">Email</div>
                  <a href="mailto:makaniproperties@gmail.com" className="text-slate-600 hover:text-[#4B5563]">
                    makaniproperties@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#4B5563] mt-1 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-950">Hours</div>
                  <p className="text-slate-600">Monday – Sunday, 9:00 AM to 8:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Lead Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-7 sm:p-8">
          {confirmedRef ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
              <h2 className="font-editorial text-2xl font-semibold text-slate-950">
                We’ve received your request
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Reference ID <span className="font-mono font-semibold text-slate-950">{confirmedRef}</span>.
                Our {preferredCity} advisory desk will call you shortly.
              </p>
              <button
                type="button"
                onClick={() => setConfirmedRef(null)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Submit another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <h2 className="font-editorial text-2xl font-semibold text-slate-950 mb-2">
                Schedule a Free Consultation
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="c-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    id="c-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
                      errors.fullName ? 'border-red-400' : 'border-slate-300'
                    }`}
                  />
                  {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="c-mobile" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    id="c-mobile"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10-digit Indian mobile"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-lg border tabular-nums ${
                      errors.mobile ? 'border-red-400' : 'border-slate-300'
                    }`}
                  />
                  {errors.mobile && <p className="text-xs text-red-600 mt-1">{errors.mobile}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="c-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  id="c-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
                    errors.email ? 'border-red-400' : 'border-slate-300'
                  }`}
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="c-city" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Preferred City *
                  </label>
                  <select
                    id="c-city"
                    value={preferredCity}
                    onChange={(e) => {
                      setPreferredCity(e.target.value);
                      setPreferredLocality(LOCALITIES[e.target.value][0]);
                    }}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mumbai">Mumbai</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="c-loc" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Preferred Locality
                  </label>
                  <select
                    id="c-loc"
                    value={preferredLocality}
                    onChange={(e) => setPreferredLocality(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white"
                  >
                    {(LOCALITIES[preferredCity] || []).map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="c-budget" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Budget Range *
                  </label>
                  <select
                    id="c-budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="₹1 Cr – ₹1.5 Cr">₹1 Cr – ₹1.5 Cr</option>
                    <option value="₹1.5 Cr – ₹2.5 Cr">₹1.5 Cr – ₹2.5 Cr</option>
                    <option value="₹2.5 Cr – ₹4 Cr">₹2.5 Cr – ₹4 Cr</option>
                    <option value="₹4 Cr – ₹7 Cr">₹4 Cr – ₹7 Cr</option>
                    <option value="₹7 Cr+">₹7 Cr+</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="c-config" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Configuration
                  </label>
                  <select
                    id="c-config"
                    value={configuration}
                    onChange={(e) => setConfiguration(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="3 BHK + Study">3 BHK + Study</option>
                    <option value="4 BHK">4 BHK</option>
                    <option value="Villa / Row House">Villa / Row House</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="c-req" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Additional Requirements
                </label>
                <textarea
                  id="c-req"
                  rows={3}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Share preferred possession timeline, workplace location, or projects already shortlisted..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-[#4B5563] hover:bg-[#374151] disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
              >
                {submitting ? 'Submitting...' : 'Book a Free Call'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
