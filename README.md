# Google Ads Intake Form - Webifyd Technologies

A professional web application for collecting Google Ads campaign requirements from clients. Built with Next.js, TypeScript, and Tailwind CSS, featuring Airtable integration and email notifications.

## Features

- ✅ **Comprehensive Intake Form** - Collects all necessary information for Google Ads campaigns
- ✅ **Airtable Integration** - Automatically saves submissions to your Airtable base
- ✅ **Email Notifications** - Sends detailed email to your team and confirmation to client
- ✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ✅ **Webifyd Branding** - Matches your brand guidelines with blue color scheme
- ✅ **Form Validation** - Ensures required fields are completed
- ✅ **Success/Error Handling** - Clear user feedback on submission status

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Airtable
- **Email:** Nodemailer
- **Deployment:** Vercel (recommended)

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- An Airtable account and API key
- SMTP email credentials (Gmail, SendGrid, etc.)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**

   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```

3. **Configure your environment variables:**

   Edit `.env.local` with your actual credentials:

   ```env
   # Airtable Configuration
   AIRTABLE_API_KEY=your_airtable_api_key_here
   AIRTABLE_BASE_ID=your_base_id_here
   AIRTABLE_TABLE_NAME=Google_Ads_Intake

   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password_here
   NOTIFICATION_EMAIL=recipient@example.com
   ```

## Airtable Setup

### 1. Create a New Base

1. Go to [Airtable](https://airtable.com)
2. Create a new base called "Google Ads Intake"
3. Create a table with the following fields:

### 2. Required Airtable Fields

Create these fields in your Airtable table (all as "Single line text" unless specified):

**Company Information:**
- Company Name
- Contact Person
- Position
- Email
- Phone
- Website
- Office Location

**Campaign Details:**
- Campaign Goals (Long text)
- Other Goal
- Expected Outcome (Long text)
- Customer Types (Long text)
- Other Customer Type
- Geographic Targeting (Long text)
- Specific Emirates
- International Markets
- Languages (Long text)
- Other Language

**Budget & Products:**
- Daily Budget
- Other Budget
- Budget Increase
- Core Products (Long text)
- Catalog Link (URL)
- Focus Products (Long text)

**Lead & Competition:**
- Lead Types (Long text)
- Other Lead Type
- Keywords (Long text)
- Competitors (Long text)
- Competitor Notes (Long text)

**USPs & Branding:**
- Selected USPs (Long text)
- Other USPs (Long text)
- Brand Materials (Long text)
- Brand Materials Notes (Long text)

**Timeline:**
- Campaign Duration
- Launch Date (Date)

**Additional:**
- Additional Notes (Long text)
- Submission Date (Date & Time)

### 3. Get Your API Credentials

1. Go to [Airtable Account](https://airtable.com/account)
2. Generate a Personal Access Token with the following scopes:
   - `data.records:read`
   - `data.records:write`
3. Copy your Base ID from the URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
   - The `appXXXXXXXXXXXXXX` part is your Base ID

## Email Setup

### Using Gmail

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in your `.env.local` file

### Using Other SMTP Services

Update the SMTP settings in `.env.local`:
- **SendGrid:** `smtp.sendgrid.net` (Port 587)
- **Mailgun:** `smtp.mailgun.org` (Port 587)
- **AWS SES:** `email-smtp.region.amazonaws.com` (Port 587)

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add your environment variables in Vercel project settings
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/google-ads-intake-form)

### Environment Variables in Vercel

Add all the variables from `.env.local` in:
**Project Settings → Environment Variables**

## Project Structure

```
google-ad-intake-form/
├── app/
│   ├── api/
│   │   └── submit/
│   │       └── route.ts          # API endpoint for form submission
│   ├── globals.css               # Global styles with Tailwind
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   └── IntakeForm.tsx            # Main form component
├── public/
│   └── webifyd-logo-tp.png       # Webifyd logo
├── reference/
│   ├── Google_Ads_Client_Intake_Form.pdf
│   └── Google_Ads_Intake_Form_Preview.html
├── types/
│   └── form.ts                   # TypeScript type definitions
├── .env.example                  # Environment variables template
├── .gitignore
├── brandbook.md                  # Webifyd brand guidelines
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Customization

### Changing Colors

Edit `tailwind.config.ts` to customize the color scheme:

```typescript
colors: {
  webifyd: {
    navy: '#1B2951',
    blue: '#2E86C1',
    // ... add more colors
  },
}
```

### Modifying Form Fields

Edit `components/IntakeForm.tsx` and `types/form.ts` to add or remove fields.

### Email Template

Customize the email template in `app/api/submit/route.ts` in the `generateEmailHTML()` function.

## Testing

### Test Form Submission

1. Fill out the form with test data
2. Check your Airtable base for the new record
3. Check your email inbox for the notification
4. Verify the client received a confirmation email

### Common Issues

**Airtable Error:**
- Verify your API key and Base ID are correct
- Ensure all field names in the code match your Airtable exactly
- Check that your API token has write permissions

**Email Not Sending:**
- For Gmail, make sure you're using an App Password, not your regular password
- Check spam/junk folders
- Verify SMTP settings are correct for your provider

**Build Errors:**
- Run `npm install` to ensure all dependencies are installed
- Delete `.next` folder and `node_modules`, then reinstall

## Support

For issues or questions:
1. Check the [Next.js Documentation](https://nextjs.org/docs)
2. Review [Airtable API Documentation](https://airtable.com/developers/web/api/introduction)
3. Contact Webifyd Technologies support

## License

© 2025 Webifyd Technologies. All rights reserved.

---

**Built with ❤️ by Webifyd Technologies**
*Digital Solutions You Can Trust*
