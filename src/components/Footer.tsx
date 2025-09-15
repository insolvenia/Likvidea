import React from 'react';
import { Mail, Phone, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <img
                src="/likvidea.svg" // eller byt till /likvidea.png
                alt="Likvidea"
                className="h-20 w-auto" // större logga
              />
            </div>
            <p className="text-gray-400 mb-4">
              Oberoende förmedlare som kopplar företag till rätt finanspartners.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-primary" />
                <span>info@likvidea.se</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                <span>076-0099044</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tjänster</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Leasing & Hyra
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Företagslån
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Fakturabelåning
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Kundfinansiering
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Juridiskt</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="/integritetspolicy"
                  className="hover:text-primary transition-colors flex items-center"
                >
                  Integritetspolicy
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>
                <a
                  href="/villkor"
                  className="hover:text-primary transition-colors flex items-center"
                >
                  Allmänna villkor
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>
                <a
                  href="/cookies"
                  className="hover:text-primary transition-colors flex items-center"
                >
                  Cookie-policy
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>
                <a
                  href="/klagomal"
                  className="hover:text-primary transition-colors flex items-center"
                >
                  Klagomål
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2024 Likvidea AB. Alla rättigheter förbehållna.
            </p>
            <p className="text-sm text-slate-400 mt-4 md:mt-2 max-w-2xl text-center md:text-right">
              Likvidea är en oberoende kontaktförmedlare. Alla krediter och
              avtal ingås direkt mellan kund och respektive bank eller
              finanspartner. Inga bindande erbjudanden lämnas på denna
              webbplats.
            </p>
            <div className="flex mt-4 md:mt-0 ml-4">
              <a
                href="https://linkedin.com/company/likvidea"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
