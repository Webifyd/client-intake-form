'use client';

import { useState, useEffect, useRef } from 'react';
import type { IntakeFormData } from '@/types/form';
import Image from 'next/image';

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
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
            <span className="text-webifyd-gray-medium font-medium">
              Section {currentSection} of 11
            </span>
            <span className="text-webifyd-blue font-semibold">
              {calculateProgress()}% Complete
            </span>
            <span className="text-gray-500 text-xs hidden sm:inline">
              ⏱️ Est. {Math.max(1, Math.ceil((100 - calculateProgress()) / 10))} min remaining
            </span>
          </div>
        </div>

        {/* Intro Box */}
        <div className="p-8">
          <div className="bg-blue-50 border-l-4 border-webifyd-blue p-4 mb-8 rounded-r">
            <p className="text-webifyd-gray-medium text-sm leading-relaxed">
              This intake form is designed to collect the essential information required to plan, execute,
              and optimize a Google Ads campaign. Please provide as much detail as possible so we can align
              campaign strategy with your business goals and target audience.
            </p>
          </div>

          {/* Success/Error Message */}
          {submitStatus.type && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                submitStatus.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* COMPANY INFORMATION */}
            <section ref={(el) => (sectionRefs.current[0] = el)}>
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
                    className="field-input"
                    value={formData.companyInfo.email}
                    onChange={(e) => handleInputChange('companyInfo', 'email', e.target.value)}
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Phone / WhatsApp:</label>
                  <input
                    type="tel"
                    className="field-input"
                    value={formData.companyInfo.phone}
                    onChange={(e) => handleInputChange('companyInfo', 'phone', e.target.value)}
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Website:</label>
                  <input
                    type="url"
                    className="field-input"
                    value={formData.companyInfo.website}
                    onChange={(e) => handleInputChange('companyInfo', 'website', e.target.value)}
                  />
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

            {/* CAMPAIGN OBJECTIVE */}
            <section ref={(el) => (sectionRefs.current[1] = el)}>
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
                  <div className="field-group mt-2">
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Other (please specify)"
                      value={formData.campaignObjective.otherGoal || ''}
                      onChange={(e) => handleInputChange('campaignObjective', 'otherGoal', e.target.value)}
                    />
                  </div>
                </div>

                <div className="field-group mt-6">
                  <label className="field-label">Describe your expected outcome:</label>
                  <textarea
                    className="field-input min-h-[100px]"
                    value={formData.campaignObjective.expectedOutcome}
                    onChange={(e) =>
                      handleInputChange('campaignObjective', 'expectedOutcome', e.target.value)
                    }
                  />
                </div>
              </div>
            </section>

            {/* TARGET AUDIENCE & LOCATION */}
            <section ref={(el) => (sectionRefs.current[2] = el)}>
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
                  <div className="field-group mt-2">
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Other (please specify)"
                      value={formData.targetAudience.otherCustomerType || ''}
                      onChange={(e) =>
                        handleInputChange('targetAudience', 'otherCustomerType', e.target.value)
                      }
                    />
                  </div>
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
                  <div className="field-group">
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Specific Emirates"
                      value={formData.targetAudience.specificEmirates || ''}
                      onChange={(e) =>
                        handleInputChange('targetAudience', 'specificEmirates', e.target.value)
                      }
                    />
                  </div>
                  <div className="field-group">
                    <input
                      type="text"
                      className="field-input"
                      placeholder="International Markets"
                      value={formData.targetAudience.internationalMarkets || ''}
                      onChange={(e) =>
                        handleInputChange('targetAudience', 'internationalMarkets', e.target.value)
                      }
                    />
                  </div>
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
                  <div className="field-group mt-2">
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Other (please specify)"
                      value={formData.targetAudience.otherLanguage || ''}
                      onChange={(e) =>
                        handleInputChange('targetAudience', 'otherLanguage', e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* CAMPAIGN BUDGET */}
            <section ref={(el) => (sectionRefs.current[3] = el)}>
              <h2 className="section-header rounded">CAMPAIGN BUDGET</h2>
              <div className="mt-6">
                <p className="subsection">Daily budget (Approximate):</p>
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
            <section ref={(el) => (sectionRefs.current[4] = el)}>
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
                    className="field-input"
                    value={formData.productsServices.catalogLink}
                    onChange={(e) =>
                      handleInputChange('productsServices', 'catalogLink', e.target.value)
                    }
                  />
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

            {/* LEAD & CONVERSION DEFINITION */}
            <section ref={(el) => (sectionRefs.current[5] = el)}>
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
                  <div className="field-group mt-2">
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Other (please specify)"
                      value={formData.leadDefinition.otherLeadType || ''}
                      onChange={(e) =>
                        handleInputChange('leadDefinition', 'otherLeadType', e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* KEYWORDS & COMPETITORS */}
            <section ref={(el) => (sectionRefs.current[6] = el)}>
              <h2 className="section-header rounded">KEYWORDS & COMPETITORS</h2>
              <div className="mt-6 space-y-6">
                <div className="field-group">
                  <label className="field-label">Keywords you want to target (if available):</label>
                  <textarea
                    className="field-input min-h-[80px]"
                    value={formData.keywordsCompetitors.keywords}
                    onChange={(e) =>
                      handleInputChange('keywordsCompetitors', 'keywords', e.target.value)
                    }
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Competitor companies / websites / brands:</label>
                  <textarea
                    className="field-input min-h-[80px]"
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
            <section ref={(el) => (sectionRefs.current[7] = el)}>
              <h2 className="section-header rounded">UNIQUE SELLING POINTS (USPs)</h2>
              <div className="mt-6">
                <p className="subsection">Select all that apply to your business:</p>
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
            <section ref={(el) => (sectionRefs.current[8] = el)}>
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
            <section ref={(el) => (sectionRefs.current[9] = el)}>
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
                  <label className="field-label">Preferred campaign launch date:</label>
                  <input
                    type="date"
                    className="field-input"
                    value={formData.campaignTimeline.launchDate}
                    onChange={(e) =>
                      handleInputChange('campaignTimeline', 'launchDate', e.target.value)
                    }
                  />
                </div>
              </div>
            </section>

            {/* ADDITIONAL NOTES */}
            <section ref={(el) => (sectionRefs.current[10] = el)}>
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

            {/* Submit Button */}
            <div className="flex justify-center pt-8 pb-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary text-lg px-12 py-4"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Intake Form'}
              </button>
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
