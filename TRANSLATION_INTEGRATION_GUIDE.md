# Translation Integration Guide

## ✅ Completed Integrations

### 1. Language Switcher
**Location:** Form header (top-right corner)
- Displays "English" / "العربية" toggle buttons
- Switches between `/en` and `/ar` routes
- Persists current form state when switching languages

### 2. Header Section
**File:** `components/IntakeForm.tsx` (Lines ~435-457)

**Before:**
```tsx
<h1>Google Ads Campaign Client Intake & Strategy Form</h1>
<p>Digital Solutions You Can Trust</p>
```

**After:**
```tsx
<h1>{t('title')}</h1>
<p>{t('tagline')}</p>
```

### 3. Progress Bar
**File:** `components/IntakeForm.tsx` (Lines ~467-487)

**Before:**
```tsx
Section {currentSection} of 11
{calculateProgress()}% Complete
Est. {minutes} min remaining
```

**After:**
```tsx
{tProgress('section', { current: currentSection, total: 11 })}
{tProgress('completion', { percentage: calculateProgress() })}
{tProgress('estimatedTime', { minutes: ... })}
```

### 4. Validation Messages
**File:** `components/IntakeForm.tsx` (Lines ~255-278)

**Before:**
```tsx
return 'Please enter a valid email address';
return 'Please enter a valid phone number';
return 'Please enter a valid URL';
```

**After:**
```tsx
return tValidation('invalidEmail');
return tValidation('invalidPhone');
return tValidation('invalidUrl');
```

### 5. Company Information Section (Step 1)
**File:** `components/IntakeForm.tsx` (Lines ~551-655)

**Fully Translated:**
- Section header
- All field labels (Company Name, Contact Person, Position, Email, Phone, Website, Office Location)
- All placeholders
- Error messages

**Pattern Example:**
```tsx
// Label
<label className="field-label">{tCompanyInfo('companyName')}: *</label>

// Input with placeholder
<input
  type="text"
  className="field-input"
  placeholder={tCompanyInfo('companyNamePlaceholder')}
  value={formData.companyInfo.companyName}
  onChange={(e) => handleInputChange('companyInfo', 'companyName', e.target.value)}
/>
```

## 📋 Remaining Sections to Translate

The following sections still need translation integration. Follow the pattern shown above:

### Step 2: Campaign Details
1. **Campaign Objective** (Section 2)
   - Section header: Use `tSections('campaignObjective')`
   - Goal options: Use `tCampaignObjective('goals.websiteTraffic')`, etc.
   - Expected outcome: Use `tCampaignObjective('expectedOutcome')`
   - Tooltip: Use `tCampaignObjective('tooltip')`

2. **Target Audience & Location** (Section 3)
   - Customer types: Use `tTargetAudience('customerTypesOptions.b2b')`, etc.
   - Geographic targeting: Use `tTargetAudience('geographicOptions.uaeNationwide')`, etc.
   - Languages: Use `tTargetAudience('languagesOptions.english')`, etc.

### Step 3: Budget & Products
3. **Campaign Budget** (Section 4)
   - Budget ranges: Use `tCampaignBudget('dailyBudgetOptions.upTo100')`, etc.
   - Budget tooltip: Use `tCampaignBudget('tooltip')`
   - Budget increase question: Use `tCampaignBudget('budgetIncrease')`

4. **Products/Services** (Section 5)
   - Field labels: Use `tProductsServices('coreProducts')`, etc.
   - Placeholders: Use `tProductsServices('coreProductsPlaceholder')`, etc.

### Step 4: Strategy & Content
5. **Lead Definition** (Section 6)
   - Lead types: Use `tLeadDefinition('leadTypes.formSubmission')`, etc.
   - Section title: Use `tLeadDefinition('title')`

6. **Keywords & Competitors** (Section 7)
   - Keywords field: Use `tKeywordsCompetitors('keywords')`
   - Tooltips: Use `tKeywordsCompetitors('keywordsTooltip')`, etc.

7. **Unique Selling Points** (Section 8)
   - USP options: Use `tUsps('selectedUSPs.bestPrice')`, etc.
   - Tooltip: Use `tUsps('tooltip')`

8. **Brand Materials** (Section 9)
   - Materials options: Use `tBrandMaterials('materials.logo')`, etc.
   - Section title: Use `tBrandMaterials('title')`

9. **Campaign Timeline** (Section 10)
   - Duration options: Use `tCampaignTimeline('durationOptions.oneMonth')`, etc.
   - Launch date tooltip: Use `tCampaignTimeline('launchDateTooltip')`

### Step 5: Review & Submit
10. **Additional Notes** (Section 11)
    - Title: Use `tAdditionalNotes('title')`
    - Placeholder: Use `tAdditionalNotes('notesPlaceholder')`

11. **Review Summary**
    - Will need to update `ReviewSummary.tsx` component separately

## 🔧 Implementation Pattern

### 1. Add Translation Hook
At the top of your component function:
```tsx
const tSectionName = useTranslations('sectionName');
```

### 2. Replace Hardcoded Text
**Labels:**
```tsx
// Before
<label className="field-label">Field Name:</label>

// After
<label className="field-label">{tSectionName('fieldName')}:</label>
```

**Placeholders:**
```tsx
// Before
<input placeholder="Enter your value" />

// After
<input placeholder={tSectionName('fieldNamePlaceholder')} />
```

**Checkbox/Radio Options:**
```tsx
// Before
{['Option 1', 'Option 2', 'Option 3'].map((option) => ...)}

// After
{[
  { key: 'option1', label: tSectionName('options.option1') },
  { key: 'option2', label: tSectionName('options.option2') },
  { key: 'option3', label: tSectionName('options.option3') },
].map((option) => ...)}
```

**Text with Variables:**
```tsx
// Use translation with variables
{tProgress('section', { current: 1, total: 11 })}
// Renders: "Section 1 of 11" or "القسم 1 من 11"
```

### 3. Update Section Headers
```tsx
// Before
<h2 className="section-header rounded">SECTION NAME</h2>

// After
<h2 className="section-header rounded">{tSections('sectionName').toUpperCase()}</h2>
```

## 📝 Translation File Structure Reference

All translations are in:
- `messages/en.json` - English
- `messages/ar.json` - Arabic

Structure:
```json
{
  "app": { /* App-level strings */ },
  "progress": { /* Progress indicators */ },
  "sections": { /* Section headings */ },
  "companyInfo": { /* Company info fields */ },
  "campaignObjective": { /* Campaign objective fields */ },
  // ... etc for each section
}
```

## 🚀 Testing Steps

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Test English
- Navigate to: `http://localhost:3000/en`
- Fill out Step 1 (Company Information)
- Verify all labels, placeholders, and error messages appear in English

### 3. Test Arabic
- Click the "العربية" button in the header
- Verify:
  - URL changes to `/ar`
  - All text switches to Arabic
  - Layout direction changes to RTL (right-to-left)
  - Form data persists

### 4. Test Switching
- Fill out some fields in English
- Switch to Arabic
- Verify form data remains (not cleared)
- Switch back to English
- Verify data still persists

## ⚠️ Important Notes

### Arabic RTL Support
- The layout automatically switches to RTL when locale is 'ar'
- Configured in `app/[locale]/layout.tsx`:
  ```tsx
  <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
  ```
- Tailwind CSS handles RTL transformations automatically

### Form Data Persistence
- Form data is stored in `formData` state (locale-independent)
- Auto-save uses localStorage (persists across language switches)
- Switching languages does NOT clear form data

### Validation
- Validation messages already use translations (`tValidation`)
- Email, phone, and URL validation works in both languages

## 📦 Next Steps

1. **Complete Remaining Sections:**
   - Follow the pattern above for Sections 2-11
   - Update one section at a time
   - Test after each section

2. **Update Child Components:**
   - `StepNavigation.tsx` - Add translations for step labels
   - `ReviewSummary.tsx` - Add translations for review page

3. **Add Missing Translations:**
   - Submit button states ("Submitting...")
   - Success/error messages
   - Navigation buttons ("Previous", "Next Step")
   - Draft restored banner

4. **Testing:**
   - Test all form fields in both languages
   - Test form validation in both languages
   - Test form submission in both languages
   - Verify RTL layout for Arabic

## 🎯 Quick Reference

### Common Translation Hooks
```tsx
const t = useTranslations('app');                    // App-level
const tProgress = useTranslations('progress');       // Progress bar
const tSections = useTranslations('sections');       // Section headers
const tCompanyInfo = useTranslations('companyInfo'); // Company info
const tValidation = useTranslations('validation');   // Validation errors
const tMessages = useTranslations('messages');       // Success/error messages
```

### Example: Full Section Translation
```tsx
// 1. Add translation hook
const tCampaignObjective = useTranslations('campaignObjective');

// 2. Use in JSX
<section>
  <h2>{tSections('campaignObjective').toUpperCase()}</h2>

  <label>{tCampaignObjective('title')}</label>

  <input
    placeholder={tCampaignObjective('expectedOutcomePlaceholder')}
    value={formData.campaignObjective.expectedOutcome}
    onChange={...}
  />

  <Tooltip text={tCampaignObjective('tooltip')} />
</section>
```

---

**Last Updated:** 2025-11-18
**Status:** Partial Integration Complete
**Progress:** Step 1 fully translated, Steps 2-5 pending
