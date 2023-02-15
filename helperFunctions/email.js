const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  console.log("email>> module>>", email);
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });
    console.log("Email sent successfully");
  } catch (err) {
    console.log("Email not sent");
    console.error(err);
  }
};

module.exports = { sendEmail };
