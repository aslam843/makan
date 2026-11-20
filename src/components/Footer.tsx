import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export function Footer() {
  const { openLeadModal } = useAppContext();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-slate-800/80">
          {/* Brand & Company Info */}
          <div className="lg:col-span-4 space-y-5">
            <Link
              to="/"
              className="inline-block font-editorial text-2xl font-semibold tracking-tight text-white"
            >
              MAKANI
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              India’s data-backed residential real estate advisory. We combine architectural floor-plan
              audits, RERA legal verification, and registered market benchmarks to help families buy
              homes with clarity—and zero sales spam.
            </p>
            <div className="space-y-2.5 text-sm text-slate-400 pt-1">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <span>Office No. 08, Grit Residency, GM Link Road, Chembur, Mumbai (W) - 400043</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <a href="tel:+919870666662" className="hover:text-white transition-colors tabular-nums">
                  +91 98 7066 6662
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <a href="mailto:makaniproperties@gmail.com" className="hover:text-white transition-colors">
                  makaniproperties@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white mb-4">Advisory Services</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/services/guided-home-buying" className="hover:text-white transition-colors">
                  Guided Home Buying
                </Link>
              </li>
              <li>
                <Link to="/services/peace-of-mind-report" className="hover:text-white transition-colors">
                  Peace of Mind Report
                </Link>
              </li>
              <li>
                <Link to="/services/property-research-analysis" className="hover:text-white transition-colors">
                  Research & Analysis
                </Link>
              </li>
              <li>
                <Link to="/services/negotiation-assistance" className="hover:text-white transition-colors">
                  Negotiation Assistance
                </Link>
              </li>
              <li>
                <Link to="/services/home-loan-assistance" className="hover:text-white transition-colors">
                  Home Loan Assistance
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Discovery */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white mb-4">Property Discovery</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/properties" className="hover:text-white transition-colors">
                  Explore All Projects
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Bengaluru" className="hover:text-white transition-colors">
                  Homes in Bengaluru
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Mumbai" className="hover:text-white transition-colors">
                  Homes in Mumbai
                </Link>
              </li>
              <li>
                <Link to="/properties?status=Ready%20to%20Move" className="hover:text-white transition-colors">
                  Ready-to-Move Homes
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white transition-colors">
                  Compare Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Locations */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white mb-4">Popular Locations</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/properties?city=Bengaluru&locality=Whitefield" className="hover:text-white transition-colors">
                  Whitefield, Bengaluru
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Bengaluru&locality=Hebbal" className="hover:text-white transition-colors">
                  Hebbal, Bengaluru
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Bengaluru&locality=Sarjapur%20Road" className="hover:text-white transition-colors">
                  Sarjapur Road, Bengaluru
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Mumbai&locality=Powai" className="hover:text-white transition-colors">
                  Powai, Mumbai
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Mumbai&locality=Worli" className="hover:text-white transition-colors">
                  Worli & BKC, Mumbai
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Mumbai&locality=Thane%20West" className="hover:text-white transition-colors">
                  Thane West, MMR
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Company */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Knowledge Hub
                </Link>
              </li>
              <li>
                <Link to="/blog?category=Buying%20Guides" className="hover:text-white transition-colors">
                  Buying Guides
                </Link>
              </li>
              <li>
                <Link to="/blog?category=Legal%20Documentation" className="hover:text-white transition-colors">
                  RERA & Legal Checks
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About MAKANI
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Advisory Desk
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openLeadModal({ title: 'Book a Free Advisory Call' })}
                  className="inline-flex items-center gap-1 text-[#D1D5DB] hover:text-white transition-colors font-medium cursor-pointer"
                >
                  Schedule Free Call <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Social Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div className="space-y-1">
            <p>© {new Date().getFullYear()} MAKANI Advisory Technologies Pvt. Ltd. All rights reserved.</p>
            <p>Karnataka RERA Reg: PRM/KA/RERA/1251/446/AG/240105/004418 · MahaRERA Reg: A51800044912</p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-slate-200 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-slate-200 transition-colors">
              Terms & Conditions
            </Link>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-200 transition-colors"
            >
              Sitemap
            </a>
            <div className="flex items-center gap-4 text-slate-400">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                YouTube
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                X
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
