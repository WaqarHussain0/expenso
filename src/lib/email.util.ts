/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer, { Transporter } from 'nodemailer';

let transporter: Transporter | null = null;

/* -------------------------------------------------------------------------- */
/*                                Types                                        */
/* -------------------------------------------------------------------------- */

export interface ISendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: {
    filename: string;
    path?: string;
    content?: Buffer;
  }[];
  from?: string; // optional override
}

/* -------------------------------------------------------------------------- */
/*                         Environment Validation                              */
/* -------------------------------------------------------------------------- */

const requiredEnvVars = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_FROM',
];

const validateEnv = () => {
  for (const key of requiredEnvVars) {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }
};

/* -------------------------------------------------------------------------- */
/*                          Transporter Factory                                */
/* -------------------------------------------------------------------------- */

export const getTransporter = (): Transporter => {
  if (transporter) return transporter;

  validateEnv();

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

/* -------------------------------------------------------------------------- */
/*                              Email Sender                                   */
/* -------------------------------------------------------------------------- */

export const sendEmail: any = async (
  options: ISendEmailOptions,
  retries = 3,
) => {
  const transporter = getTransporter();

  const mailOptions = {
    from: options.from || `"Expenso" <${process.env.SMTP_FROM}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    attachments: options.attachments,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Email sent:', info.messageId);
    }

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('❌ Email send failed:', error);

    if (retries > 0) {
      console.log(`🔁 Retrying... Attempts left: ${retries}`);
      return sendEmail(options, retries - 1);
    }

    throw new Error('Failed to send email after retries');
  }
};

/* -------------------------------------------------------------------------- */
/*                          Optional: Verify SMTP                              */
/* -------------------------------------------------------------------------- */

export const verifyEmailConnection = async () => {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    console.log('✅ SMTP connection verified');
  } catch (error) {
    console.error('❌ SMTP verification failed:', error);
    throw error;
  }
};
