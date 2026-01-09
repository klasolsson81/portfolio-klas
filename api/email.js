import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { checkRateLimit, getClientIP } from '../lib/utils/rateLimit.js';
import { logger } from '../lib/utils/logger.js';
import { RATE_LIMIT } from '../lib/config/constants.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // 1. Rate Limiting
  const clientIP = getClientIP(req);
  if (!checkRateLimit(clientIP, 5, 60000).allowed) { // Max 5 mail per minut
    return res.status(429).json({ error: 'För många mailförsök. Vänta en stund.' });
  }

  const { subject, body, replyTo, senderName, verificationToken, analysisData } = req.body;

  // 2. Validera Verifieringstoken (Hindra Spam Relay)
  // Vi räknar ut HMAC igen och ser om det matchar det som skickades
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const expectedData = `${replyTo}-${analysisData.status}-${analysisData.estimatedHours}`;
  const expectedToken = crypto
    .createHmac('sha256', secret)
    .update(expectedData)
    .digest('hex');

  if (verificationToken !== expectedToken) {
    logger.warn('Ogiltig verifieringstoken vid e-postförsök', { ip: clientIP, email: replyTo });
    return res.status(403).json({ error: 'Obehörigt anrop. Mailet kunde inte verifieras.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${senderName} (Portfolio)" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: replyTo, 
      subject: subject,
      text: body,
      html: body.replace(/\n/g, '<br>')
    });

    logger.info('E-post skickad och verifierad', { to: process.env.GMAIL_USER });
    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Email error', error);
    return res.status(500).json({ error: 'Kunde inte skicka e-post.' });
  }
}