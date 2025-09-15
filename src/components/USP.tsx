import React from 'react';
import { TrendingUp, Handshake, Shield, Users } from 'lucide-react';

export const USP: React.FC = () => {
  const usps = [
    {
      icon: TrendingUp,
      title: "Spara tid",
      description: "Ett formulär, flera möjliga finanspartners"
    },
    {
      icon: Shield,
      title: "Rätt matchning",
      description: "Vi skickar till aktörer för just din typ av behov"
    },
    {
      icon: Handshake,
      title: "Transparent",
      description: "Du får återkoppling direkt från våra partners"
    },
    {
      icon: Users,
      title: "Tryggt",
      description: "Vi delar bara det som krävs för att presentera erbjudanden"
    }
  ];

  return (
    <section id="usp" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Fördelar med Likvidea
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Vi förmedlar kontakt mellan ditt företag och rätta finanspartners för bästa möjliga matchning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {usps.map((usp, index) => (
            <div key={index} className="bg-light-bg p-8 rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:-translate-y-1">
              <div className="bg-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-700 transition-colors">
                <usp.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {usp.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {usp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};