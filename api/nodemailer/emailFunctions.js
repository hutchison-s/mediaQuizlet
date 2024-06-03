import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export async function sendEmail({quizId, title, password, admin}) {
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.BREVO_USER,
            pass: process.env.BREVO_PASS
        }
    });
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: admin,
        subject: "New Media Quizlet Created!",
        html: `
        <section style='font-family: "Rubik", sans-serif; border: 2px solid cornflowerblue; border-radius: 1rem; padding: 2rem;'>
            <h1 style='font-size: 3rem'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"/></svg>
            Media Quizlet</h1>
            <h2>Here's a link to your newly created quiz: ${title}</h2>
            <a href="https://mediaquizlet.netlify.app/quizzer/${quizId}">https://mediaquizlet.netlify.app/quizzer/${quizId}</a>
            <p>Your password for viewing responses: ${password}</p>
            <br></br>
            <p><a href="https://mediaquizlet.netlify.app/generator">Create another!</a></p>
        </section>`,
        
    }
    const info = await transporter.sendMail(mailOptions).catch(err => console.log);
    console.log(info.messageId)
}

export async function receiveContact(req, res) {
    const {from, firstName, lastName, timestamp, text} = req.body;
    if (!from || !timestamp || !text) {
        return res.status(400).send("Missing required fields from request body");
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.BREVO_USER,
            pass: process.env.BREVO_PASS
        }
    });
    const mailOptions = {
        from: from,
        to: process.env.EMAIL_ADDRESS,
        subject: "Media Quizlet Contact Form Response",
        html:`
        <h1>Contact Form Response from Media Quizlet</h1>
        <p><strong>From: </strong>${firstName} ${lastName}</p>
        <p><strong>Email: </strong>${from}</p>
        <p><small>Received: ${new Date(timestamp).toLocaleString}</small></p>
        <br></br>
        <p>${text}</p>`
    }
    const info = await transporter.sendMail(mailOptions).catch(err => console.log);
    console.log(info.messageId)
}