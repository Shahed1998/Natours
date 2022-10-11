const nodemailer = require('nodemailer');

const email = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.Email_USERNAME,
      pass: process.env.Email_PASSWORD,
    },
  });
  // 2. Define an email option
  const mailOptions = {
    from: 'Shahed Chowdhury Omi <shahedc98@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };
  // 3. Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = email;
