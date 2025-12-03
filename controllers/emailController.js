// controllers/emailController.js
import { createTransport } from "nodemailer";

export const sendEmail = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const transporter = createTransport({
      service: "gmail",
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      replyTo: email,
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject,
      replyTo: email,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
          <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <div style="background: #0d47a1; padding: 15px; color: #fff; text-align: center;">
              <h2 style="margin: 0;">New Contact Request</h2>
            </div>
            <div style="padding: 20px; color: #333;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <p style="background: #f9f9f9; padding: 10px; border-left: 4px solid #0d47a1;">${message}</p>
            </div>
            <div style="background: #eee; padding: 10px; text-align: center; font-size: 12px; color: #666;">
              This message was sent from your website contact form.
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Email not sent." });
  }
};
