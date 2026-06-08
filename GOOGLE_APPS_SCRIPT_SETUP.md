# Google Apps Script Contact Form Setup

Use this setup to send portfolio contact form messages through Gmail for free.

## 1. Create The Script

1. Open <https://script.google.com/>.
2. Click **New project**.
3. Delete the default code.
4. Copy everything from `google-apps-script/contact-form.gs`.
5. Paste it into the Apps Script editor.
6. Click **Save** and name the project `Portfolio Contact Form`.

## 2. Deploy As Web App

1. Click **Deploy**.
2. Click **New deployment**.
3. Select type: **Web app**.
4. Set **Execute as** to **Me**.
5. Set **Who has access** to **Anyone**.
6. Click **Deploy**.
7. Google will ask for permission. Approve it.
8. Copy the generated **Web app URL**.

## 3. Send The URL Back

Send the Web app URL here. It looks similar to:

```text
https://script.google.com/macros/s/AKfycb.../exec
```

After you share that URL, the portfolio form can be updated to send emails through your Gmail.

## Important

Do not use the script editor URL. Use only the deployed Web app URL ending with `/exec`.
