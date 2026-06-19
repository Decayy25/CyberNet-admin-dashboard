import { transporter, escapeHtml, isValidEmail  } from "@/services/email.service";
import type { TypeEmail } from "@/types"

const sendContactMail = async (body: TypeEmail) => {
  const { name, email, message } = body;

  if (!name || !email || !message) {
    throw new Error("Semua field wajib diisi");
  }

  if (!isValidEmail(email)) {
    throw new Error("Format email tidak valid");
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  try {
    const info = await transporter.sendMail({
      from: `"${safeName}" <${process.env.EMAIL_USER}>`,
      replyTo: safeEmail,
      to: process.env.EMAIL_USER,
      subject: "Pesan Baru dari CyberNet",
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h3>Pesan Baru dari CyberNet</h3>
          <p><b>Nama:</b> ${safeName}</p>
          <p><b>Email Pengunjung:</b> ${safeEmail}</p>
          <p><b>Pesan:</b></p>
          <p>${safeMessage}</p>
          <hr>
      </div>
    `,
    });

    console.log("Email berhasil dikirim:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Gagal mengirim email:", error);
    throw new Error("Gagal mengirim email");
  }
};

export default sendContactMail;