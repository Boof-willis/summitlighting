import React, { useEffect, useState } from 'react';

interface FormData {
  selectedPropertyType: string;
  fullName: string;
  phone: string;
  email: string;
  cityOrZip: string;
  description: string;
  consentGiven: boolean;
}

const PROPERTY_TYPES = [
  { title: 'Small home', subtitle: '1,500–2,500 sq ft' },
  { title: 'Medium home', subtitle: '2,500–3,500 sq ft' },
  { title: 'Large home', subtitle: '3,500+ sq ft' },
  { title: 'Commercial', subtitle: 'Business or storefront' },
  { title: 'HOA / complex', subtitle: 'Multiple units' },
  { title: 'Something else', subtitle: 'General inquiry' },
];

const TOTAL_STEPS = 3;

// Ad/campaign params captured on landing and kept for the whole session, so
// a visitor who lands on / with UTMs and later submits on /contact still
// carries their attribution into the webhook payload.
const TRACKING_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid'];

function captureTracking(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const params = new URLSearchParams(window.location.search);
    const stored = JSON.parse(sessionStorage.getItem('sl_tracking') || '{}');
    TRACKING_KEYS.forEach((k) => {
      const v = params.get(k) || stored[k];
      if (v) out[k] = v;
    });
    if (Object.keys(out).length > 0) sessionStorage.setItem('sl_tracking', JSON.stringify(out));
  } catch {
    /* sessionStorage unavailable (private mode etc.) — submit without attribution */
  }
  return out;
}

interface Props {
  /** 'light' = solid cream panel; 'frost' = translucent glass over imagery */
  appearance?: 'light' | 'frost';
}

export default function ChristmasLightQuote({ appearance = 'light' }: Props) {
  const frost = appearance === 'frost';
  const T = frost
    ? {
        panel: 'bg-white/10 backdrop-blur-2xl border-white/20',
        label: 'text-white/60',
        heading: 'text-white',
        sub: 'text-white/60',
        card: 'border-white/20 bg-white/10 hover:border-white/70',
        cardSelected: 'border-white bg-white/20',
        cardTitle: 'text-white',
        cardSub: 'text-white/60',
        input: 'bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white/70',
        inputError: 'border-red-300',
        error: 'text-red-300',
        back: 'text-white/70',
        primary: 'bg-white text-[#0B0C0A] hover:bg-white/85',
        progressOn: 'bg-white',
        progressOff: 'bg-white/20',
        consent: 'text-white/70',
        checkbox: 'accent-white',
        successIcon: 'bg-white/15',
        successHeading: 'text-white',
        successBody: 'text-white/80',
        successLink: 'text-white',
      }
    : {
        panel: 'bg-[#F7F6F1] border-black/10',
        label: 'text-gray-500',
        heading: 'text-gray-900',
        sub: 'text-gray-500',
        card: 'border-black/10 bg-white hover:border-[#0B0C0A]',
        cardSelected: 'border-[#0B0C0A] bg-[#0B0C0A]/5',
        cardTitle: 'text-gray-900',
        cardSub: 'text-gray-500',
        input: 'bg-white border-black/10 text-gray-900 placeholder:text-gray-400 focus:ring-[#0B0C0A]/60',
        inputError: 'border-red-400',
        error: 'text-red-500',
        back: 'text-gray-500',
        primary: 'bg-[#0B0C0A] text-white hover:bg-[#23291F]',
        progressOn: 'bg-[#0B0C0A]',
        progressOff: 'bg-black/10',
        consent: 'text-gray-600',
        checkbox: 'accent-[#0B0C0A]',
        successIcon: 'bg-[#0B0C0A]',
        successHeading: 'text-gray-900',
        successBody: 'text-gray-600',
        successLink: 'text-gray-900',
      };
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Honeypot: humans never see or fill this field; bots auto-filling every
  // input give themselves away and get a silent fake success.
  const [honeypot, setHoneypot] = useState('');

  useEffect(() => {
    captureTracking();
  }, []);
  const [formData, setFormData] = useState<FormData>({
    selectedPropertyType: '',
    fullName: '',
    phone: '',
    email: '',
    cityOrZip: '',
    description: '',
    consentGiven: false,
  });

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length < 4) return digits;
    if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const validateContact = () => {
    const next: Record<string, string> = {};
    if (formData.fullName.trim().length < 2) next.fullName = 'Please enter your name';
    if (formData.phone.replace(/\D/g, '').length !== 10) next.phone = 'Please enter a 10-digit phone number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = 'Please enter a valid email';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateFinal = () => {
    const next: Record<string, string> = {};
    if (formData.cityOrZip.trim().length < 2) next.cityOrZip = 'Please enter your city or ZIP';
    if (!formData.consentGiven) next.consentGiven = 'Please confirm so we can reach out about your quote';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const selectType = (title: string) => {
    setFormData((f) => ({ ...f, selectedPropertyType: title }));
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFinal()) return;

    // Bot filled the invisible field: report success, send nothing.
    if (honeypot.trim() !== '') {
      setIsSubmitted(true);
      return;
    }

    setIsSubmitting(true);

    const submissionData = {
      ...formData,
      ...captureTracking(),
      website: honeypot,
      timestamp: new Date().toISOString(),
      pageSource: window.location.href,
      referrer: document.referrer,
    };

    try {
      // Pages Function (functions/api/quote.ts) emails the lead to the
      // business via Cloudflare Email Service.
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });
      if (!response.ok) throw new Error(`Quote endpoint returned ${response.status}`);
      setIsSubmitted(true);
    } catch (error) {
      // Endpoint unreachable (local dev, or email service not yet onboarded):
      // fall back to composing the lead in the visitor's own SMS/email app so
      // it is never lost.
      console.error('Form submission error, using compose fallback:', error);
      const body = encodeURIComponent(
        `Quote request\nName: ${formData.fullName}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nCity/ZIP: ${formData.cityOrZip}\nProperty: ${formData.selectedPropertyType}${formData.description ? `\nDetails: ${formData.description}` : ''}`
      );
      const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
      window.location.href = isMobile
        ? `sms:+18015988307?&body=${body}`
        : `mailto:info@summitlightingco.com?subject=${encodeURIComponent('Quote request from ' + formData.fullName)}&body=${body}`;
      setUsedFallback(true);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-xl border px-4 py-3 font-heading text-base focus:outline-none focus:ring-2 ${T.input} ${
      errors[field] ? T.inputError : ''
    }`;

  return (
    <div className={`mx-auto w-full max-w-[640px] rounded-3xl border p-6 text-left md:p-10 ${T.panel}`}>
      {isSubmitted ? (
        <div className="py-4 text-center">
          <div className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full ${T.successIcon}`}>
            <svg className="h-7 w-7 text-[#E0A83E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className={`mb-3 font-heading text-2xl font-semibold ${T.successHeading}`}>Request received.</h3>
          <p className={`mx-auto mb-6 max-w-[420px] font-heading ${T.successBody}`}>
            {usedFallback
              ? 'Your details are ready to send. If your messaging or email app opened, just hit send and we will get back to you the same day.'
              : 'We will review your details and reach out within one business day with your quote.'}
          </p>
          <a
            href="tel:+18015988307"
            className={`font-heading font-medium underline underline-offset-4 ${T.successLink}`}
            onClick={() => window.dispatchEvent(new Event('PhoneCallClick'))}
          >
            Or call or text (801) 598-8307
          </a>
        </div>
      ) : (
        <form id="quote-form" onSubmit={handleSubmit} noValidate>
          {/* Honeypot - keep invisible to humans */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Website
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </label>
          </div>
          {/* Progress */}
          <div className="mb-7">
            <div className={`mb-2 flex items-center justify-between font-heading text-xs tracking-[0.12em] uppercase ${T.label}`}>
              <span>Free quote</span>
              <span>
                Step {step} of {TOTAL_STEPS}
              </span>
            </div>
            <div className="flex gap-1.5" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={TOTAL_STEPS}>
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${s <= step ? T.progressOn : T.progressOff}`}
                />
              ))}
            </div>
          </div>

          {step === 1 && (
            <fieldset>
              <legend className={`mb-5 font-heading text-xl font-semibold ${T.heading}`}>What are we lighting?</legend>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {PROPERTY_TYPES.map((type) => (
                  <button
                    key={type.title}
                    type="button"
                    onClick={() => selectType(type.title)}
                    className={`rounded-xl border px-4 py-3.5 text-left transition-colors duration-150 ${
                      formData.selectedPropertyType === type.title ? T.cardSelected : T.card
                    }`}
                  >
                    <span className={`block font-heading font-medium ${T.cardTitle}`}>{type.title}</span>
                    <span className={`block font-heading text-sm ${T.cardSub}`}>{type.subtitle}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <div>
              <h3 className={`mb-1 font-heading text-xl font-semibold ${T.heading}`}>How do we reach you?</h3>
              <p className={`mb-5 font-heading text-sm ${T.sub}`}>
                {formData.selectedPropertyType} ·{' '}
                <button type="button" className="underline underline-offset-2" onClick={() => setStep(1)}>
                  change
                </button>
              </p>
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="Full name"
                    aria-label="Full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData((f) => ({ ...f, fullName: e.target.value }))}
                    className={inputClass('fullName')}
                  />
                  {errors.fullName && <p className={`mt-1 font-heading text-sm ${T.error}`}>{errors.fullName}</p>}
                </div>
                <div>
                  <input
                    type="tel"
                    autoComplete="tel"
                    placeholder="Phone"
                    aria-label="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((f) => ({ ...f, phone: formatPhoneNumber(e.target.value) }))}
                    className={inputClass('phone')}
                  />
                  {errors.phone && <p className={`mt-1 font-heading text-sm ${T.error}`}>{errors.phone}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="Email"
                    aria-label="Email"
                    value={formData.email}
                    onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                    className={inputClass('email')}
                  />
                  {errors.email && <p className={`mt-1 font-heading text-sm ${T.error}`}>{errors.email}</p>}
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`font-heading text-sm underline underline-offset-2 ${T.back}`}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => validateContact() && setStep(3)}
                  className={`rounded-full px-8 py-3 font-heading text-base transition-colors ${T.primary}`}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className={`mb-5 font-heading text-xl font-semibold ${T.heading}`}>Where is the property?</h3>
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    autoComplete="postal-code"
                    placeholder="City or ZIP code"
                    aria-label="City or ZIP code"
                    value={formData.cityOrZip}
                    onChange={(e) => setFormData((f) => ({ ...f, cityOrZip: e.target.value }))}
                    className={inputClass('cityOrZip')}
                  />
                  {errors.cityOrZip && <p className={`mt-1 font-heading text-sm ${T.error}`}>{errors.cityOrZip}</p>}
                </div>
                <textarea
                  placeholder="Anything we should know? Colors, timeline, special requests (optional)"
                  aria-label="Special requests"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                  className={`${inputClass('description')} resize-none`}
                />
                <label className="flex cursor-pointer items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    checked={formData.consentGiven}
                    onChange={(e) => setFormData((f) => ({ ...f, consentGiven: e.target.checked }))}
                    className={`mt-0.5 h-5 w-5 cursor-pointer rounded border-black/20 ${T.checkbox}`}
                  />
                  <span className={`font-heading text-sm ${T.consent}`}>
                    Summit Lighting Co. can contact me about my quote request.
                  </span>
                </label>
                {errors.consentGiven && <p className={`font-heading text-sm ${T.error}`}>{errors.consentGiven}</p>}
              </div>
              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className={`font-heading text-sm underline underline-offset-2 ${T.back}`}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`rounded-full px-8 py-3 font-heading text-base transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${T.primary}`}
                >
                  {isSubmitting ? 'Sending…' : 'Get my quote'}
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
