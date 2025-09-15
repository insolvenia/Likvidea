import React, { useState } from 'react';
import { Car, Users, FileText, DollarSign, X, Send } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject?: string;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, subject = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    subject: subject
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      setFormData({ name: '', email: '', phone: '', message: '', subject: '' });
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Kontakta oss</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-primary-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Tack för ditt meddelande!</h4>
            <p className="text-gray-600">Vi återkommer till dig inom kort.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Namn *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-post *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            {subject && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ämne</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meddelande *</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Skicka meddelande
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export const ServiceSections: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSubject, setModalSubject] = useState('');

  const openModal = (subject: string = '') => {
    setModalSubject(subject);
    setModalOpen(true);
  };

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

  const services = [
    {
      icon: Car,
      title: 'Leasing & Hyra',
      content: 'Sprid kostnaden över tid via våra partnerbanker.',
      cta: {
        text: 'Skicka förfrågan',
        action: scrollToApplication
      }
    },
    {
      icon: FileText,
      title: 'Fakturabelåning',
      content: 'Frigör kapital ur obetalda fakturor via våra finanspartners.',
      cta: {
        text: 'Skicka förfrågan',
        action: scrollToApplication
      }
    },
    {
      icon: DollarSign,
      title: 'Företagslån',
      content: 'För tillväxt, marknadsföring eller kassaflöde – via bank/partner.',
      cta: {
        text: 'Ansök / Skicka förfrågan',
        action: scrollToApplication
      }
    },
    {
      icon: Users,
      title: 'Kundfinansiering (för leverantörer)',
      content: 'Erbjud kunder finansiering; vi kopplar ihop dig med rätt partner.',
      cta: {
        text: 'Bli partner',
        action: scrollToPartnership
      }
    }
  ];

  return (
    <>
      <section id="services" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Våra tjänster
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Omfattande finansieringslösningar för företag i alla storlekar
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <div key={index} className="bg-light-bg p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="flex items-start mb-6">
                  <div className="bg-primary-100 p-3 rounded-xl mr-4 flex-shrink-0">
                    <service.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {service.content}
                    </p>
                    <button
                      onClick={service.cta.action}
                      className="bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors font-medium inline-flex items-center group"
                    >
                      {service.cta.text}
                      <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        subject={modalSubject}
      />
    </>
  );
};