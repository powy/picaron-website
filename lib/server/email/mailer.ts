// Sends emails over SMTP (nodemailer). Locally SMTP_HOST/PORT point at
// Mailpit (infra/local/docker-compose.yml, inbox UI on http://localhost:8025);
// in staging/prod at the real provider. EMAIL_TRANSPORT=console only prints
// the email — handy offline without Docker, refused in production.

import nodemailer from 'nodemailer';
import type { ServerConfig } from '../config';
import type { EmailMessage } from './order-confirmation';

export type SendEmail = (message: EmailMessage) => Promise<void>;

// FIXME(email): TEMPORARY. With EMAIL_TRANSPORT=emailjs the customer gets NO
// email (see emailRouting() in config.ts): only the internal notifications
// (order paid / payment failed, order-notification.ts) are sent, to the team,
// through the same EmailJS template as the contact form (fields name / email /
// subject / message). The subject and the body start with a FIXME on purpose
// so nobody forgets that customers are not being emailed. Remove once an SMTP
// provider is configured (plan: "Email" in
// shop update plan/13-plan-mise-en-production.md).
export const EMAILJS_FIXME_TAG = 'FIXME email client non envoyé (SMTP à configurer)';
const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

export function toEmailJsParams(message: EmailMessage) {
  const customer = message.replyTo ?? message.to;
  return {
    name: 'Boutique Picaron (FIXME)',
    // Customer address, so that "reply" in our mailbox reaches the customer.
    email: customer,
    subject: `[${EMAILJS_FIXME_TAG}] ${message.subject}`,
    message: [
      `FIXME: aucun fournisseur SMTP n'est configuré, le client (${customer}) n'a reçu AUCUN email de confirmation.`,
      "Ceci est une notification interne. Lui écrire à la main si besoin.",
      '',
      message.text,
    ].join('\n'),
  };
}

export function createMailer(config: ServerConfig): SendEmail {
  if (config.emailTransport === 'emailjs') {
    const { serviceId, templateId, publicKey, privateKey } = config.emailjs;
    return async (message) => {
      console.warn(`[email:emailjs] FIXME temporary transport: "${message.subject}" goes to the team only`);
      const response = await fetch(EMAILJS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          ...(privateKey ? { accessToken: privateKey } : {}),
          template_params: toEmailJsParams(message),
        }),
      });
      if (!response.ok) {
        throw new Error(`EmailJS ${response.status}: ${(await response.text()).slice(0, 200)}`);
      }
    };
  }

  if (config.emailTransport === 'console') {
    return async (message) => {
      console.log(`[email:console] To: ${message.to}\nSubject: ${message.subject}\n\n${message.text}\n`);
    };
  }

  const transport = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass ?? '' } : undefined,
  });

  return async (message) => {
    await transport.sendMail({ from: config.emailFrom, ...message });
  };
}
