import React, { useState } from 'react';
import { Handshake, CheckCircle, TrendingUp, Clock, Users, X, Send } from 'lucide-react';

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
          <h3 className="text-2xl font-bold text-gray-900">Bli partner</h3>
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
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Tack för ditt intresse!</h4>
            <p className="text-gray-600">Vi återkommer till dig inom kort angående partnerskap.</p>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ämne</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meddelande *</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Berätta om ditt företag och hur vi kan samarbeta..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Skicka partnerförfrågan
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export const Partnership: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Smidigare avslut',
      description: 'Med finansiering som valbar modul'
    },
    {
      icon: Clock,
      title: 'Snabb handläggning',
      description: 'Och tydlig återkoppling'
    },
    {
      icon: Users,
      title: 'Ingen egen kreditrisk',
      description: 'Vi kopplar till banker/aktörer'
    }
  ];

  return (
    <>
      <section id="partnership" className="py-20 lg:py-28 bg-light-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-5 py-2.5 bg-white border border-primary-200 text-primary-700 rounded-full text-sm font-semibold mb-8 shadow-sm">
                <Handshake className="h-4 w-4 mr-2" />
                Partnerskap
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Bli partner – erbjud finansiering utan eget upplägg
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Som leverantör kan du erbjuda kunder finansiering genom våra partnerbanker. Vi sköter kontaktförmedlingen.
              </p>

              <div className="space-y-6 mb-10">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-primary-100 p-2 rounded-lg mr-4 flex-shrink-0">
                      <benefit.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setModalOpen(true)}
                className="bg-primary-600 text-white px-8 py-4 rounded-xl hover:bg-primary-700 transition-all duration-200 font-semibold text-lg flex items-center group shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Bli partner – kontakta oss
                <svg className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="relative">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Partnerfördelar
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-primary-50 rounded-xl">
                    <CheckCircle className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Öka försäljningen med finansieringsalternativ</span>
                  </div>
                  
                  <div className="flex items-center p-4 bg-primary-50 rounded-xl">
                    <CheckCircle className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Vi hanterar hela finansieringsprocessen</span>
                    <span className="text-gray-700">Vi hanterar hela finansieringsprocessen</span>
                  </div>
                  
                  <div className="flex items-center p-4 bg-primary-50 rounded-xl">
                    <CheckCircle className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Snabb utbetalning till dig som leverantör</span>
                  </div>
                  
                  <div className="flex items-center p-4 bg-primary-50 rounded-xl">
                    <CheckCircle className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Professionell kundservice och support</span>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl border border-primary-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      500+
                    </div>
                    <p className="text-gray-700 font-medium">
                      Genomförda finansieringar
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        subject="Partnerförfrågan"
      />
    </>
  );
};