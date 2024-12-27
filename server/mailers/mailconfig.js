 // Move to the top of the file
const nodemailer = require('nodemailer');

const mailBoiler = (receiver, message, subject) => {
    console.log("Sending mail to", receiver);
    
    console.log({user: process.env.EMAIL,
        pass: process.env.PASSWORD})
    
    let transporter = nodemailer.createTransport({
        service: 'Outlook365', // Ensure this matches your email provider
        // auth: {
        //     user: process.env.EMAIL,
        //     pass: process.env.PASSWORD,
        // },
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
        tls: {
            rejectUnauthorized: false, // Use only in development/testing environments
        },
    });

    let mailOptions = {
        from: process.env.EMAIL,
        to: receiver,
        subject: subject,
        html: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return;
        }
        console.log('Email sent successfully:', info.response);
    });
};

module.exports = mailBoiler;
