import nodemailer from "nodemailer";
import "dotenv/config";

const { EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE, EMAIL_PASS, EMAIL_FROM } =
  process.env;

const nodemailerConfig = {
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_SECURE,
  auth: {
    user: EMAIL_FROM,
    pass: EMAIL_PASS,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: EMAIL_FROM };

  return await transport.sendMail(email);
};

export default sendEmail;
