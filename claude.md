# Claude.md - Project Context for AI Assistance

## Project Overview

**Project Name:** Google Ads Client Intake Form
**Client:** Webifyd Technologies
**Purpose:** Professional web form to collect comprehensive Google Ads campaign requirements from clients, with automatic Airtable integration for data management and AI-powered campaign analysis.

## Current Status (2025-11-18)

### ✅ Completed Features
- Next.js 14 app with TypeScript and Tailwind CSS
- Complete intake form with 11 sections covering all campaign aspects
- Airtable API integration for data storage
- Responsive design with Webifyd branding
- Logo display with white background container
- Email functionality removed (handled by Airtable automations)

**Quick Wins - All Implemented:**
1. ✅ Progress bar with section tracking (11 sections)
2. ✅ Progress percentage calculation based on form completion
3. ✅ Auto-save to localStorage every 30 seconds
4. ✅ Draft restoration on page reload (7-day expiry)
5. ✅ Real-time field validation (email, phone, URLs)
6. ✅ Helpful tooltips on complex fields with examples
7. ✅ HTML5 calendar picker with min date constraint
8. ✅ Loading spinner on submit button
9. ✅ Enhanced success/error messages with animations
10. ✅ Estimated time remaining indicator

### 🚧 In Progress
- None (Phase 1 Complete, Planning Phase 2)

### 📋 Next Up: Phase 2 (Core UX - 1 week)
1. Multi-step form with navigation (5 steps)
2. Form summary/review page before submission
3. File upload for brand assets (Cloudinary integration)
4. Conditional logic for smart fields
5. Enhanced placeholder text with examples

### 📋 Future Phases
- **Phase 3** (2 weeks): Multi-language, Budget calculator, Dark mode, Character counters
- **Phase 4** (1 month): AI suggestions, Meeting scheduler, Analytics dashboard
- **Phase 5** (2 weeks): Mobile optimization, Security hardening, Performance, Accessibility

## Technical Stack

```json
{
  "framework": "Next.js 14.2.0 (App Router)",
  "language": "TypeScript 5.0.0",
  "styling": "Tailwind CSS 3.4.0",
  "backend": "Next.js API Routes",
  "database": "Airtable (via REST API)",
  "deployment": "TBD (Vercel recommended)",
  "dependencies": [
    "react 18.3.0",
    "react-dom 18.3.0",
    "airtable 0.12.2",
    "next 14.2.0"
  ]
}
```

## Project Structure

```
google-ad-intake-form/
├── app/
│   ├── api/
│   │   └── submit/
│   │       └── route.ts          # POST endpoint - handles form submission to Airtable
│   ├── globals.css               # Global styles, Tailwind directives
│   ├── layout.tsx                # Root layout with fonts and metadata
│   └── page.tsx                  # Home page - renders IntakeForm component
├── components/
│   └── IntakeForm.tsx            # Main form component (800+ lines)
├── types/
│   └── form.ts                   # TypeScript interfaces for form data
├── public/
│   └── webifyd-logo-tp.png       # Webifyd logo (300x90px recommended)
├── reference/                    # Original form references
├── .env.example                  # Environment variables template
├── FEATURE_IMPROVEMENTS.md       # Roadmap of 35+ enhancement ideas
├── IMPLEMENTATION_ROADMAP.md     # Detailed phase-by-phase implementation plan
├── AIRTABLE_AI_PROMPT.md         # AI prompts for Airtable analysis
└── AIRTABLE_SETUP_GUIDE.md       # Complete Airtable configuration guide
```

## Key Files & Their Purposes

### `components/IntakeForm.tsx`
- Main form component with 10 sections
- Manages form state with React useState
- Handles checkboxes, radio buttons, text inputs
- Form submission logic with error handling
- Success/error message display

### `app/api/submit/route.ts`
- API endpoint: POST /api/submit
- Validates required fields (companyName, contactPerson, email)
- Creates Airtable record with 35 fields
- Returns success/error responses

### `types/form.ts`
- TypeScript interfaces for type safety
- IntakeFormData structure mirrors form sections
- Nested objects for each form section

## Environment Variables

```env
# Required
AIRTABLE_API_KEY=pat...          # Personal access token from Airtable
AIRTABLE_BASE_ID=app...          # Base ID from Airtable URL
AIRTABLE_TABLE_NAME=Google_Ads_Intake  # Table name (default)

# Not used anymore (removed)
# SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFICATION_EMAIL
```

## Airtable Schema

**35 Required Fields** (all exact names, case-sensitive):

### Company Information (7 fields)
- Company Name, Contact Person, Position, Email, Phone, Website, Office Location

### Campaign Objective (3 fields)
- Campaign Goals, Other Goal, Expected Outcome

### Target Audience (7 fields)
- Customer Types, Other Customer Type, Geographic Targeting, Specific Emirates, International Markets, Languages, Other Language

### Campaign Budget (3 fields)
- Daily Budget (text, not currency), Other Budget, Budget Increase

### Products/Services (3 fields)
- Core Products, Catalog Link, Focus Products

### Lead Definition (2 fields)
- Lead Types, Other Lead Type

### Keywords & Competitors (3 fields)
- Keywords, Competitors, Competitor Notes

### USPs (2 fields)
- Selected USPs, Other USPs

### Brand Materials (2 fields)
- Brand Materials, Brand Materials Notes

### Campaign Timeline (2 fields)
- Campaign Duration, Launch Date (text field, not date)

### Additional (1 field)
- Additional Notes

**Recommended Additional Fields:**
- Created time (auto-generated by Airtable)
- Status (single select: New, In Review, Approved, Live)
- Campaign Analysis (AI text field for strategic insights)

## Brand Guidelines (Webifyd)

### Colors
```css
--webifyd-navy: #1B2951     /* Primary - Headers, CTAs */
--webifyd-blue: #2E86C1     /* Secondary - Accents, links */
--webifyd-gray-light: #F8F9FA  /* Backgrounds */
--webifyd-gray-medium: #343A40 /* Body text */
```

### Typography
- Font: Inter (system fonts fallback)
- Headings: Bold, uppercase
- Body: Regular weight, high readability

### Logo
- File: `/public/webifyd-logo-tp.png`
- Display: White background container with rounded corners
- Size: h-16 (64px) minimum

## Form Sections (in order)

1. **Company Information** - Basic client details
2. **Campaign Objective** - Goals and expected outcomes
3. **Target Audience & Location** - Demographics, geography, languages
4. **Campaign Budget** - Daily budget ranges, scalability
5. **Products/Services to Promote** - Core offerings, focus areas
6. **Lead & Conversion Definition** - What counts as a lead
7. **Keywords & Competitors** - Target terms, competitive landscape
8. **Unique Selling Points** - What makes them special
9. **Assets & Brand Materials** - Available creative resources
10. **Campaign Timeline** - Duration, launch date
11. **Additional Notes** - Open-ended instructions

## Common Issues & Solutions

### Issue: Airtable field not populating
**Solution:** Field names must match EXACTLY (case-sensitive, spaces match)

### Issue: "INVALID_VALUE_FOR_COLUMN" error
**Solution:**
- Daily Budget must be "Single line text" not Currency
- Launch Date must be "Single line text" not Date
- Arrays are joined with ", " before sending

### Issue: Logo not visible
**Solution:** Dark logo needs white background on dark header (fixed)

### Issue: Form submission fails silently
**Solution:** Check browser console, verify .env variables loaded

## Development Commands

```bash
npm install              # Install dependencies
npm run dev             # Start dev server (http://localhost:3000)
npm run build           # Build for production
npm start               # Run production build
npm run lint            # Run ESLint
```

## Git Workflow

- **Branch:** master
- **Commit Strategy:** Commit after each feature implementation
- **Do NOT push** to remote automatically
- Use descriptive commit messages: "feat: add progress bar to form"

## Testing Checklist

- [ ] Form loads without errors
- [ ] All 10 sections visible
- [ ] Required fields validated
- [ ] Optional fields skippable
- [ ] Submission creates Airtable record
- [ ] Success message displays
- [ ] Form resets after submission (or shows success state)
- [ ] Mobile responsive
- [ ] Logo displays correctly

## AI Integration (Airtable)

### Use Case
After form submission, Airtable AI analyzes the intake data and generates:
- Strategic campaign recommendations
- Budget sufficiency analysis
- Competitive positioning insights
- Risk assessment
- Priority action items
- Campaign complexity scoring

### Implementation
1. Create AI text field in Airtable
2. Use prompt from AIRTABLE_AI_PROMPT.md
3. Field auto-generates on record creation
4. Results visible to account managers

## Next Steps (Priority Order)

**See IMPLEMENTATION_ROADMAP.md for complete systematic plan with detailed tasks, timelines, and dependencies.**

### Phase 1: Quick Wins ✅ COMPLETE
1. ✅ Progress bar showing section completion
2. ✅ Auto-save to localStorage
3. ✅ Enhanced field validation
4. ✅ Tooltips/help text
5. ✅ Calendar picker for dates
6. ✅ Better loading states
7. ✅ Estimated time indicator

### Phase 2: Core UX (Next - 1 week)
1. Multi-step form with navigation (2 days)
2. Form summary/review page (1 day)
3. File upload for brand assets - Cloudinary (2 days)
4. Conditional logic for smart fields (1 day)
5. Enhanced placeholder text (0.5 day)

### Phase 3: Enhanced Features (2 weeks)
1. Industry selector with presets (2 days)
2. Budget calculator with ROI estimator (3 days)
3. Multi-language support - Arabic/English (4 days)
4. Collapsible sections (1 day)
5. Character counters (0.5 day)
6. Dark mode (1.5 days)
7. Draft sharing via link (2 days)

### Phase 4: Advanced Features (1 month)
1. AI-powered field suggestions (5 days)
2. Website data auto-population (3 days)
3. Meeting scheduler integration (1 day)
4. Analytics dashboard (5 days)
5. CRM integration - optional (2 days)

### Phase 5: Polish & Scale (2 weeks)
1. Mobile optimization pass (2 days)
2. Performance optimization (2 days)
3. Security & privacy hardening (2 days)
4. Accessibility improvements (2 days)
5. Duplicate detection (1 day)
6. Visual enhancements (2 days)

## Code Style & Preferences

- Use TypeScript strict mode
- Tailwind CSS for all styling (no CSS modules)
- Functional components with hooks
- Clear variable naming
- Comments for complex logic
- Error handling for all async operations
- User-friendly error messages

## Notes for Future Development

1. **File Uploads:** Will need cloud storage (AWS S3 or Cloudinary)
2. **Multi-language:** Consider next-intl or react-i18next
3. **Analytics:** Add Google Analytics or Plausible
4. **A/B Testing:** Track completion rates per variant
5. **Mobile App:** Could be PWA with offline support

## Contact & Resources

- **Client:** Webifyd Technologies
- **Tagline:** "Digital Solutions You Can Trust"
- **Industry Focus:** UAE market, Arabic/English bilingual
- **Target Users:** Marketing managers, business owners seeking Google Ads services

## Important Conventions

- **Commit messages:** Use conventional commits (feat:, fix:, docs:, etc.)
- **Branch names:** feature/progress-bar, fix/validation-bug, etc.
- **PR descriptions:** Include screenshots for UI changes
- **Testing:** Test on Chrome, Safari, mobile before committing

---

**Last Updated:** 2025-11-18
**Status:** Phase 1 Complete ✅ | Planning Complete ✅
**Next Milestone:** Phase 2 - Core UX Enhancements
**Implementation Plan:** See IMPLEMENTATION_ROADMAP.md for detailed systematic plan

## Recent Changes (Latest Session)

### Commits Made
1. `docs: add comprehensive claude.md for AI-assisted development context`
2. `docs: update README to reflect current architecture (Airtable-only, no email)`
3. `feat: add progress bar with section tracking and completion percentage`
4. `feat: add auto-save to localStorage with draft restoration`
5. `feat: add real-time field validation for email, phone, and URLs`
6. `feat: add helpful tooltips for complex fields with examples`
7. `feat: enhance calendar picker with min date and helpful tooltip`
8. `feat: add loading spinner and enhanced success/error feedback with animations`

### Features Added This Session
- **Progress Tracking**: Sticky progress bar shows current section (X of 11) and completion percentage
- **Auto-Save**: Forms auto-save every 30 seconds, restore on return, 7-day expiry
- **Smart Validation**: Email, phone, and URL validation with inline error messages
- **Helpful Tooltips**: Info icons on complex fields (Keywords, Competitors, Budget, Expected Outcome, USPs)
- **Calendar Picker**: Launch date field with native date picker, past dates disabled
- **Loading States**: Animated spinner during submission, improved success/error alerts
- **Time Estimates**: "X min remaining" based on form completion percentage

---

## Quick Reference Commands

```bash
# Development
npm run dev

# Check git status
git status

# Stage changes
git add .

# Commit with message
git commit -m "feat: add progress bar"

# View commit history
git log --oneline

# Check for uncommitted changes
git diff
```
