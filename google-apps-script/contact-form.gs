const RECIPIENT_EMAIL = 'sudeepyadav5@gmail.com';

function doGet() {
  return jsonResponse({
    success: true,
    message: 'Portfolio contact form email service is running.',
  });
}

function doPost(e) {
  try {
    const data = e.parameter || {};
    const isBot = Boolean(data.website);
    const isHumanVerified = data.humanCheck === 'verified';

    if (isBot) {
      return jsonResponse({ success: true, skipped: true });
    }

    if (!isHumanVerified) {
      return jsonResponse({
        success: false,
        error: 'Human verification is required.',
      });
    }

    const name = data.name || 'Portfolio visitor';
    const email = data.email || '';
    const subject = data.subject || 'New Portfolio Contact Message';
    const message = data.message || '';
    const emailSubject = `Portfolio Contact Request: ${subject}`;

    MailApp.sendEmail({
      to: RECIPIENT_EMAIL,
      subject: emailSubject,
      replyTo: email,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; color: #2c3e50; line-height: 1.6;">
          <h2 style="margin-bottom: 6px; color: #2980b9;">New Portfolio Inquiry</h2>
          <p style="margin-top: 0; color: #555;">A visitor submitted a message from your portfolio contact form.</p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p><strong>Message:</strong></p>
          <p style="padding: 12px; background: #f8f9fa; border-left: 4px solid #3498db;">
            ${escapeHtml(message).replace(/\n/g, '<br>')}
          </p>
        </div>
      `,
      body: [
        'New Portfolio Inquiry',
        'A visitor submitted a message from your portfolio contact form.',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        '',
        'Message:',
        message,
      ].join('\n'),
    });

    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message });
  }
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
