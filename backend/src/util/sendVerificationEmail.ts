import nodemailer from "nodemailer"


export const sendVerificationEmail = async (email: string, link: string) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    })

    await transporter.sendMail({
        from: "Test <no-reply@myapp.com>",
        to: email,
        subject: "Verify your email",
        html: `
        <h2>Email Verification</h2>
        <p>Click the link below to verify your email:</p>
        <a href="${link}">${link}</a>
    `,
    })
}