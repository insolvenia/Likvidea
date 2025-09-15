import React from 'react';
import { ArrowRight, Users } from 'lucide-react';

export const CTABanners: React.FC = () => {
  const scrollToApplication = () => {
    const element = document.getElementById('application-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPartnership = () => {
    const element = document.getElementById('partnership');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* First CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Redo att komma igång?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Få en kostnadsfri genomgång av dina finansieringsmöjligheter
          </p>
          <button
            onClick={scrollToApplication}
            className="bg-white text-primary-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold text-lg flex items-center justify-center mx-auto group shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Skicka förfrågan
            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Second CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Users className="h-12 w-12 text-white mr-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Leverantör med många kundcase?
            </h2>
          </div>
          <p className="text-xl text-gray-300 mb-8">
            Erbjud dina kunder finansieringsalternativ och öka din försäljning
          </p>
          <button
            onClick={scrollToPartnership}
            className="bg-primary-600 text-white px-8 py-4 rounded-xl hover:bg-primary-700 transition-all duration-200 font-semibold text-lg flex items-center justify-center mx-auto group shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Bli partner – kontakta oss
            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </>
  );
};