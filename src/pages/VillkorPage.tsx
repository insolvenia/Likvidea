import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const VillkorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header onMenuToggle={() => {}} isMenuOpen={false} />
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Allmänna villkor</h1>
          <p className="text-gray-600 mb-8">Senast uppdaterad: 10 september 2024</p>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Om tjänsten</h2>
            <p className="text-gray-700 mb-6">
              Likvidea tillhandahåller en digital förmedlingstjänst som kostnadsfritt kopplar ihop företag 
              med lämpliga finanspartners baserat på den information som företaget själv anger.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Ingen bindning</h2>
            <p className="text-gray-700 mb-6">
              Genom att fylla i en förfrågan förbinder du dig inte till något avtal. Eventuella krediter 
              och avtal ingås alltid direkt mellan dig och respektive finanspartner/bank.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Ansvarsfördelning</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Likvidea ansvarar för att vidarebefordra din förfrågan till relevanta partners (om du samtyckt)</li>
              <li>Likvidea ansvarar inte för beslut som fattas av finanspartners, ej heller för villkor, priser eller tillgänglighet hos dessa</li>
              <li>Du som kund ansvarar för att de uppgifter du lämnar är korrekta</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Tjänstens kostnad</h2>
            <p className="text-gray-700 mb-6">
              Tjänsten är kostnadsfri för dig som lämnar in en förfrågan. Likvidea kan erhålla ersättning 
              från finanspartners vid förmedlade affärer.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Tillämplig lag</h2>
            <p className="text-gray-700 mb-6">
              Svensk lag tillämpas. Eventuella tvister prövas av svensk domstol med Stockholms tingsrätt som första instans.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};