require("dotenv").config();
const nodemailer = require("nodemailer");

const { META_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "dima.chernyaev@meta.ua",
    pass: META_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async ({ to, subject, html }) => {
  try {
    const mail = transport.sendMail({
      from: "dima.chernyaev@meta.ua",
      to,
      subject,
      html,
    });

    await transport.sendMail(mail);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
