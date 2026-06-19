# Contact Form Backend

## Recommended Free Setup

[Recommendation] Use Google Sheets plus Google Apps Script as the first lead backend.

Reason:

- Google Sheets gives an immediate lead table.
- Apps Script can receive webhook-style submissions.
- No database account is required.
- The website keeps the public form endpoint inside Next.js at `/api/contact`.

[Constraint] Do not store lead data in the repository.

## Website Environment Variables

Set these in Vercel Project Settings -> Environment Variables:

```txt
CONTACT_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
CONTACT_WEBHOOK_SECRET=choose-a-long-random-string
```

`CONTACT_WEBHOOK_SECRET` is optional in the website code, but recommended.

## Google Sheet Columns

Create a Google Sheet with a tab named `Leads` and this header row:

```txt
Submitted At | Name | Email | Company | Budget | Goal | Page | Source
```

## Apps Script Webhook

Open Extensions -> Apps Script in the Google Sheet and use:

```js
const SHEET_NAME = 'Leads';
const SHARED_SECRET = 'paste-the-same-secret-used-in-CONTACT_WEBHOOK_SECRET';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const suppliedSecret = e.parameter.secret || '';

    if (SHARED_SECRET && suppliedSecret !== SHARED_SECRET) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'Unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const payload = JSON.parse(e.postData.contents || '{}');
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    sheet.appendRow([
      payload.submittedAt || new Date().toISOString(),
      payload.name || '',
      payload.email || '',
      payload.company || '',
      payload.budget || '',
      payload.goal || '',
      payload.page || '',
      payload.source || 'kramaniti-website',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

Deploy as Web App:

- Execute as: Me
- Who has access: Anyone

Copy the deployment URL into `CONTACT_WEBHOOK_URL`.

## Secret Handling Note

[Recommendation] If Apps Script header access is unreliable for this web app, append the shared secret as a query parameter in `CONTACT_WEBHOOK_URL`:

```txt
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?secret=choose-a-long-random-string
```

This is acceptable for this lightweight lead workflow because the URL is only stored server-side in Vercel, not exposed in browser code.

## Current Website Flow

1. Visitor submits the homepage contact form.
2. Browser sends the payload to `/api/contact`.
3. The Next.js route validates required fields and email format.
4. A hidden honeypot field blocks basic bot submissions.
5. The route forwards the clean lead to `CONTACT_WEBHOOK_URL`.
6. Apps Script appends the lead to Google Sheets.

