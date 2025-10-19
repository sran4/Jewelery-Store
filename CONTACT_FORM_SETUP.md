# Contact Form Setup Guide

## How the Contact Form Works

Your jewelry store has a **professional contact form system** that uses:

- **MongoDB**: Stores all contact form submissions
- **SendGrid**: Sends you email notifications when someone submits the form
- **Admin Panel**: View, manage, and delete submissions at `/admin/contact`

## Flow Diagram

```
Customer Fills Form
        ↓
Your Backend API (/api/contact)
        ↓
    ┌───────┴────────┐
    ↓                ↓
Save to MongoDB   SendGrid sends YOU email
    ↓                ↓
View in Admin    Check your inbox
```

## What SendGrid Does

**SendGrid ONLY sends you email notifications. It does NOT:**

- ❌ Store contact submissions (that's MongoDB's job)
- ❌ Replace your database
- ❌ Send emails TO customers (only TO you)

**SendGrid DOES:**

- ✅ Send you a beautiful email notification when someone submits the form
- ✅ Include all customer details (name, email, phone, message)
- ✅ Provide quick action links (reply via email, call customer)

## Setup Instructions

### 1. Get SendGrid API Key

1. Go to [sendgrid.com](https://sendgrid.com)
2. Sign up for a **FREE account** (100 emails/day free forever)
3. Navigate to: **Settings** → **API Keys** → **Create API Key**
4. Choose "Full Access" or at minimum "Mail Send" permission
5. Copy the API key (starts with `SG.`)

### 2. Add to Environment Variables

Add these to your `.env.local` file:

```env
# SendGrid Configuration
SENDGRID_API_KEY=SG.your-actual-api-key-here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=SherGill Official
ADMIN_NOTIFICATION_EMAIL=your-real-email@gmail.com
```

**Important:**

- `ADMIN_NOTIFICATION_EMAIL` is YOUR email where you want to receive notifications
- `SENDGRID_FROM_EMAIL` can be any email (doesn't need to exist, but use your domain for better deliverability)

### 3. Test the Contact Form

1. Start your development server: `npm run dev`
2. Go to: `http://localhost:3000/contact`
3. Fill out and submit the form
4. Check your email inbox (the one you set in `ADMIN_NOTIFICATION_EMAIL`)
5. You should receive a beautiful notification email!

### 4. View Submissions in Admin Panel

1. Login to admin: `http://localhost:3000/admin/login`
2. Go to: **Contact Submissions** (or click "View Inquiries")
3. You can:
   - ✅ View all submissions
   - ✅ Filter by status (new, read, replied)
   - ✅ Mark as read/replied
   - ✅ Add internal admin notes
   - ✅ Delete submissions
   - ✅ Reply via email with one click
   - ✅ Call customer with one click

## Where is the Contact Form?

The same form appears in **2 places**:

1. **Contact Page**: `/contact` - Full page with contact information
2. **Floating Button**: Every page - Click the gift icon at bottom-right corner

## Email Notification Example

When someone submits the form, you'll receive:

```
Subject: New General Inquiry - John Doe

💎 New Contact Form Submission

From: John Doe
Email: john@example.com
Phone: +1 (234) 567-8900
Inquiry Type: General Inquiry

Message:
Hi, I'm interested in your diamond rings...

[Reply via Email] | [Call Customer]
```

## Troubleshooting

### Not Receiving Emails?

1. **Check spam folder** - SendGrid emails might be filtered initially
2. **Verify API key** - Make sure it starts with `SG.`
3. **Check SendGrid dashboard** - Go to Activity → See if emails were sent
4. **Verify `ADMIN_NOTIFICATION_EMAIL`** - Make sure it's YOUR correct email
5. **Check MongoDB** - Even if emails fail, submissions are saved in database

### Form Submission Fails?

1. **Check MongoDB connection** - Make sure `MONGODB_URI` is correct
2. **Check browser console** - Look for error messages
3. **Check server logs** - Run `npm run dev` and watch for errors
4. **Check API route** - Visit `/api/contact` in browser (should show 405 Method Not Allowed)

## Free Tier Limits

- **SendGrid**: 100 emails/day FREE forever
- **MongoDB Atlas**: 512MB storage FREE forever
- **Perfect for small to medium jewelry stores!**

## FAQ

**Q: Do I need to pay for SendGrid?**
A: No! The free tier (100 emails/day) is more than enough for most jewelry stores.

**Q: What if I get more than 100 submissions per day?**
A: Submissions still save to MongoDB. Only the email notification won't be sent for submissions beyond 100/day.

**Q: Can customers see submissions from other customers?**
A: No! Only admins (you) can see all submissions in the admin panel.

**Q: Can I export submissions?**
A: Yes, from the admin panel or directly from MongoDB Atlas.

**Q: What about Web3Forms?**
A: We removed Web3Forms. Your system now uses your own backend (MongoDB + SendGrid), which is more professional and gives you full control.

## Support

If you have issues:

1. Check the [SETUP_GUIDES.md](./SETUP_GUIDES.md) for detailed service setup
2. Check [TESTING_GUIDE.md](./TESTING_GUIDE.md) for testing instructions
3. Review your `.env.local` file for missing/incorrect variables

---

✅ **Your contact form is now fully professional and database-backed!**
