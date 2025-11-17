import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';
import type { IntakeFormData } from '@/types/form';

// Configure Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID || ''
);

export async function POST(request: NextRequest) {
  try {
    const formData: IntakeFormData = await request.json();

    // Validate required fields
    if (!formData.companyInfo.companyName || !formData.companyInfo.contactPerson || !formData.companyInfo.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save to Airtable
    const tableName = process.env.AIRTABLE_TABLE_NAME || 'Google_Ads_Intake';

    const airtableRecord = await base(tableName).create([
      {
        fields: {
          // Company Information
          'Company Name': formData.companyInfo.companyName,
          'Contact Person': formData.companyInfo.contactPerson,
          'Position': formData.companyInfo.position,
          'Email': formData.companyInfo.email,
          'Phone': formData.companyInfo.phone,
          'Website': formData.companyInfo.website,
          'Office Location': formData.companyInfo.officeLocation,

          // Campaign Objective
          'Campaign Goals': formData.campaignObjective.goals.join(', '),
          'Other Goal': formData.campaignObjective.otherGoal || '',
          'Expected Outcome': formData.campaignObjective.expectedOutcome,

          // Target Audience
          'Customer Types': formData.targetAudience.customerTypes.join(', '),
          'Other Customer Type': formData.targetAudience.otherCustomerType || '',
          'Geographic Targeting': formData.targetAudience.geographicTargeting.join(', '),
          'Specific Emirates': formData.targetAudience.specificEmirates || '',
          'International Markets': formData.targetAudience.internationalMarkets || '',
          'Languages': formData.targetAudience.languages.join(', '),
          'Other Language': formData.targetAudience.otherLanguage || '',

          // Campaign Budget
          'Daily Budget': formData.campaignBudget.dailyBudget,
          'Other Budget': formData.campaignBudget.otherBudget || '',
          'Budget Increase': formData.campaignBudget.budgetIncrease,

          // Products/Services
          'Core Products': formData.productsServices.coreProducts,
          'Catalog Link': formData.productsServices.catalogLink,
          'Focus Products': formData.productsServices.focusProducts,

          // Lead Definition
          'Lead Types': formData.leadDefinition.leadTypes.join(', '),
          'Other Lead Type': formData.leadDefinition.otherLeadType || '',

          // Keywords & Competitors
          'Keywords': formData.keywordsCompetitors.keywords,
          'Competitors': formData.keywordsCompetitors.competitors,
          'Competitor Notes': formData.keywordsCompetitors.competitorNotes,

          // USPs
          'Selected USPs': formData.usps.selectedUSPs.join(', '),
          'Other USPs': formData.usps.otherUSPs,

          // Brand Materials
          'Brand Materials': formData.brandMaterials.materials.join(', '),
          'Brand Materials Notes': formData.brandMaterials.notes,

          // Campaign Timeline
          'Campaign Duration': formData.campaignTimeline.duration,
          'Launch Date': formData.campaignTimeline.launchDate,

          // Additional Notes
          'Additional Notes': formData.additionalNotes.notes,
        },
      },
    ]);

    return NextResponse.json(
      {
        success: true,
        message: 'Form submitted successfully',
        recordId: airtableRecord[0].id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      {
        error: 'Failed to submit form',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
