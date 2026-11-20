import { ChevronDown, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const SERVICE_LINKS = [
  {
    slug: 'guided-home-buying',
    label: 'Guided Home Buying',
    desc: 'End-to-end 25-day advisory from shortlist to keys',
  },
  {
    slug: 'peace-of-mind-report',
    label: 'Peace of Mind Property Report',
    desc: '80-point architectural, legal & financial audit',
  },
  {
    slug: 'property-research-analysis',
    label: 'Property Research & Analysis',
    desc: 'Micro-market comps, supply & IRR modelling',
  },
  {
    slug: 'negotiation-assistance',
    label: 'Property Negotiation Assistance',
    desc: 'Data-backed cost sheet & fee negotiation',
  },
  {
    slug: 'home-loan-assistance',
    label: 'Home Loan Assistance',
    desc: 'Unbiased bank spread & overdraft comparison',
  },
];

export function Navbar() {
  const { openLeadModal, compareList } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isServiceActive = location.pathname.startsWith('/services');

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
      isActive
        ? 'text-[#4B5563] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:bg-[#4B5563]'
        : 'text-slate-600 hover:text-slate-950'
    }`;

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-200 border-b ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-slate-200/90'
          : 'bg-white border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-[72px] flex items-center justify-between gap-8">
        {/* Zone 1: Brand logo */}
        <Link
          to="/"
          aria-label="MAKANI Properties Home"
          className="inline-flex items-center shrink-0 rounded-md overflow-hidden bg-[#4D4D4D] h-12 w-[100px] border border-slate-200/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B5563]"
        >
          <img
            src="/assets/aistudio/Makani_Properties__CMYK__Black_80___JPG_651126a9.jpg"
            alt="MAKANI Properties"
            className="w-full h-full object-cover object-center"
          />
        </Link>

        {/* Zone 2: Single-line desktop navigation */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-6">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/properties" className={navLinkClass}>
            Explore Properties
          </NavLink>
          <NavLink to="/compare" className={navLinkClass}>
            Compare{compareList.length > 0 ? ` (${compareList.length})` : ''}
          </NavLink>

          {/* Services Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setServicesOpen((prev) => !prev)}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              className={`flex items-center gap-1 py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isServiceActive ? 'text-[#4B5563]' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Services
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  servicesOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {servicesOpen && (
              <div className="absolute left-0 top-full mt-3 w-[340px] bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-900/5 p-2 z-50">
                <div className="divide-y divide-slate-100">
                  {SERVICE_LINKS.map((item) => (
                    <Link
                      key={item.slug}
                      to={`/services/${item.slug}`}
                      className="block px-3.5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="text-sm font-semibold text-slate-900">{item.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                    </Link>
                  ))}
                </div>
                <div className="mt-1 pt-2 border-t border-slate-100 px-3.5 pb-1.5">
                  <Link
                    to="/services"
                    className="text-xs font-semibold text-[#4B5563] hover:text-[#374151]"
                  >
                    View all advisory services →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <NavLink to="/blog" className={navLinkClass}>
            Resources
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About Us
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        {/* Zone 3: Single primary CTA + Mobile toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => openLeadModal({ title: 'Book a Free Advisory Call' })}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-[#4B5563] hover:bg-[#374151] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#4B5563]"
          >
            Book a Free Call
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-1 max-h-[82vh] overflow-y-auto">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive ? 'bg-slate-100 text-[#4B5563]' : 'text-slate-700'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/properties"
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive ? 'bg-slate-100 text-[#4B5563]' : 'text-slate-700'
              }`
            }
          >
            Explore Properties
          </NavLink>
          <NavLink
            to="/compare"
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive ? 'bg-slate-100 text-[#4B5563]' : 'text-slate-700'
              }`
            }
          >
            Compare Projects{compareList.length > 0 ? ` (${compareList.length})` : ''}
          </NavLink>

          <div>
            <button
              type="button"
              onClick={() => setMobileServicesOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium text-slate-700"
            >
              <span>Services</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {mobileServicesOpen && (
              <div className="pl-4 mt-1 space-y-1 border-l border-slate-200 ml-3">
                {SERVICE_LINKS.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/services/${s.slug}`}
                    className="block px-3 py-2 text-sm text-slate-600 hover:text-slate-950"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <NavLink
            to="/blog"
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive ? 'bg-slate-100 text-[#4B5563]' : 'text-slate-700'
              }`
            }
          >
            Resources & Blog
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive ? 'bg-slate-100 text-[#4B5563]' : 'text-slate-700'
              }`
            }
          >
            About Us
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive ? 'bg-slate-100 text-[#4B5563]' : 'text-slate-700'
              }`
            }
          >
            Contact Us
          </NavLink>

          <div className="pt-4">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openLeadModal({ title: 'Book a Free Advisory Call' });
              }}
              className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#4B5563] hover:bg-[#374151] rounded-lg transition-colors"
            >
              Book a Free Call
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
