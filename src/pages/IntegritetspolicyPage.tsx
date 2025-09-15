import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const IntegritetspolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header onMenuToggle={() => {}} isMenuOpen={false} />
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Integritetspolicy</h1>
          <p className="text-gray-600 mb-8">Senast uppdaterad: 10 september 2024</p>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Inledning</h2>
            <p className="text-gray-700 mb-6">
              På Likvidea värnar vi om din personliga integritet. Denna policy beskriver hur vi samlar in, 
              använder, lagrar och delar dina personuppgifter i samband med att du fyller i en förfrågan via vår webbplats.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Vilka uppgifter samlar vi in?</h2>
            <p className="text-gray-700 mb-4">När du skickar in en förfrågan samlar vi in:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Namn och kontaktuppgifter (e-post, telefonnummer)</li>
              <li>Företagsuppgifter (företagsnamn, organisationsnummer, bransch, omsättning, behov)</li>
              <li>Dina samtycken (GDPR, delning med partners)</li>
              <li>Övrig information du själv lämnar i fritextfältet</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hur använder vi uppgifterna?</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>För att hantera din förfrågan och återkoppla till dig</li>
              <li>För att vidarebefordra din förfrågan till våra noga utvalda finanspartners (endast om du samtyckt till det)</li>
              <li>För att förbättra våra tjänster och kommunikation</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Rättslig grund</h2>
            <p className="text-gray-700 mb-4">Behandling sker med stöd av:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Samtycke (artikel 6.1.a GDPR) – när du godkänner delning till partners</li>
              <li>Avtal/berättigat intresse (artikel 6.1.b/f GDPR) – för att behandla din förfrågan</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Lagringstid</h2>
            <p className="text-gray-700 mb-6">
              Vi sparar dina uppgifter i högst 24 månader, därefter anonymiseras eller raderas de.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Dina rättigheter</h2>
            <p className="text-gray-700 mb-4">Du har rätt att begära:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Tillgång till dina uppgifter</li>
              <li>Rättelse eller radering</li>
              <li>Begränsning av behandling</li>
              <li>Dataportabilitet</li>
            </ul>
            <p className="text-gray-700 mb-6">
              Kontakta oss på <a href="mailto:info@likvidea.se" className="text-primary-600 hover:text-primary-700">info@likvidea.se</a> för att utöva dina rättigheter.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Personuppgiftsansvarig</h2>
            <p className="text-gray-700 mb-6">
              Likvidea AB<br />
              Kontakt: <a href="mailto:info@likvidea.se" className="text-primary-600 hover:text-primary-700">info@likvidea.se</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};