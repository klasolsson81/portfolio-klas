import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { subject, body } = req.body;

  if (!subject || !body) {
    return res.status(400).json({ message: 'Missing subject or body' });
  }

  // Konfigurera kopplingen till Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  try {
    // Skicka mailet (från dig, TILL dig själv)
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Du skickar till dig själv
      subject: `PORTFOLIO: ${subject}`,
      text: body, // Ren textversion
      html: body.replace(/\n/g, '<br>') // Enkel HTML-version (byter radbrytningar mot <br>)
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: error.message });
  }
}