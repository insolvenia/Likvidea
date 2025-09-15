import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Send, Check, Mail } from 'lucide-react';
import { submitComplaint } from '../lib/functions';

export const KlagomalPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'E-post krävs';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ogiltig e-postadress';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Meddelande krävs';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await submitComplaint({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        gdprConsent: true,
        sourceOrigin: 'klagomal-page'
      });

      setComplaintId(result.complaintId);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <Header onMenuToggle={() => {}} isMenuOpen={false} />
        <main className="py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Tack för ditt klagomål!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Ditt klagomål-ID är <strong className="text-primary-600">{complaintId}</strong>. Vi kommer att återkomma inom 2 arbetsdagar.
            </p>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-sm text-gray-600">
                Alla klagomål behandlas med högsta prioritet för att förbättra våra tjänster.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onMenuToggle={() => {}} isMenuOpen={false} />
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Klagomål</h1>
          
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-8">
            <p className="text-lg text-gray-700 mb-4">
              Vi vill alltid förbättra oss. Har du synpunkter eller ett klagomål kan du kontakta oss 
              via formuläret nedan eller direkt via e-post.
            </p>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-primary-600 mr-2" />
              <a href="mailto:info@likvidea.se" className="text-primary-600 hover:text-primary-700 font-medium">
                info@likvidea.se
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Hur vi hanterar klagomål</h2>
              <div className="prose prose-lg">
                <p className="text-gray-700 mb-4">
                  Alla klagomål hanteras skyndsamt och med högsta prioritet. Vi ser varje klagomål 
                  som en möjlighet att förbättra våra tjänster.
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>Vi bekräftar alltid mottagna klagomål inom 2 arbetsdagar.</strong>
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Skicka klagomål</h3>
              
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <p className="text-red-800 text-sm">
                    <strong>Fel vid skickning:</strong> {errors.submit}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Namn
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ditt namn"
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-post *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="din@email.se"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="070-000 00 00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meddelande *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Beskriv ditt klagomål eller dina synpunkter..."
                  />
                  {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <div>
                      <span className="text-gray-900 font-medium">
                        GDPR-samtycke (krävs) *
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        Jag samtycker till att mina uppgifter behandlas enligt integritetspolicyn för att hantera mitt klagomål.
                      </p>
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-600 text-white py-3 px-6 rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center group"
                >
                  {isSubmitting ? (
                    'Skickar...'
                  ) : (
                    <>
                      Skicka klagomål
                      <Send className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};