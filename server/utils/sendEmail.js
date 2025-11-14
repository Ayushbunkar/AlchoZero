import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text }) => {
  const user = process.env.MAIL_USER || process.env.GMAIL_USER || process.env.GMAIL_USER;
  const pass = process.env.MAIL_PASS || process.env.GMAIL_PASS || process.env.GMAIL_PASS;

  if (!user || !pass) {
    console.warn("MAIL_USER/MAIL_PASS or GMAIL_USER/GMAIL_PASS not set; skipping email send");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from: user,
    to,
    subject,
    text,
  });
};

export default sendEmail;
