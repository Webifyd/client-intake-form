'use client';

import type { IntakeFormData } from '@/types/form';

interface ReviewSummaryProps {
  formData: IntakeFormData;
  onEdit: (step: number) => void;
}

export default function ReviewSummary({ formData, onEdit }: ReviewSummaryProps) {
  const formatArray = (arr: string[]) => {
    if (!arr || arr.length === 0) return <span className="text-gray-400 italic">Not specified</span>;
    return arr.join(', ');
  };

  const formatValue = (value: string | undefined | null) => {
    if (!value || value.trim() === '') {
      return <span className="text-gray-400 italic">Not specified</span>;
    }
    return value;
  };

  const SectionBox = ({
    title,
    step,
    children
  }: {
    title: string;
    step: number;
    children: React.ReactNode;
  }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-webifyd-navy">{title}</h3>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="text-sm text-webifyd-blue hover:text-webifyd-navy font-medium flex items-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );

  const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <dt className="text-sm font-semibold text-gray-700">{label}:</dt>
      <dd className="md:col-span-2 text-sm text-gray-900">{value}</dd>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border-l-4 border-webifyd-blue p-4 rounded-r mb-6">
        <p className="text-webifyd-gray-medium text-sm font-medium flex items-center gap-2">
          <svg className="w-5 h-5 text-webifyd-blue" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Please review your information below. Click "Edit" on any section to make changes.
        </p>
      </div>

      {/* Company Information */}
      <SectionBox title="Company Information" step={1}>
        <Field label="Company Name" value={formatValue(formData.companyInfo.companyName)} />
        <Field label="Contact Person" value={formatValue(formData.companyInfo.contactPerson)} />
        <Field label="Position" value={formatValue(formData.companyInfo.position)} />
        <Field label="Email" value={formatValue(formData.companyInfo.email)} />
        <Field label="Phone" value={formatValue(formData.companyInfo.phone)} />
        <Field label="Website" value={formatValue(formData.companyInfo.website)} />
        <Field label="Office Location" value={formatValue(formData.companyInfo.officeLocation)} />
      </SectionBox>

      {/* Campaign Objective */}
      <SectionBox title="Campaign Objective & Target Audience" step={2}>
        <Field label="Campaign Goals" value={formatArray(formData.campaignObjective.goals)} />
        {formData.campaignObjective.otherGoal && (
          <Field label="Other Goal" value={formatValue(formData.campaignObjective.otherGoal)} />
        )}
        <Field label="Expected Outcome" value={formatValue(formData.campaignObjective.expectedOutcome)} />

        <div className="border-t border-gray-200 my-4 pt-4">
          <p className="text-sm font-bold text-gray-700 mb-3">Target Audience:</p>
          <Field label="Customer Types" value={formatArray(formData.targetAudience.customerTypes)} />
          {formData.targetAudience.otherCustomerType && (
            <Field label="Other Customer Type" value={formatValue(formData.targetAudience.otherCustomerType)} />
          )}
          <Field label="Geographic Targeting" value={formatArray(formData.targetAudience.geographicTargeting)} />
          {formData.targetAudience.specificEmirates && (
            <Field label="Specific Emirates" value={formatValue(formData.targetAudience.specificEmirates)} />
          )}
          {formData.targetAudience.internationalMarkets && (
            <Field label="International Markets" value={formatValue(formData.targetAudience.internationalMarkets)} />
          )}
          <Field label="Languages" value={formatArray(formData.targetAudience.languages)} />
          {formData.targetAudience.otherLanguage && (
            <Field label="Other Language" value={formatValue(formData.targetAudience.otherLanguage)} />
          )}
        </div>
      </SectionBox>

      {/* Budget & Products */}
      <SectionBox title="Budget & Products/Services" step={3}>
        <Field label="Daily Budget" value={formatValue(formData.campaignBudget.dailyBudget || formData.campaignBudget.otherBudget)} />
        <Field label="Budget Scalability" value={formatValue(formData.campaignBudget.budgetIncrease)} />

        <div className="border-t border-gray-200 my-4 pt-4">
          <p className="text-sm font-bold text-gray-700 mb-3">Products/Services:</p>
          <Field label="Core Products" value={formatValue(formData.productsServices.coreProducts)} />
          <Field label="Catalog Link" value={formatValue(formData.productsServices.catalogLink)} />
          <Field label="Focus Products" value={formatValue(formData.productsServices.focusProducts)} />
        </div>
      </SectionBox>

      {/* Strategy & Content */}
      <SectionBox title="Strategy & Content" step={4}>
        <Field label="Lead Types" value={formatArray(formData.leadDefinition.leadTypes)} />
        {formData.leadDefinition.otherLeadType && (
          <Field label="Other Lead Type" value={formatValue(formData.leadDefinition.otherLeadType)} />
        )}

        <div className="border-t border-gray-200 my-4 pt-4">
          <p className="text-sm font-bold text-gray-700 mb-3">Keywords & Competition:</p>
          <Field
            label="Target Keywords"
            value={
              formData.keywordsCompetitors.keywords ? (
                <span className="whitespace-pre-wrap">{formData.keywordsCompetitors.keywords}</span>
              ) : (
                <span className="text-gray-400 italic">Not specified</span>
              )
            }
          />
          <Field
            label="Competitors"
            value={
              formData.keywordsCompetitors.competitors ? (
                <span className="whitespace-pre-wrap">{formData.keywordsCompetitors.competitors}</span>
              ) : (
                <span className="text-gray-400 italic">Not specified</span>
              )
            }
          />
          <Field label="Competitor Notes" value={formatValue(formData.keywordsCompetitors.competitorNotes)} />
        </div>

        <div className="border-t border-gray-200 my-4 pt-4">
          <p className="text-sm font-bold text-gray-700 mb-3">Unique Selling Points:</p>
          <Field label="Selected USPs" value={formatArray(formData.usps.selectedUSPs)} />
          <Field label="Other USPs" value={formatValue(formData.usps.otherUSPs)} />
        </div>

        <div className="border-t border-gray-200 my-4 pt-4">
          <p className="text-sm font-bold text-gray-700 mb-3">Brand Materials:</p>
          <Field label="Available Materials" value={formatArray(formData.brandMaterials.materials)} />
          <Field label="Notes" value={formatValue(formData.brandMaterials.notes)} />
        </div>

        <div className="border-t border-gray-200 my-4 pt-4">
          <p className="text-sm font-bold text-gray-700 mb-3">Campaign Timeline:</p>
          <Field label="Duration" value={formatValue(formData.campaignTimeline.duration)} />
          <Field label="Launch Date" value={formatValue(formData.campaignTimeline.launchDate)} />
        </div>
      </SectionBox>

      {/* Additional Notes */}
      {formData.additionalNotes.notes && (
        <SectionBox title="Additional Notes & Instructions" step={5}>
          <Field
            label="Notes"
            value={<span className="whitespace-pre-wrap">{formData.additionalNotes.notes}</span>}
          />
        </SectionBox>
      )}

      {/* Final Submission Notice */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r mt-6">
        <p className="text-green-800 text-sm font-medium flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Everything looks good? Click "Submit Intake Form" below to send your information.
        </p>
      </div>
    </div>
  );
}
