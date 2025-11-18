'use client';

import { useState, useEffect, useRef } from 'react';
import type { IntakeFormData } from '@/types/form';
import Image from 'next/image';
import StepNavigation from './StepNavigation';
import ReviewSummary from './ReviewSummary';

// Tooltip component
function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        className="text-webifyd-blue hover:text-webifyd-navy transition-colors"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </button>
      {show && (
        <span className="absolute z-10 w-64 p-2 text-xs text-white bg-gray-900 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2 block">
          {text}
          <span className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 block">
            <span className="border-4 border-transparent border-t-gray-900 block"></span>
          </span>
        </span>
      )}
    </span>
  );
}

const initialFormData: IntakeFormData = {
  companyInfo: {
    companyName: '',
    contactPerson: '',
    position: '',
    email: '',
    phone: '',
    website: '',
    officeLocation: '',
  },
  campaignObjective: {
    goals: [],
    otherGoal: '',
    expectedOutcome: '',
  },
  targetAudience: {
    customerTypes: [],
    otherCustomerType: '',
    geographicTargeting: [],
    specificEmirates: '',
    internationalMarkets: '',
    languages: [],
    otherLanguage: '',
  },
  campaignBudget: {
    dailyBudget: '',
    otherBudget: '',
    budgetIncrease: '',
  },
  productsServices: {
    coreProducts: '',
    catalogLink: '',
    focusProducts: '',
  },
  leadDefinition: {
    leadTypes: [],
    otherLeadType: '',
  },
  keywordsCompetitors: {
    keywords: '',
    competitors: '',
    competitorNotes: '',
  },
  usps: {
    selectedUSPs: [],
    otherUSPs: '',
  },
  brandMaterials: {
    materials: [],
    notes: '',
  },
  campaignTimeline: {
    duration: '',
    launchDate: '',
  },
  additionalNotes: {
    notes: '',
  },
};

export default function IntakeForm() {
  const [formData, setFormData] = useState<IntakeFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [currentSection, setCurrentSection] = useState(1);
  const [currentStep, setCurrentStep] = useState(1); // 1-5 for multi-step
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Calculate form completion percentage
  const calculateProgress = () => {
    const requiredFields = [
      formData.companyInfo.companyName,
      formData.companyInfo.contactPerson,
      formData.companyInfo.email,
    ];

    const optionalFilledFields = [
      formData.campaignObjective.goals.length > 0,
      formData.targetAudience.customerTypes.length > 0,
      formData.targetAudience.geographicTargeting.length > 0,
      formData.campaignBudget.dailyBudget || formData.campaignBudget.otherBudget,
      formData.productsServices.coreProducts,
      formData.leadDefinition.leadTypes.length > 0,
    ].filter(Boolean).length;

    const totalRequired = requiredFields.filter(Boolean).length;
    const requiredProgress = (totalRequired / requiredFields.length) * 60; // 60% for required
    const optionalProgress = (optionalFilledFields / 6) * 40; // 40% for optional key fields

    return Math.min(Math.round(requiredProgress + optionalProgress), 100);
  };

  // Load saved draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('google-ads-intake-draft');
    const savedTimestamp = localStorage.getItem('google-ads-intake-draft-timestamp');

    if (savedDraft && savedTimestamp) {
      const draftAge = Date.now() - parseInt(savedTimestamp);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;

      // Only restore if draft is less than 7 days old
      if (draftAge < sevenDays) {
        try {
          const parsedDraft = JSON.parse(savedDraft);
          setFormData(parsedDraft);
          setHasDraft(true);
          setLastSaved(new Date(parseInt(savedTimestamp)));

          // Restore step position
          const savedStep = localStorage.getItem('google-ads-intake-current-step');
          const savedCompletedSteps = localStorage.getItem('google-ads-intake-completed-steps');
          if (savedStep) {
            setCurrentStep(parseInt(savedStep));
          }
          if (savedCompletedSteps) {
            setCompletedSteps(JSON.parse(savedCompletedSteps));
          }
        } catch (error) {
          console.error('Failed to restore draft:', error);
          localStorage.removeItem('google-ads-intake-draft');
          localStorage.removeItem('google-ads-intake-draft-timestamp');
          localStorage.removeItem('google-ads-intake-current-step');
          localStorage.removeItem('google-ads-intake-completed-steps');
        }
      } else {
        // Clear old drafts
        localStorage.removeItem('google-ads-intake-draft');
        localStorage.removeItem('google-ads-intake-draft-timestamp');
        localStorage.removeItem('google-ads-intake-current-step');
        localStorage.removeItem('google-ads-intake-completed-steps');
      }
    }
  }, []);

  // Auto-save to localStorage every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      // Only save if there's some data entered
      const hasData = formData.companyInfo.companyName ||
                      formData.companyInfo.email ||
                      formData.campaignObjective.goals.length > 0;

      if (hasData) {
        localStorage.setItem('google-ads-intake-draft', JSON.stringify(formData));
        localStorage.setItem('google-ads-intake-draft-timestamp', Date.now().toString());
        localStorage.setItem('google-ads-intake-current-step', currentStep.toString());
        localStorage.setItem('google-ads-intake-completed-steps', JSON.stringify(completedSteps));
        setLastSaved(new Date());
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [formData, currentStep, completedSteps]);

  // Track section visibility with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionIndex = sectionRefs.current.indexOf(entry.target as HTMLElement);
            if (sectionIndex !== -1) {
              setCurrentSection(sectionIndex + 1);
            }
          }
        });
      },
      { threshold: 0.5, rootMargin: '-100px' }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const handleCheckboxChange = (
    section: keyof IntakeFormData,
    field: string,
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => {
      const sectionData = prev[section] as any;
      const currentArray = sectionData[field] || [];

      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: checked
            ? [...currentArray, value]
            : currentArray.filter((item: string) => item !== value),
        },
      };
    });
  };

  // Validation functions
  const validateEmail = (email: string): string | null => {
    if (!email) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : 'Please enter a valid email address';
  };

  const validatePhone = (phone: string): string | null => {
    if (!phone) return null;
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7
      ? null
      : 'Please enter a valid phone number';
  };

  const validateURL = (url: string): string | null => {
    if (!url) return null;
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return null;
    } catch {
      return 'Please enter a valid URL (e.g., www.example.com)';
    }
  };

  const validateField = (section: string, field: string, value: string) => {
    const fieldKey = `${section}.${field}`;
    let error: string | null = null;

    if (field === 'email') {
      error = validateEmail(value);
    } else if (field === 'phone') {
      error = validatePhone(value);
    } else if (field === 'website' || field === 'catalogLink') {
      error = validateURL(value);
    }

    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[fieldKey] = error;
      } else {
        delete newErrors[fieldKey];
      }
      return newErrors;
    });
  };

  const handleInputChange = (
    section: keyof IntakeFormData,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));

    // Validate on change
    validateField(section, field, value);
  };

  // Step validation
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Company Information
        return !!(
          formData.companyInfo.companyName &&
          formData.companyInfo.contactPerson &&
          formData.companyInfo.email &&
          !fieldErrors['companyInfo.email']
        );
      case 2: // Campaign Details - optional, always valid
        return true;
      case 3: // Budget & Products - optional, always valid
        return true;
      case 4: // Strategy & Content - optional, always valid
        return true;
      case 5: // Review & Submit
        return validateStep(1); // Must have company info to submit
      default:
        return true;
    }
  };

  // Navigate to next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      // Move to next step
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setSubmitStatus({
        type: 'error',
        message: 'Please fill in all required fields before continuing.',
      });
      // Clear error after 5 seconds
      setTimeout(() => setSubmitStatus({ type: null, message: '' }), 5000);
    }
  };

  // Navigate to previous step
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Navigate to specific step (from stepper)
  const handleStepClick = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for validation errors before submitting
    if (Object.keys(fieldErrors).length > 0) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fix all validation errors before submitting.',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Clear saved draft before submitting
      localStorage.removeItem('google-ads-intake-draft');
      localStorage.removeItem('google-ads-intake-draft-timestamp');

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Form submitted successfully! We will contact you soon.',
        });
        setFormData(initialFormData);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(data.error || 'Submission failed');
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'An error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-webifyd-gray-light to-white py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-webifyd-navy to-webifyd-blue text-white p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <div className="mb-6 inline-block bg-white px-6 py-3 rounded-lg shadow-lg">
              <Image
                src="/webifyd-logo-tp.png"
                alt="Webifyd Technologies"
                width={300}
                height={90}
                className="h-16 w-auto"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
              Google Ads Campaign
              <br />
              Client Intake & Strategy Form
            </h1>
            <p className="text-blue-100 text-sm md:text-base">
              Digital Solutions You Can Trust
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="sticky top-0 z-50 bg-white shadow-md">
          <div className="h-2 bg-gray-200">
            <div
              className="h-2 bg-webifyd-blue transition-all duration-300 ease-in-out"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          <div className="px-4 py-2 flex justify-between items-center text-sm">
            <div className="flex items-center gap-3">
              <span className="text-webifyd-gray-medium font-medium">
                Section {currentSection} of 11
              </span>
              {lastSaved && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
            <span className="text-webifyd-blue font-semibold">
              {calculateProgress()}% Complete
            </span>
            <span className="text-gray-500 text-xs hidden sm:inline">
              ⏱️ Est. {Math.max(1, Math.ceil((100 - calculateProgress()) / 10))} min remaining
            </span>
          </div>
        </div>

        {/* Step Navigation */}
        <StepNavigation
          currentStep={currentStep}
          totalSteps={5}
          onStepClick={handleStepClick}
          completedSteps={completedSteps}
        />

        {/* Intro Box */}
        <div className="p-8">
          {/* Draft Restored Banner */}
          {hasDraft && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-r">
              <p className="text-yellow-800 text-sm font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Your previous draft has been restored! Continue where you left off.
              </p>
            </div>
          )}

          <div className="bg-blue-50 border-l-4 border-webifyd-blue p-4 mb-8 rounded-r">
            <p className="text-webifyd-gray-medium text-sm leading-relaxed">
              This intake form is designed to collect the essential information required to plan, execute,
              and optimize a Google Ads campaign. Please provide as much detail as possible so we can align
              campaign strategy with your business goals and target audience.
            </p>
            <p className="text-webifyd-gray-medium text-xs mt-2 opacity-75">
              💾 Your progress is automatically saved every 30 seconds
            </p>
          </div>

          {/* Success/Error Message */}
          {submitStatus.type && (
            <div
              className={`mb-6 p-4 rounded-lg border-l-4 flex items-start gap-3 animate-fade-in ${
                submitStatus.type === 'success'
                  ? 'bg-green-50 border-green-500 text-green-800'
                  : 'bg-red-50 border-red-500 text-red-800'
              }`}
            >
              {submitStatus.type === 'success' ? (
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <div className="flex-1">
                <p className="font-semibold">
                  {submitStatus.type === 'success' ? 'Success!' : 'Error'}
                </p>
                <p className="text-sm mt-1">{submitStatus.message}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* STEP 1: COMPANY INFORMATION */}
            {currentStep === 1 && (
            <section ref={(el) => { sectionRefs.current[0] = el; }}>
              <h2 className="section-header rounded">COMPANY INFORMATION</h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="field-group">
                  <label className="field-label">Company Name: *</label>
                  <input
                    type="text"
                    required
                    className="field-input"
                    value={formData.companyInfo.companyName}
                    onChange={(e) => handleInputChange('companyInfo', 'companyName', e.target.value)}
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Contact Person: *</label>
                  <input
                    type="text"
                    required
                    className="field-input"
                    value={formData.companyInfo.contactPerson}
                    onChange={(e) => handleInputChange('companyInfo', 'contactPerson', e.target.value)}
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Position / Role:</label>
                  <input
                    type="text"
                    className="field-input"
                    value={formData.companyInfo.position}
                    onChange={(e) => handleInputChange('companyInfo', 'position', e.target.value)}
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Email: *</label>
                  <input
                    type="email"
                    required
                    className={`field-input ${fieldErrors['companyInfo.email'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    value={formData.companyInfo.email}
                    onChange={(e) => handleInputChange('companyInfo', 'email', e.target.value)}
                  />
                  {fieldErrors['companyInfo.email'] && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {fieldErrors['companyInfo.email']}
                    </p>
                  )}
                </div>
                <div className="field-group">
                  <label className="field-label">Phone / WhatsApp:</label>
                  <input
                    type="tel"
                    className={`field-input ${fieldErrors['companyInfo.phone'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    value={formData.companyInfo.phone}
                    onChange={(e) => handleInputChange('companyInfo', 'phone', e.target.value)}
                  />
                  {fieldErrors['companyInfo.phone'] && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {fieldErrors['companyInfo.phone']}
                    </p>
                  )}
                </div>
                <div className="field-group">
                  <label className="field-label">Website:</label>
                  <input
                    type="url"
                    className={`field-input ${fieldErrors['companyInfo.website'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    value={formData.companyInfo.website}
                    onChange={(e) => handleInputChange('companyInfo', 'website', e.target.value)}
                  />
                  {fieldErrors['companyInfo.website'] && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {fieldErrors['companyInfo.website']}
                    </p>
                  )}
                </div>
              </div>
              <div className="field-group mt-6">
                <label className="field-label">Office Location:</label>
                <input
                  type="text"
                  className="field-input"
                  value={formData.companyInfo.officeLocation}
                  onChange={(e) => handleInputChange('companyInfo', 'officeLocation', e.target.value)}
                />
              </div>
            </section>
            )}

            {/* STEP 2: CAMPAIGN DETAILS */}
            {currentStep === 2 && (
            <>
            {/* CAMPAIGN OBJECTIVE */}
            <section ref={(el) => { sectionRefs.current[1] = el; }}>
              <h2 className="section-header rounded">CAMPAIGN OBJECTIVE</h2>
              <div className="mt-6">
                <p className="subsection">Select the primary campaign goal:</p>
                <div className="ml-6 space-y-2">
                  {['Lead Generation', 'Sales Inquiries (Wholesale / Retail)', 'Brand Awareness', 'Product Promotion', 'Website Traffic'].map((goal) => (
                    <div key={goal} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`goal-${goal}`}
                        checked={formData.campaignObjective.goals.includes(goal)}
                        onChange={(e) =>
                          handleCheckboxChange('campaignObjective', 'goals', goal, e.target.checked)
                        }
                      />
                      <label htmlFor={`goal-${goal}`}>{goal}</label>
                    </div>
                  ))}
                  {formData.campaignObjective.goals.includes('Other') && (
                  <div className="field-group mt-2">
                    <input
                      type="text"
                      className="field-input"
                      placeholder="e.g., Launch new product line, enter new market segment"
                      value={formData.campaignObjective.otherGoal || ''}
                      onChange={(e) => handleInputChange('campaignObjective', 'otherGoal', e.target.value)}
                    />
                  </div>
                  )}
                </div>

                <div className="field-group mt-6">
                  <label className="field-label flex items-center">
                    Describe your expected outcome:
                    <Tooltip text="Be specific! Examples: '50 qualified leads per month', '10% increase in online sales', '5000 website visitors', or 'Establish brand presence in Dubai market'." />
                  </label>
                  <textarea
                    className="field-input min-h-[100px]"
                    placeholder="e.g., Generate 30-50 quality leads per month with a target CPA of 50 AED"
                    value={formData.campaignObjective.expectedOutcome}
                    onChange={(e) =>
                      handleInputChange('campaignObjective', 'expectedOutcome', e.target.value)
                    }
                  />
                </div>
              </div>
            </section>

            {/* TARGET AUDIENCE & LOCATION */}
            <section ref={(el) => { sectionRefs.current[2] = el; }}>
              <h2 className="section-header rounded">TARGET AUDIENCE & LOCATION</h2>
              <div className="mt-6">
                <p className="subsection">Who are your ideal customers?</p>
                <div className="ml-6 space-y-2">
                  {['Retail Customers', 'Wholesale Buyers', 'Contractors / Professionals'].map((type) => (
                    <div key={type} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`customer-${type}`}
                        checked={formData.targetAudience.customerTypes.includes(type)}
                        onChange={(e) =>
                          handleCheckboxChange('targetAudience', 'customerTypes', type, e.target.checked)
                        }
                      />
                      <label htmlFor={`customer-${type}`}>{type}</label>
                    </div>
                  ))}
                  {formData.targetAudience.customerTypes.includes('Other') && (
                  <div className="field-group mt-2">
                    <input
                      type="text"
                      className="field-input"
                      placeholder="e.g., Government entities, Educational institutions, NGOs"
                      value={formData.targetAudience.otherCustomerType || ''}
                      onChange={(e) =>
                        handleInputChange('targetAudience', 'otherCustomerType', e.target.value)
                      }
                    />
                  </div>
                  )}
                </div>

                <p className="subsection mt-6">Geographical targeting:</p>
                <div className="ml-6 space-y-2">
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="geo-uae"
                      checked={formData.targetAudience.geographicTargeting.includes('UAE (All Emirates)')}
                      onChange={(e) =>
                        handleCheckboxChange(
                          'targetAudience',
                          'geographicTargeting',
                          'UAE (All Emirates)',
                          e.target.checked
                        )
                      }
                    />
                    <label htmlFor="geo-uae">UAE (All Emirates)</label>
                  </div>
                  {formData.targetAudience.geographicTargeting.includes('UAE (All Emirates)') && (
                  <div className="field-group">
                    <label className="field-label text-sm">Specific Emirates (Optional):</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="e.g., Dubai, Abu Dhabi, Sharjah"
                      value={formData.targetAudience.specificEmirates || ''}
                      onChange={(e) =>
                        handleInputChange('targetAudience', 'specificEmirates', e.target.value)
                      }
                    />
                  </div>
                  )}
                  {formData.targetAudience.geographicTargeting.length > 0 && (
                  <div className="field-group">
                    <label className="field-label text-sm">International Markets (if applicable):</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="e.g., Saudi Arabia, Egypt, Qatar, India, Pakistan"
                      value={formData.targetAudience.internationalMarkets || ''}
                      onChange={(e) =>
                        handleInputChange('targetAudience', 'internationalMarkets', e.target.value)
                      }
                    />
                  </div>
                  )}
                </div>

                <p className="subsection mt-6">Languages required:</p>
                <div className="ml-6 space-y-2">
                  {['English', 'Arabic', 'Both English & Arabic'].map((lang) => (
                    <div key={lang} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`lang-${lang}`}
                        checked={formData.targetAudience.languages.includes(lang)}
                        onChange={(e) =>
                          handleCheckboxChange('targetAudience', 'languages', lang, e.target.checked)
                        }
                      />
                      <label htmlFor={`lang-${lang}`}>{lang}</label>
                    </div>
                  ))}
                  {formData.targetAudience.languages.length > 0 && (
                  <div className="field-group mt-2">
                    <input
                      type="text"
                      className="field-input"
                      placeholder="e.g., Urdu, Hindi, French, Chinese"
                      value={formData.targetAudience.otherLanguage || ''}
                      onChange={(e) =>
                        handleInputChange('targetAudience', 'otherLanguage', e.target.value)
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">Add any additional languages not listed above</p>
                  </div>
                  )}
                </div>
              </div>
            </section>
            </>
            )}

            {/* STEP 3: BUDGET & PRODUCTS */}
            {currentStep === 3 && (
            <>
            {/* CAMPAIGN BUDGET */}
            <section ref={(el) => { sectionRefs.current[3] = el; }}>
              <h2 className="section-header rounded">CAMPAIGN BUDGET</h2>
              <div className="mt-6">
                <p className="subsection flex items-center">
                  Daily budget (Approximate):
                  <Tooltip text="Your daily ad spend. Google Ads typically needs 300-500 AED/day minimum for meaningful results in Dubai market. Start conservatively and scale up based on performance." />
                </p>
                <div className="ml-6 space-y-2">
                  {['10 - 20 AED', '20 - 50 AED', '50 - 100 AED', '100+ AED'].map((budget) => (
                    <div key={budget} className="checkbox-item">
                      <input
                        type="radio"
                        name="dailyBudget"
                        id={`budget-${budget}`}
                        checked={formData.campaignBudget.dailyBudget === budget}
                        onChange={() => handleInputChange('campaignBudget', 'dailyBudget', budget)}
                      />
                      <label htmlFor={`budget-${budget}`}>{budget}</label>
                    </div>
                  ))}
                  <div className="field-group mt-2">
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Other (please specify)"
                      value={formData.campaignBudget.otherBudget || ''}
                      onChange={(e) => handleInputChange('campaignBudget', 'otherBudget', e.target.value)}
                    />
                  </div>
                </div>

                {/* Budget Warning for Low Budgets */}
                {(formData.campaignBudget.dailyBudget === '10 - 20 AED' ||
                  formData.campaignBudget.dailyBudget === '20 - 50 AED') && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4 rounded-r">
                  <div className="flex">
                    <svg className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        ⚠️ Low Budget Warning
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        This budget may significantly limit campaign reach and effectiveness. Google Ads typically requires 300-500 AED/day for meaningful results in competitive markets like Dubai. Consider starting with at least 100 AED/day for better performance.
                      </p>
                    </div>
                  </div>
                </div>
                )}

                <p className="subsection mt-6">Can budget increase after positive results?</p>
                <div className="ml-6 space-y-2">
                  {['Yes', 'No', 'To be discussed based on ROI'].map((option) => (
                    <div key={option} className="checkbox-item">
                      <input
                        type="radio"
                        name="budgetIncrease"
                        id={`increase-${option}`}
                        checked={formData.campaignBudget.budgetIncrease === option}
                        onChange={() => handleInputChange('campaignBudget', 'budgetIncrease', option)}
                      />
                      <label htmlFor={`increase-${option}`}>{option}</label>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* PRODUCTS OR SERVICES */}
            <section ref={(el) => { sectionRefs.current[4] = el; }}>
              <h2 className="section-header rounded">PRODUCTS OR SERVICES TO PROMOTE</h2>
              <div className="mt-6 space-y-6">
                <div className="field-group">
                  <label className="field-label">List your core products/services with priority order:</label>
                  <textarea
                    className="field-input min-h-[100px]"
                    value={formData.productsServices.coreProducts}
                    onChange={(e) =>
                      handleInputChange('productsServices', 'coreProducts', e.target.value)
                    }
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Product catalog link or upload reference:</label>
                  <input
                    type="url"
                    className={`field-input ${fieldErrors['productsServices.catalogLink'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    value={formData.productsServices.catalogLink}
                    onChange={(e) =>
                      handleInputChange('productsServices', 'catalogLink', e.target.value)
                    }
                  />
                  {fieldErrors['productsServices.catalogLink'] && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {fieldErrors['productsServices.catalogLink']}
                    </p>
                  )}
                </div>
                <div className="field-group">
                  <label className="field-label">High-margin or focus products to prioritize:</label>
                  <textarea
                    className="field-input min-h-[80px]"
                    value={formData.productsServices.focusProducts}
                    onChange={(e) =>
                      handleInputChange('productsServices', 'focusProducts', e.target.value)
                    }
                  />
                </div>
              </div>
            </section>
            </>
            )}

            {/* STEP 4: STRATEGY & CONTENT */}
            {currentStep === 4 && (
            <>
            {/* LEAD & CONVERSION DEFINITION */}
            <section ref={(el) => { sectionRefs.current[5] = el; }}>
              <h2 className="section-header rounded">LEAD & CONVERSION DEFINITION</h2>
              <div className="mt-6">
                <p className="subsection">What counts as a lead for you?</p>
                <div className="ml-6 space-y-2">
                  {[
                    'Phone Call',
                    'WhatsApp Click / Message',
                    'Website Form Submission',
                    'Email Inquiry',
                    'Store Visit / Direction Request',
                  ].map((lead) => (
                    <div key={lead} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`lead-${lead}`}
                        checked={formData.leadDefinition.leadTypes.includes(lead)}
                        onChange={(e) =>
                          handleCheckboxChange('leadDefinition', 'leadTypes', lead, e.target.checked)
                        }
                      />
                      <label htmlFor={`lead-${lead}`}>{lead}</label>
                    </div>
                  ))}
                  {formData.leadDefinition.leadTypes.length > 0 && (
                  <div className="field-group mt-2">
                    <input
                      type="text"
                      className="field-input"
                      placeholder="e.g., App Download, Video View, Social Media Follow"
                      value={formData.leadDefinition.otherLeadType || ''}
                      onChange={(e) =>
                        handleInputChange('leadDefinition', 'otherLeadType', e.target.value)
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">Add any additional lead types not listed above</p>
                  </div>
                  )}
                </div>
              </div>
            </section>

            {/* KEYWORDS & COMPETITORS */}
            <section ref={(el) => { sectionRefs.current[6] = el; }}>
              <h2 className="section-header rounded">KEYWORDS & COMPETITORS</h2>
              <div className="mt-6 space-y-6">
                <div className="field-group">
                  <label className="field-label flex items-center">
                    Keywords you want to target (if available):
                    <Tooltip text="Examples: 'luxury watches Dubai', 'best plumber near me', 'buy organic food online'. Include 5-10 relevant keywords your customers might search for." />
                  </label>
                  <textarea
                    className="field-input min-h-[80px]"
                    placeholder="e.g., digital marketing services, SEO Dubai, social media management"
                    value={formData.keywordsCompetitors.keywords}
                    onChange={(e) =>
                      handleInputChange('keywordsCompetitors', 'keywords', e.target.value)
                    }
                  />
                </div>
                <div className="field-group">
                  <label className="field-label flex items-center">
                    Competitor companies / websites / brands:
                    <Tooltip text="List 3-5 main competitors in your market. Include their website URLs if possible. This helps us understand your competitive landscape." />
                  </label>
                  <textarea
                    className="field-input min-h-[80px]"
                    placeholder="e.g., competitor1.com, Competitor Name 2, brandname3.ae"
                    value={formData.keywordsCompetitors.competitors}
                    onChange={(e) =>
                      handleInputChange('keywordsCompetitors', 'competitors', e.target.value)
                    }
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Any competitor strengths or weaknesses to note:</label>
                  <textarea
                    className="field-input min-h-[80px]"
                    value={formData.keywordsCompetitors.competitorNotes}
                    onChange={(e) =>
                      handleInputChange('keywordsCompetitors', 'competitorNotes', e.target.value)
                    }
                  />
                </div>
              </div>
            </section>

            {/* UNIQUE SELLING POINTS */}
            <section ref={(el) => { sectionRefs.current[7] = el; }}>
              <h2 className="section-header rounded">UNIQUE SELLING POINTS (USPs)</h2>
              <div className="mt-6">
                <p className="subsection flex items-center">
                  Select all that apply to your business:
                  <Tooltip text="USPs are what make you different from competitors. Choose the benefits that truly set you apart and resonate with your target customers." />
                </p>
                <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    'Fast / Same-Day Delivery',
                    'Competitive Pricing Advantage',
                    'Installation / Service Support',
                    'Warranty / Guarantee',
                    'Wide Product Variety',
                    'Custom Orders Available',
                    'Quality Certifications',
                    'Years of Experience / Established Brand',
                    'After-Sales Service',
                    'Free Consultation / Quotes',
                  ].map((usp) => (
                    <div key={usp} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`usp-${usp}`}
                        checked={formData.usps.selectedUSPs.includes(usp)}
                        onChange={(e) =>
                          handleCheckboxChange('usps', 'selectedUSPs', usp, e.target.checked)
                        }
                      />
                      <label htmlFor={`usp-${usp}`}>{usp}</label>
                    </div>
                  ))}
                </div>
                <div className="field-group mt-6">
                  <label className="field-label">Other USPs specific to your business:</label>
                  <textarea
                    className="field-input min-h-[80px]"
                    value={formData.usps.otherUSPs}
                    onChange={(e) => handleInputChange('usps', 'otherUSPs', e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* ASSETS & BRAND MATERIALS */}
            <section ref={(el) => { sectionRefs.current[8] = el; }}>
              <h2 className="section-header rounded">ASSETS & BRAND MATERIALS</h2>
              <div className="mt-6">
                <p className="subsection">Please provide the following materials:</p>
                <div className="ml-6 space-y-2">
                  {[
                    'Company Logo (PDF / PNG / SVG format)',
                    'Product Photos (High Resolution)',
                    'Brand Guidelines Document',
                    'Previous Ad Creatives (if available)',
                    'Company Brochure / Catalog',
                  ].map((material) => (
                    <div key={material} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`material-${material}`}
                        checked={formData.brandMaterials.materials.includes(material)}
                        onChange={(e) =>
                          handleCheckboxChange('brandMaterials', 'materials', material, e.target.checked)
                        }
                      />
                      <label htmlFor={`material-${material}`}>{material}</label>
                    </div>
                  ))}
                </div>
                <div className="field-group mt-6">
                  <label className="field-label">Notes on brand materials:</label>
                  <textarea
                    className="field-input min-h-[80px]"
                    value={formData.brandMaterials.notes}
                    onChange={(e) => handleInputChange('brandMaterials', 'notes', e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* CAMPAIGN TIMELINE */}
            <section ref={(el) => { sectionRefs.current[9] = el; }}>
              <h2 className="section-header rounded">CAMPAIGN TIMELINE</h2>
              <div className="mt-6">
                <p className="subsection">Preferred campaign duration:</p>
                <div className="ml-6 space-y-2">
                  {[
                    '1 - 3 Months (Initial Testing Phase)',
                    '3 - 6 Months (Optimization & Scaling)',
                    '6+ Months (Long-term Strategy)',
                    'Ongoing / Continuous',
                  ].map((duration) => (
                    <div key={duration} className="checkbox-item">
                      <input
                        type="radio"
                        name="duration"
                        id={`duration-${duration}`}
                        checked={formData.campaignTimeline.duration === duration}
                        onChange={() => handleInputChange('campaignTimeline', 'duration', duration)}
                      />
                      <label htmlFor={`duration-${duration}`}>{duration}</label>
                    </div>
                  ))}
                </div>
                <div className="field-group mt-6">
                  <label className="field-label flex items-center">
                    Preferred campaign launch date:
                    <Tooltip text="Select your ideal start date. We recommend allowing 5-7 business days for campaign setup and optimization." />
                  </label>
                  <input
                    type="date"
                    className="field-input"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.campaignTimeline.launchDate}
                    onChange={(e) =>
                      handleInputChange('campaignTimeline', 'launchDate', e.target.value)
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    📅 Click to open calendar picker. Past dates are disabled.
                  </p>
                </div>
              </div>
            </section>
            </>
            )}

            {/* STEP 5: REVIEW & SUBMIT */}
            {currentStep === 5 && (
            <>
            {/* ADDITIONAL NOTES */}
            <section ref={(el) => { sectionRefs.current[10] = el; }}>
              <h2 className="section-header rounded">ADDITIONAL NOTES & INSTRUCTIONS</h2>
              <div className="mt-6">
                <div className="field-group">
                  <label className="field-label">
                    Any other information, special requirements, or instructions:
                  </label>
                  <textarea
                    className="field-input min-h-[150px]"
                    value={formData.additionalNotes.notes}
                    onChange={(e) => handleInputChange('additionalNotes', 'notes', e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Review Summary */}
            <ReviewSummary formData={formData} onEdit={handleStepClick} />

            {/* Submit Button (only for step 5) */}
            {currentStep === 5 && (
            <div className="flex justify-center pt-8 pb-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-primary text-lg px-12 py-4 flex items-center gap-3 transition-all ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                {isSubmitting && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {isSubmitting ? 'Submitting Your Form...' : 'Submit Intake Form'}
              </button>
            </div>
            )}
            </>
            )}

            {/* Step Navigation Buttons */}
            <div className="flex justify-between items-center pt-8 pb-4 border-t border-gray-200 mt-8">
              <button
                type="button"
                onClick={handlePreviousStep}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  currentStep === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-500 text-white hover:bg-gray-600 hover:scale-105'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              {currentStep < 5 && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center gap-2 bg-webifyd-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-webifyd-navy transition-all hover:scale-105"
                >
                  Next Step
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-webifyd-blue text-center">
            <p className="font-semibold text-webifyd-navy mb-1">
              Prepared as part of Google Ads Strategy Planning & Audit
            </p>
            <p className="text-webifyd-gray-medium text-sm mb-1">Webifyd Technologies</p>
            <p className="text-webifyd-blue text-sm">Digital Solutions You Can Trust</p>
          </div>
        </div>
      </div>
    </div>
  );
}
