import nodemailer from 'nodemailer'

import dotenv from 'dotenv'
dotenv.config()

export const sendMail = async(to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_TRAP_URL_HOST,
            port: process.env.MAIL_TRAP_URL_PORT,
            auth: {
              user: process.env.MAIL_TRAP_URL_USER,
              pass: process.env.MAIL_TRAP_URL_PASSWORD,
            },
        });
        const info = await transporter.sendMail({
            from: 'Inngest TMS',
            to,
            subject,
            text
        });
        
        console.log("Message sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}