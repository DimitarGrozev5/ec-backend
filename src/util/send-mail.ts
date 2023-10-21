// in transporter.ts

import nodemailer, { Transporter } from "nodemailer";

export interface MailOptions {
  to: string;
  subject: string;
  text: string;
}

export function sendMail(options: MailOptions): Promise<any> {
  console.log(
    process.env.SMTP_HOST,
    process.env.SMTP_PORT,
    process.env.SMTP_USERNAME,
    process.env.SMTP_PASSWORD
  );

  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT!),
    // secure: true,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    debug: true,
  });

  const mailOptions = {
    from: process.env.SMTP_USERNAME,
    ...options,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
}
