import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Vi tar emot 'replyTo' och 'senderName' också
  const { subject, body, replyTo, senderName } = req.body;

  if (!subject || !body) {
    return res.status(400).json({ message: 'Missing data' });
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
      // TRICK: Visa kundens namn som avsändare, men använd din adress
      from: `"${senderName} (Portfolio)" <${process.env.GMAIL_USER}>`,
      
      to: process.env.GMAIL_USER,
      
      // HÄR ÄR MAGIN: När du trycker "Svara" går det till kunden!
      replyTo: replyTo, 
      
      subject: subject,
      text: body,
      html: body.replace(/\n/g, '<br>')
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: error.message });
  }
}