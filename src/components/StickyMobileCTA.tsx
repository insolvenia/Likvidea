import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export const StickyMobileCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('section');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight;
        
        // Show CTA when user has scrolled past hero section
        setIsVisible(scrollPosition > heroBottom + 200);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToForm = () => {
    const element = document.getElementById('application-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <button
        onClick={scrollToForm}
        className="w-full bg-primary-600 text-white py-4 px-6 rounded-xl hover:bg-primary-700 transition-all duration-200 font-semibold text-lg flex items-center justify-center group shadow-lg"
      >
        Skicka förfrågan
        <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};