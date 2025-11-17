# Setup Checklist

Follow these steps to get your Google Ads Intake Form up and running.

## ✅ Step 1: Airtable Setup

### 1.1 Create Airtable Base
- [ ] Go to [airtable.com](https://airtable.com)
- [ ] Create a new base called "Google Ads Intake"
- [ ] Rename the default table to "Google_Ads_Intake" (or your preferred name)

### 1.2 Create Fields in Airtable

Copy/paste these field names into your Airtable table. All should be "Single line text" type unless noted:

**Company Section:**
```
Company Name
Contact Person
Position
Email
Phone
Website
Office Location
```

**Campaign Section:**
```
Campaign Goals (Long text)
Other Goal
Expected Outcome (Long text)
```

**Target Audience:**
```
Customer Types (Long text)
Other Customer Type
Geographic Targeting (Long text)
Specific Emirates
International Markets
Languages (Long text)
Other Language
```

**Budget:**
```
Daily Budget
Other Budget
Budget Increase
```

**Products:**
```
Core Products (Long text)
Catalog Link (URL type)
Focus Products (Long text)
```

**Leads:**
```
Lead Types (Long text)
Other Lead Type
```

**Keywords & Competitors:**
```
Keywords (Long text)
Competitors (Long text)
Competitor Notes (Long text)
```

**USPs:**
```
Selected USPs (Long text)
Other USPs (Long text)
```

**Brand Materials:**
```
Brand Materials (Long text)
Brand Materials Notes (Long text)
```

**Timeline:**
```
Campaign Duration
Launch Date (Date type)
```

**Additional:**
```
Additional Notes (Long text)
Submission Date (Date type)
```

### 1.3 Get Airtable Credentials
- [ ] Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
- [ ] Click "Create new token"
- [ ] Name it "Google Ads Intake Form"
- [ ] Add scopes:
  - `data.records:read`
  - `data.records:write`
- [ ] Add access to your "Google Ads Intake" base
- [ ] Click "Create token"
- [ ] **Copy the token** (you won't see it again!)
- [ ] Get your Base ID from the URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
  - The `appXXXXXXXXXXXXXX` part is your Base ID

## ✅ Step 2: Email Setup (Gmail)

### 2.1 Enable 2-Factor Authentication
- [ ] Go to [myaccount.google.com/security](https://myaccount.google.com/security)
- [ ] Enable 2-Step Verification if not already enabled

### 2.2 Create App Password
- [ ] Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
- [ ] Select "Mail" and your device
- [ ] Click "Generate"
- [ ] **Copy the 16-character password**

## ✅ Step 3: Configure Environment Variables

### 3.1 Create .env.local file
- [ ] Copy `.env.example` to `.env.local`
- [ ] Edit `.env.local` with your credentials:

```env
# Airtable Configuration
AIRTABLE_API_KEY=paste_your_token_here
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TABLE_NAME=Google_Ads_Intake

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com
SMTP_PASS=your_16_char_app_password
NOTIFICATION_EMAIL=where_to_receive@notifications.com
```

## ✅ Step 4: Test Locally

### 4.1 Install Dependencies (if not already done)
```bash
npm install
```

### 4.2 Run Development Server
```bash
npm run dev
```

### 4.3 Test the Form
- [ ] Open [http://localhost:3000](http://localhost:3000)
- [ ] Fill out the form with test data
- [ ] Submit the form
- [ ] Check Airtable for the new record
- [ ] Check email for notification
- [ ] Verify success message appears

## ✅ Step 5: Deploy to Production

### Option A: Deploy to Vercel (Recommended)

#### 5.1 Push to GitHub
```bash
git add .
git commit -m "Initial commit - Google Ads intake form"
git push origin master
```

#### 5.2 Deploy on Vercel
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Click "Import Project"
- [ ] Select your GitHub repository
- [ ] Add environment variables in project settings:
  - AIRTABLE_API_KEY
  - AIRTABLE_BASE_ID
  - AIRTABLE_TABLE_NAME
  - SMTP_HOST
  - SMTP_PORT
  - SMTP_USER
  - SMTP_PASS
  - NOTIFICATION_EMAIL
- [ ] Click "Deploy"

#### 5.3 Test Production
- [ ] Visit your Vercel URL
- [ ] Submit a test form
- [ ] Verify Airtable and email work

### Option B: Deploy to Other Hosting

If using other hosting (Netlify, AWS, DigitalOcean, etc.):
- [ ] Build the project: `npm run build`
- [ ] Set environment variables in hosting dashboard
- [ ] Deploy the `.next` folder

## ✅ Step 6: Share with Clients

- [ ] Get your production URL
- [ ] Share with clients: `https://your-domain.vercel.app`
- [ ] Optional: Set up custom domain in Vercel

## 🎉 You're Done!

Your Google Ads Intake Form is now live and ready to collect client information.

## Troubleshooting

### Form submission fails
1. Check browser console for errors
2. Verify all environment variables are set correctly
3. Check Airtable field names match exactly (case-sensitive!)
4. Verify API token has write permissions

### Email not sending
1. For Gmail, ensure you're using App Password, not regular password
2. Check spam/junk folder
3. Verify SMTP settings are correct
4. Test SMTP credentials with a simple email tool

### Build errors
1. Delete `node_modules` and `.next` folders
2. Run `npm install` again
3. Check for TypeScript errors: `npm run build`

## Need Help?

- 📖 [Next.js Docs](https://nextjs.org/docs)
- 📖 [Airtable API Docs](https://airtable.com/developers/web/api/introduction)
- 📧 Contact Webifyd Technologies support

---

**Webifyd Technologies** | Digital Solutions You Can Trust
