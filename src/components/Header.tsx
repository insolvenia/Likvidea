import React from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: (isOpen: boolean) => void;
  isMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    onMenuToggle(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Endast logga */}
          <a href="#top" className="flex items-center">
            <img
              src="/likvidea.svg" // eller byt till /likvidea.png
              alt="Likvidea"
              className="h-30 w-auto" // justera storleken här (t.ex. h-14 eller h-16)
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <button
              onClick={() => scrollToSection('usp')}
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              Så funkar det
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              Tjänster
            </button>
            <button
              onClick={() => scrollToSection('partnership')}
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              Partnerskap
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollToSection('application-form')}
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              Ansök
            </button>
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => scrollToSection('partnership')}
              className="bg-primary-600 text-white px-6 py-2.5 rounded-xl hover:bg-primary-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Bli partner – kontakta oss
            </button>
            <button
              onClick={() => scrollToSection('application-form')}
              className="border-2 border-primary-600 text-primary-600 px-6 py-2.5 rounded-xl hover:bg-primary-600 hover:text-white transition-all duration-200 font-semibold"
            >
              Ansök nu
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => onMenuToggle(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-6 animate-slide-down">
            <nav className="flex flex-col space-y-6">
              <button
                onClick={() => scrollToSection('usp')}
                className="text-gray-700 hover:text-primary-600 transition-colors text-left font-medium"
              >
                Så funkar det
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="text-gray-700 hover:text-primary-600 transition-colors text-left font-medium"
              >
                Tjänster
              </button>
              <button
                onClick={() => scrollToSection('partnership')}
                className="text-gray-700 hover:text-primary-600 transition-colors text-left font-medium"
              >
                Partnerskap
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-gray-700 hover:text-primary-600 transition-colors text-left font-medium"
              >
                FAQ
              </button>
              <button
                onClick={() => scrollToSection('application-form')}
                className="text-gray-700 hover:text-primary-600 transition-colors text-left font-medium"
              >
                Ansök
              </button>
              <button
                onClick={() => scrollToSection('partnership')}
                className="bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors font-semibold text-left w-full shadow-lg"
              >
                Bli partner – kontakta oss
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
