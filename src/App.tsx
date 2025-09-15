import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { StickyMobileCTA } from './components/StickyMobileCTA';
import { USP } from './components/USP';
import { ServiceSections } from './components/ServiceSections';
import { Partnership } from './components/Partnership';
import { CTABanners } from './components/CTABanners';
import { FAQ } from './components/FAQ';
import { SimpleLeadForm } from './components/SimpleLeadForm';
import { Footer } from './components/Footer';
import { IntegritetspolicyPage } from './pages/IntegritetspolicyPage';
import { VillkorPage } from './pages/VillkorPage';
import { CookiesPage } from './pages/CookiesPage';
import { KlagomalPage } from './pages/KlagomalPage';

const HomePage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header onMenuToggle={setIsMenuOpen} isMenuOpen={isMenuOpen} />
      <StickyMobileCTA />
      <main>
        <Hero />
        <USP />
        <ServiceSections />
        <CTABanners />
        <Partnership />
        <div id="application-form">
          <section className="py-20 bg-light-bg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SimpleLeadForm />
            </div>
          </section>
        </div>
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/integritetspolicy" element={<IntegritetspolicyPage />} />
        <Route path="/villkor" element={<VillkorPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/klagomal" element={<KlagomalPage />} />
      </Routes>
    </Router>
  );
}

export default App;