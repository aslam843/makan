import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { CompareFloatingBar } from './components/CompareFloatingBar';
import { Footer } from './components/Footer';
import { LeadModal } from './components/LeadModal';
import { Navbar } from './components/Navbar';
import { AppProvider } from './context/AppContext';
import { AboutPage } from './pages/AboutPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { BlogListPage } from './pages/BlogListPage';
import { ComparePropertiesPage } from './pages/ComparePropertiesPage';
import { ContactPage } from './pages/ContactPage';
import { ExplorePropertiesPage } from './pages/ExplorePropertiesPage';
import { HomePage } from './pages/HomePage';
import { LegalPage } from './pages/LegalPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ServicesOverviewPage } from './pages/ServicesOverviewPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-white text-slate-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/properties" element={<ExplorePropertiesPage />} />
              <Route path="/properties/:slug" element={<PropertyDetailPage />} />
              <Route path="/compare" element={<ComparePropertiesPage />} />
              <Route path="/services" element={<ServicesOverviewPage />} />
              <Route path="/services/:slug" element={<ServiceDetailPage />} />
              <Route path="/blog" element={<BlogListPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<LegalPage mode="privacy" />} />
              <Route path="/terms" element={<LegalPage mode="terms" />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
          <LeadModal />
          <CompareFloatingBar />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}
