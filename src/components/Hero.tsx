import React from 'react';
import { CheckCircle, ArrowRight, Shield, Clock, FileCheck } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToPartnership = () => {
    const element = document.getElementById('partnership');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToApplication = () => {
    const element = document.getElementById('application-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-br from-light-bg via-primary-50 to-white py-20 lg:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100 rounded-full blur-3xl opacity-30 -translate-y-48 translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-100 rounded-full blur-3xl opacity-25 translate-y-48 -translate-x-48"></div>
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-accent-100 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-primary-200 text-primary-700 rounded-full text-sm font-semibold mb-8 shadow-sm animate-fade-in">
              <CheckCircle className="h-4 w-4 mr-2 text-primary-600" />
              Snabb process • Transparenta villkor • GDPR-säkrat
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8 font-display animate-slide-up">
              Vi kopplar ihop ditt företag med rätt finansieringspartner
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed max-w-2xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Fyll i din förfrågan – vi matchar dig med banker/partners för leasing & hyra, fakturabelåning eller företagslån.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <button
                onClick={scrollToApplication}
                className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-10 py-4 rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all duration-300 font-semibold text-lg flex items-center justify-center group shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
              >
                Skicka förfrågan
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button
                onClick={scrollToPartnership}
                className="bg-white border-2 border-primary-600 text-primary-600 px-10 py-4 rounded-xl hover:bg-primary-600 hover:text-white transition-all duration-300 font-semibold text-lg transform hover:-translate-y-1 hover:scale-105 shadow-sm hover:shadow-lg"
              >
                Bli partner – kontakta oss
              </button>
            </div>

            {/* Disclaimer */}
            <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-slide-up" style={{ animationDelay: '0.25s' }}>
              <p className="text-sm text-gray-600 text-center">
                Direktlikvid är en oberoende förmedlare. Vi vidarebefordrar din förfrågan till noga utvalda finanspartners/banker. Inga bindande erbjudanden lämnas på denna sida.
              </p>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200/50">
                <div className="bg-primary-100 p-2 rounded-lg mr-3">
                  <Clock className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <span className="text-gray-900 font-semibold text-sm">Kostnadsfritt</span>
                  <p className="text-gray-600 text-xs">Ingen avgift</p>
                </div>
              </div>
              
              <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200/50">
                <div className="bg-gray-100 p-2 rounded-lg mr-3">
                  <Shield className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <span className="text-gray-900 font-semibold text-sm">Ej bindande</span>
                  <p className="text-gray-600 text-xs">Ingen förpliktelse</p>
                </div>
              </div>
              
              <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200/50">
                <div className="bg-gray-100 p-2 rounded-lg mr-3">
                  <FileCheck className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <span className="text-gray-900 font-semibold text-sm">GDPR-säkrat</span>
                  <p className="text-gray-600 text-xs">Trygg hantering</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 relative">
              
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <span className="bg-primary-600 text-white rounded-full px-3 py-1 text-sm font-medium mr-3">
                      Så funkar det
                    </span>
                    <span className="text-sm text-slate-500 font-medium">Tre snabba steg</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start p-5 bg-white rounded-xl border border-slate-200">
                    <div>
                      <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">1</div>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Skicka förfrågan</span>
                      <p className="text-sm text-slate-600">1–2 minuter</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-5 bg-white rounded-xl border border-slate-200">
                    <div>
                      <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">2</div>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Vi matchar partners</span>
                      <p className="text-sm text-slate-600">24–48 timmar</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-5 bg-white rounded-xl border border-slate-200">
                    <div>
                      <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">3</div>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Du får förslag & väljer</span>
                      <p className="text-sm text-slate-600">Obligationsfria förslag</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-slate-200 pt-6 mt-6">
                  <p className="text-sm text-slate-600 text-center">
                    Obligationsfria förslag. Ingen kreditrisk för leverantör.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};