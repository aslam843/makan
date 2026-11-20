import { useEffect } from 'react';
import { usePageSEO } from '../lib/formatters';

interface LegalPageProps {
  mode: 'privacy' | 'terms';
}

export function LegalPage({ mode }: LegalPageProps) {
  const isPrivacy = mode === 'privacy';

  usePageSEO(
    isPrivacy ? 'Privacy Policy & Zero-Spam Charter | MAKANI' : 'Terms & Conditions | MAKANI',
    isPrivacy
      ? 'Read MAKANI’s strict zero-spam data privacy policy protecting Indian homebuyer contact and financial preferences.'
      : 'Terms of advisory engagement, RERA disclosures, and service guidelines for MAKANI.'
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [mode]);

  return (
    <div className="bg-white py-16 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-slate-200 pb-6">
          <p className="text-xs font-mono text-[#4B5563]">Last Updated · November 2026</p>
          <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-slate-950 mt-2">
            {isPrivacy ? 'Privacy Policy & Zero-Spam Charter' : 'Terms & Conditions'}
          </h1>
        </div>

        {isPrivacy ? (
          <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-950">1. Zero-Spam Commitment</h2>
              <p>
                MAKANI Advisory Technologies Pvt. Ltd. never sells, rents, or distributes your
                mobile number or email address to third-party real estate brokers, telemarketers, or
                unsolicited builder call centres.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-950">2. Information We Collect</h2>
              <p>
                When you book a free consultation or submit an enquiry, we collect your name, phone
                number, email, target city, budget range, and residential preferences solely to
                assign a qualified salaried advisor and prepare property shortlists.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-950">3. Data Deletion & Control</h2>
              <p>
                You may request export or permanent deletion of your lead profile at any time by
                writing to makaniproperties@gmail.com. Requests are completed within 72 hours.
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-950">1. Scope of Advisory</h2>
              <p>
                MAKANI provides data-backed residential real estate advisory, architectural layout
                audits, and transaction facilitation for RERA-registered projects across Bengaluru
                and Mumbai. While we verify RERA filings and sanctioned plans diligently, buyers are
                encouraged to conduct independent title scrutiny prior to executing a Sale Deed.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-950">2. Fee & Refund Transparency</h2>
              <p>
                Initial discovery calls are complimentary. Guided Home Buying retainer fees are
                fully refundable if you decide not to proceed following the first curated longlist
                call.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-950">3. RERA Registrations</h2>
              <p>
                Karnataka RERA Agent Registration: PRM/KA/RERA/1251/446/AG/240105/004418.
                Maharashtra RERA Agent Registration: A51800044912.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
