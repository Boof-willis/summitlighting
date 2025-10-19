"use client";
import React, { useState, useEffect } from 'react';

interface FormData {
  selectedIssue: string;
  fullName: string;
  phone: string;
  email: string;
  cityOrZip: string;
  description: string;
  consentGiven: boolean;
  timestamp: string;
  pageSource: string;
}

interface Errors {
  [key: string]: string;
}

interface SolarRepairQuizProps {
  onIssueSelect: (issue: string) => void;
}

const SolarRepairQuiz: React.FC<SolarRepairQuizProps> = ({ onIssueSelect }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(2); // Start at step 2 (step 1 is issue selection on landing page)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    selectedIssue: '',
    fullName: '',
    phone: '',
    email: '',
    cityOrZip: '',
    description: '',
    consentGiven: false,
    timestamp: '',
    pageSource: 'solar-repair-landing'
  });
  
  const [errors, setErrors] = useState<Errors>({});

  // Handle issue card click
  const handleIssueSelect = (issue: string) => {
    setFormData({ ...formData, selectedIssue: issue });
    setIsModalOpen(true);
    setCurrentStep(2);
    setIsSubmitted(false);
    onIssueSelect(issue);
  };

  // Close modal and reset
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentStep(2);
    setIsSubmitted(false);
    setFormData({
      selectedIssue: '',
      fullName: '',
      phone: '',
      email: '',
      cityOrZip: '',
      description: '',
      consentGiven: false,
      timestamp: '',
      pageSource: 'solar-repair-landing'
    });
    setErrors({});
  };

  // Phone number formatting
  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, '');
    
    if (phoneNumber.length === 0) return '';
    if (phoneNumber.length <= 3) return `(${phoneNumber}`;
    if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  // Validation functions
  const validateStep2 = () => {
    const newErrors: Errors = {};
    
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name';
    }
    
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Errors = {};
    
    if (!formData.cityOrZip || formData.cityOrZip.trim().length < 3) {
      newErrors.cityOrZip = 'Please enter your city or zip code';
    }
    
    if (!formData.consentGiven) {
      newErrors.consent = 'Please agree to be contacted';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step navigation
  const handleNextStep = () => {
    if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
      setErrors({});
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 3) {
      setCurrentStep(2);
      setErrors({});
    }
  };

  const handleChangeIssue = () => {
    setIsModalOpen(false);
    // Scroll to issue chooser section
    const issueChooser = document.getElementById('issue-chooser');
    if (issueChooser) {
      issueChooser.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep3()) return;
    
    setIsSubmitting(true);
    
    try {
      const submissionData = {
        ...formData,
        timestamp: new Date().toISOString(),
        phoneClean: formData.phone.replace(/\D/g, ''),
      };
      
      // TODO: Replace with actual GHL webhook URL
      const GHL_WEBHOOK_URL = 'YOUR_GHL_WEBHOOK_URL_HERE';
      
      // Uncomment when ready to connect to GHL
      /*
      const response = await fetch(GHL_WEBHOOK_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
      
      if (!response.ok) {
        console.error('GHL webhook error:', {
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error(`Webhook returned ${response.status}`);
      }
      
      const responseData = await response.text();
      console.log('GHL webhook response:', responseData);
      */
      
      // For now, just log the data
      console.log('Lead submitted (demo mode):', submissionData);
      
      setIsSubmitted(true);
      
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Something went wrong. Please call us at (385) 539-8892');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keyboard and click outside handlers
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleCloseModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const issues = [
    { title: "No Power / Low Output", icon: "⚡" },
    { title: "Inverter Error", icon: "⚠️" },
    { title: "Roof Leak", icon: "💧" },
    { title: "Critter Damage", icon: "🐿️" },
    { title: "Remove & Reinstall", icon: "🔧" },
    { title: "Other", icon: "❓" }
  ];

  const isStep2Valid = formData.fullName.trim().length >= 2 && 
                       formData.phone.replace(/\D/g, '').length === 10 && 
                       /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  return (
    <>
      {/* Issue Cards Section */}
      <div className="mb-12">
        {/* Interactive Indicator */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2">
            <span className="text-[#498dcb] text-sm font-medium font-heading">👆 Interactive Quiz</span>
            <span className="text-gray-600 text-sm font-heading">Click your issue to get started →</span>
          </div>
        </div>

        {/* Issue Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <button
              key={issue.title}
              onClick={() => handleIssueSelect(issue.title)}
              className="bg-white rounded-[32px] shadow-[0_0_32px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:scale-105 p-8 text-left cursor-pointer border-2 border-transparent hover:border-[#498dcb]/30 hover:bg-[#498dcb]/5 group"
            >
              <div className="text-4xl mb-4">{issue.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 font-heading group-hover:text-[#498dcb] transition-colors">
                {issue.title}
              </h3>
              <p className="text-gray-600 text-sm font-heading">
                Click to get your free diagnostic quote →
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ 
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto relative animate-[fadeInUp_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6 md:p-8">
              {!isSubmitted ? (
                <>
                  {/* Progress Bar */}
                  <div className="w-full mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 font-heading">Step {currentStep} of 3</span>
                      <span className="text-sm text-gray-600 font-heading">{Math.round((currentStep / 3) * 100)}% Complete</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#498dcb] transition-all duration-300 ease-in-out"
                        style={{ width: `${(currentStep / 3) * 100}%` }}
                        role="progressbar"
                        aria-valuenow={currentStep}
                        aria-valuemin={1}
                        aria-valuemax={3}
                      />
                    </div>
                  </div>

                  {/* Step 2: Contact Information */}
                  {currentStep === 2 && (
                    <div>
                      <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2 font-heading">
                          Let's Get You a Free Quote
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                          <span className="font-heading">Selected Issue:</span>
                          <span className="font-medium text-[#498dcb] font-heading">{formData.selectedIssue}</span>
                          <button 
                            onClick={handleChangeIssue}
                            className="text-[#498dcb] hover:underline ml-2 font-heading"
                          >
                            ✏️ Change
                          </button>
                        </div>
                        <p className="text-gray-600 text-sm mt-2 font-heading">
                          We'll call you within 24 hours to schedule your same-week diagnostic visit.
                        </p>
                      </div>

                      <form className="space-y-4">
                        {/* Full Name */}
                        <div>
                          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1 font-heading">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder="John Smith"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#498dcb] font-heading ${
                              errors.fullName ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.fullName && (
                            <p className="text-red-500 text-sm mt-1 font-heading" role="alert">{errors.fullName}</p>
                          )}
                        </div>

                        {/* Phone Number */}
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 font-heading">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            placeholder="(385) 555-1234"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#498dcb] font-heading ${
                              errors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-sm mt-1 font-heading" role="alert">{errors.phone}</p>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 font-heading">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@example.com"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#498dcb] font-heading ${
                              errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-1 font-heading" role="alert">{errors.email}</p>
                          )}
                        </div>

                        <button 
                          type="button"
                          onClick={handleNextStep}
                          disabled={!isStep2Valid}
                          className="w-full bg-[#498dcb] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#3a7ab5] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-heading min-h-[44px]"
                        >
                          Continue →
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Step 3: Location & Details */}
                  {currentStep === 3 && (
                    <div>
                      <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2 font-heading">
                          Almost Done!
                        </h2>
                        <p className="text-gray-600 text-sm font-heading">
                          Just need a few more details to provide an accurate quote.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* City or Zip Code */}
                        <div>
                          <label htmlFor="cityOrZip" className="block text-sm font-medium text-gray-700 mb-1 font-heading">
                            City or Zip Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="cityOrZip"
                            value={formData.cityOrZip}
                            onChange={(e) => setFormData({ ...formData, cityOrZip: e.target.value })}
                            placeholder="Salt Lake City or 84101"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#498dcb] font-heading ${
                              errors.cityOrZip ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.cityOrZip && (
                            <p className="text-red-500 text-sm mt-1 font-heading" role="alert">{errors.cityOrZip}</p>
                          )}
                        </div>

                        {/* Brief Description */}
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 font-heading">
                            Brief Description (Optional)
                          </label>
                          <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => {
                              if (e.target.value.length <= 500) {
                                setFormData({ ...formData, description: e.target.value });
                              }
                            }}
                            placeholder="Tell us more about what's happening with your solar system..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#498dcb] font-heading resize-none"
                          />
                          <p className="text-sm text-gray-500 mt-1 text-right font-heading">
                            {formData.description.length} / 500
                          </p>
                        </div>

                        {/* Consent Checkbox */}
                        <div>
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.consentGiven}
                              onChange={(e) => setFormData({ ...formData, consentGiven: e.target.checked })}
                              className="mt-1 w-5 h-5 text-[#498dcb] border-gray-300 rounded focus:ring-[#498dcb] cursor-pointer flex-shrink-0"
                            />
                            <span className="text-sm text-gray-700 font-heading">
                              I agree to receive calls/texts from R&R Solar about my repair request
                            </span>
                          </label>
                          <p className="text-xs text-gray-500 mt-1 ml-8 font-heading">
                            We respect your privacy. See our{' '}
                            <a 
                              href="https://www.randrsolarroofs.com/privacy-policy" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[#498dcb] hover:underline"
                            >
                              privacy policy
                            </a>.
                          </p>
                          {errors.consent && (
                            <p className="text-red-500 text-sm mt-1 ml-8 font-heading" role="alert">{errors.consent}</p>
                          )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3">
                          <button 
                            type="button"
                            onClick={handlePreviousStep}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors font-heading min-h-[44px]"
                          >
                            ← Back
                          </button>
                          <button 
                            type="submit"
                            disabled={!formData.consentGiven || isSubmitting}
                            className="flex-1 bg-[#498dcb] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#3a7ab5] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-heading min-h-[44px]"
                          >
                            {isSubmitting ? 'Submitting...' : 'Request Free Quote →'}
                          </button>
                        </div>

                        {/* Footer Link */}
                        <div className="text-center mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600 font-heading">
                            Need immediate help?{' '}
                            <a href="tel:+13855398892" className="text-[#498dcb] hover:underline font-medium">
                              Call (385) 539-8892
                            </a>
                          </p>
                        </div>
                      </form>
                    </div>
                  )}
                </>
              ) : (
                /* Thank You State */
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2 font-heading">
                    Request Received!
                  </h2>
                  
                  <p className="text-gray-600 mb-6 font-heading">
                    We'll review your <span className="font-medium">{formData.selectedIssue}</span> issue and call you within 24 hours.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                    <h3 className="font-semibold text-gray-900 mb-3 font-heading">What happens next:</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <span className="text-[#498dcb] font-semibold">1️⃣</span>
                        <span className="text-gray-700 font-heading">We'll review your {formData.selectedIssue.toLowerCase()} issue</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-[#498dcb] font-semibold">2️⃣</span>
                        <span className="text-gray-700 font-heading">A technician will call you within 24 hours</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-[#498dcb] font-semibold">3️⃣</span>
                        <span className="text-gray-700 font-heading">We'll schedule your same-week diagnostic visit</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-[#498dcb] font-semibold">4️⃣</span>
                        <span className="text-gray-700 font-heading">Get your system back online fast</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm font-medium text-gray-900 mb-1 font-heading">Need urgent service?</p>
                    <a 
                      href="tel:+13855398892" 
                      className="text-lg font-semibold text-[#498dcb] hover:underline font-heading"
                    >
                      Call (385) 539-8892
                    </a>
                  </div>
                  
                  <a 
                    href="https://www.randrsolarroofs.com/"
                    className="text-gray-600 hover:text-gray-900 underline text-sm font-heading inline-block"
                  >
                    Return to Homepage
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SolarRepairQuiz;

