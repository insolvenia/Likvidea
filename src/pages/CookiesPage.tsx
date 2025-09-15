import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const CookiesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header onMenuToggle={() => {}} isMenuOpen={false} />
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie-policy</h1>
          <p className="text-gray-600 mb-8">Senast uppdaterad: 10 september 2024</p>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Vad är cookies?</h2>
            <p className="text-gray-700 mb-6">
              Cookies är små textfiler som lagras på din enhet när du besöker en webbplats. 
              De används för att förbättra funktionaliteten och din användarupplevelse.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Vilka cookies använder vi?</h2>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Nödvändiga cookies</h3>
              <p className="text-gray-700 mb-4">
                Krävs för att webbplatsen ska fungera (t.ex. formulär och säkerhetsfunktioner).
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Analyscookies</h3>
              <p className="text-gray-700 mb-4">
                Används för att mäta trafik och förbättra tjänsten. Vi kan använda verktyg som Google Analytics eller Plausible.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Marknadsföringscookies</h3>
              <p className="text-gray-700 mb-4">
                Kan användas för riktad annonsering via tredjepartsplattformar (om tillämpligt).
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hur kan du hantera cookies?</h2>
            <p className="text-gray-700 mb-6">
              Du kan när som helst radera cookies från din webbläsare eller ändra dina inställningar för att blockera cookies. 
              Observera att webbplatsen kan fungera sämre om du blockerar nödvändiga cookies.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Samtycke</h2>
            <p className="text-gray-700 mb-6">
              Vid första besök på webbplatsen ber vi om ditt samtycke till icke-nödvändiga cookies.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};