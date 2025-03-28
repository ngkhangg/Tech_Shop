const nodemailer = require("nodemailer");
require("dotenv").config();

class Email {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    // Gửi email liên hệ
    async sendContactEmail({ name, email, message }) {
        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: process.env.RECEIVE_EMAIL, 
            replyTo: email, 
            subject: `Liên hệ từ ${name}`,
            text: `Tên: ${name}\nEmail: ${email}\nTin nhắn: ${message}`,
        };

        return this.transporter.sendMail(mailOptions);
    }
}

module.exports = new Email();
