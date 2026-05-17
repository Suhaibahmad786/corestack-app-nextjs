import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Mailtrap transporter
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: Number(process.env.MAILTRAP_PORT),
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"CoreStack Contact" <no-reply@corestack.dev>`,
      to: process.env.MAILTRAP_TO,
      subject: `New Message: ${subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:32px;border-radius:12px;">
          <div style="background:#6366f1;padding:24px;border-radius:8px;margin-bottom:24px;">
            <h1 style="color:#fff;margin:0;font-size:24px;">New Contact Message</h1>
            <p style="color:#e0e0ff;margin:4px 0 0 0;font-size:14px;">CoreStack Contact Form</p>
          </div>
          <div style="background:#fff;padding:24px;border-radius:8px;border:1px solid #e5e7eb;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;width:120px;">
                  <strong style="color:#374151;font-size:13px;">Name</strong>
                </td>
                <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:14px;">${name}</td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
                  <strong style="color:#374151;font-size:13px;">Email</strong>
                </td>
                <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:14px;">${email}</td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
                  <strong style="color:#374151;font-size:13px;">Subject</strong>
                </td>
                <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:14px;">${subject}</td>
              </tr>
              <tr>
                <td style="padding:12px 0;vertical-align:top;">
                  <strong style="color:#374151;font-size:13px;">Message</strong>
                </td>
                <td style="padding:12px 0;color:#6b7280;font-size:14px;line-height:1.6;">${message}</td>
              </tr>
            </table>
          </div>
          <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:24px;">
            Sent from CoreStack Contact Form
          </p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Email sent successfully!" });

  } catch (err) {
    console.log("❌ Mailtrap Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}