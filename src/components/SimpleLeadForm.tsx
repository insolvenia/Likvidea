import React, { useState } from 'react';
import { Send, Check, Building2 } from 'lucide-react';
import { submitLead } from '../lib/functions';

interface FormData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  orgNumber: string;
  caseType: string;
  message: string;
  gdprConsent: boolean;
  consentShareWithPartners: boolean;
}

const caseTypes = [
  'Leasing & Hyra',
  'Fakturabelåning',
  'Företagslån',
  'Övrigt'
];

export const SimpleLeadForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    orgNumber: '',
    caseType: '',
    message: '',
    gdprConsent: false,
    consentShareWithPartners: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [leadId, setLeadId] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Företagets namn krävs';
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Kontaktperson krävs';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-post krävs';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ogiltig e-postadress';
    }

    if (!formData.orgNumber.trim()) {
      newErrors.orgNumber = 'Organisationsnummer krävs';
    } else {
      // Accept NNNNNN-NNNN or NNNNNNNNNN format (10-12 digits)
      const orgNumberDigits = formData.orgNumber.replace(/\D/g, '');
      if (orgNumberDigits.length < 10 || orgNumberDigits.length > 12) {
        newErrors.orgNumber = 'Organisationsnummer ska vara 10-12 siffror (ex. 559123-4567)';
      }
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Meddelande krävs';
    }

    if (!formData.gdprConsent) {
      newErrors.gdprConsent = 'GDPR-samtycke krävs';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await submitLead({
        companyName: formData.companyName,
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        orgNumber: formData.orgNumber,
        caseType: formData.caseType,
        message: formData.message,
        gdprConsent: formData.gdprConsent,
        consentShareWithPartners: formData.consentShareWithPartners,
        sourceOrigin: 'form'
      });

      setLeadId(result.leadId);
      
      setIsSubmitted(true);

    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg text-center">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Tack för din förfrågan!</h2>
        <p className="text-lg text-gray-600 mb-6">
          Ditt ärende-ID är <strong className="text-primary-600">{leadId}</strong>. Vi kontaktar dig inom kort.
        </p>
        <div className="bg-gray-50 p-6 rounded-xl">
          <p className="text-sm text-gray-600">
            Vi har skickat en bekräftelse till din e-post och kommer att återkomma med lämpliga lösningar för ditt behov.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <div className="flex items-center mb-8">
        <div className="bg-primary-100 p-3 rounded-xl mr-4">
          <Building2 className="h-8 w-8 text-primary-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Skicka förfrågan</h2>
          <p className="text-gray-600">Fyll i formuläret så kontaktar vi dig</p>
        </div>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800 text-sm">
            <strong>Fel vid skickning:</strong> {errors.submit}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Företagets namn *
            </label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Ditt företags namn"
            />
            {errors.companyName && <p className="text-red-600 text-sm mt-1">{errors.companyName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kontaktperson *
            </label>
            <input
              type="text"
              required
              value={formData.contactName}
              onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Ditt namn"
            />
            {errors.contactName && <p className="text-red-600 text-sm mt-1">{errors.contactName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              placeholder="namn@foretag.se"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organisationsnummer *
            </label>
            <input
              type="text"
              required
              value={formData.orgNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, orgNumber: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Ex. 559123-4567"
            />
            {errors.orgNumber && <p className="text-red-600 text-sm mt-1">{errors.orgNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefonnummer
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="070-000 00 00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ärende gäller
          </label>
          <select
            value={formData.caseType}
            onChange={(e) => setFormData(prev => ({ ...prev, caseType: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Välj typ av ärende</option>
            {caseTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meddelande *
          </label>
          <textarea
            required
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Beskriv ditt behov eller din fråga..."
          />
          {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="space-y-4">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={formData.gdprConsent}
                onChange={(e) => setFormData(prev => ({ ...prev, gdprConsent: e.target.checked }))}
                className="mt-1 mr-4 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <div>
                <span className="text-gray-900 font-medium">
                  GDPR-samtycke (krävs) *
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  Jag samtycker till att mina uppgifter behandlas enligt integritetspolicyn.
                </p>
              </div>
            </label>
            {errors.gdprConsent && <p className="text-red-600 text-sm mt-2">{errors.gdprConsent}</p>}

            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={formData.consentShareWithPartners}
                onChange={(e) => setFormData(prev => ({ ...prev, consentShareWithPartners: e.target.checked }))}
                className="mt-1 mr-4 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <div>
                <span className="text-gray-900 font-medium">
                  Dela med partners (valfritt)
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  Jag samtycker till att mina uppgifter delas med utvalda finansieringspartners i syfte att besvara min förfrågan.
                </p>
              </div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-600 text-white py-4 px-8 rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg flex items-center justify-center group"
        >
          {isSubmitting ? (
            'Skickar...'
          ) : (
            <>
              Skicka förfrågan
              <Send className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};