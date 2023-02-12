const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: `Unlock-Master ${process.env.EMAIL_USER}`,
      to: email,
      subject: subject,
      html: html,
    });
  } catch (error) {
    throw new Error("Something went wrong while sending email");
  }
};

const retrieveTemplate = (fileName, templateData) => {
  try {
    const templatePath = path.join(__dirname, fileName);
    const fileSource = fs.readFileSync(templatePath, "utf-8");
    const template = handlebars.compile(fileSource);
    const html = template(templateData);
    return html;
  } catch (error) {
    throw new Error("Failed while retrieving template");
  }
};

module.exports = { sendEmail, retrieveTemplate };
