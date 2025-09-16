import React, { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Handshake, CheckCircle, TrendingUp, Clock, Users, X, Send } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject?: string;
}

type FormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
  subject: string;
};

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, subject = "" }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
    subject,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: anropa submitLead här om du vill skicka till din Edge Function.
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      setFormData({ name: "", email: "", phone: "", message: "", subject: "" });
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">Bli partner</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Stäng"
            type="button"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
              <Send className="h-8 w-8 text-primary-600" />
            </div>
            <h4 className="mb-2 text-xl font-semibold text-gray-900">Tack för ditt intresse!</h4>
            <p className="text-gray-600">Vi återkommer till dig inom kort angående partnerskap.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Namn *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">E-post *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Telefon</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Ämne</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Meddelande *</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                placeholder="Berätta om ditt företag och hur vi kan samarbeta..."
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-700"
            >
              Skicka partnerförfrågan
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

type Benefit = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const Partnership: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const benefits: Benefit[] = [
    { icon: TrendingUp, title: "Smidigare avslut", description: "Med finansiering som valbar modul" },
    { icon: Clock, title: "Snabb handläggning", description: "Och tydlig återkoppling" },
    { icon: Users, title: "Ingen egen kreditrisk", description: "Vi kopplar till banker/aktörer" },
  ];

  return (
    <>
      <section id="partnership" className="bg-light-bg py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            {/* Vänster kolumn */}
            <div>
              <div className="mb-8 inline-flex items-center rounded-full border border-primary-200 bg-white px-5 py-2.5 text-sm font-semibold text-primary-700 shadow-sm">
                <Handshake className="mr-2 h-4 w-4" />
                Partnerskap
              </div>

              <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
                Bli partner – erbjud finansiering utan eget upplägg
              </h2>

              <p className="mb-8 text-xl leading-relaxed text-gray-600">
                Som leverantör kan du erbjuda kunder finansiering genom våra partnerbanker. Vi sköter kontaktförmedlingen.
              </p>

              <div className="mb-10 space-y-6">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-start">
                    <div className="mr-4 flex-shrink-0 rounded-lg bg-primary-100 p-2">
                      <b.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-gray-900">{b.title}</h3>
                      <p className="text-gray-600">{b.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setModalOpen(true)}
                className="group flex items-center rounded-xl bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-primary-700 hover:shadow-xl"
                type="button"
              >
                Bli partner – kontakta oss
                <svg
                  className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Höger kolumn */}
            <div className="relative">
              <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
                <h3 className="mb-6 text-2xl font-bold text-gray-900">Partnerfördelar</h3>

                <div className="space-y-4">
                  <div className="flex items-center rounded-xl bg-primary-50 p-4">
                    <CheckCircle className="mr-3 h-6 w-6 flex-shrink-0 text-primary-600" />
                    <span className="text-gray-700">Öka försäljningen med finansieringsalternativ</span>
                  </div>

                  <div className="flex items-center rounded-xl bg-primary-50 p-4">
                    <CheckCircle className="mr-3 h-6 w-6 flex-shrink-0 text-primary-600" />
                    <span className="text-gray-700">Vi hanterar hela finansieringsprocessen</span>
                  </div>

                  <div className="flex items-center rounded-xl bg-primary-50 p-4">
                    <CheckCircle className="mr-3 h-6 w-6 flex-shrink-0 text-primary-600" />
                    <span className="text-gray-700">Snabb utbetalning till dig som leverantör</span>
                  </div>

                  <div className="flex items-center rounded-xl bg-primary-50 p-4">
                    <CheckCircle className="mr-3 h-6 w-6 flex-shrink-0 text-primary-600" />
                    <span className="text-gray-700">Professionell kundservice och support</span>
                  </div>
                </div>
              </div>
            </div>
            {/* /Höger kolumn */}
          </div>
        </div>
      </section>

      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} subject="Partnerförfrågan" />
    </>
  );
};
