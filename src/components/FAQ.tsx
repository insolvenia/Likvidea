import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData = [
    {
      question: 'Erbjuder Likvidea egna lån eller leasing?',
      answer:
        'Nej. Vi är en oberoende förmedlare som kopplar ihop ditt företag med banker och finanspartners.',
    },
    {
      question: 'Kostar tjänsten något?',
      answer:
        'Att skicka en förfrågan är kostnadsfritt och ej bindande. Eventuella kostnader framgår i partnerns erbjudande.',
    },
    {
      question: 'Hur hanterar ni mina uppgifter?',
      answer:
        'Vi delar endast nödvändig information med relevanta partners för att de ska kunna återkoppla till dig.',
    },
    {
      question: 'När hör någon av sig?',
      answer:
        'Vanligtvis snabbt efter komplett förfrågan. Exakta tider varierar mellan partners.',
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-light-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Vanliga frågor
          </h2>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <h3 className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
