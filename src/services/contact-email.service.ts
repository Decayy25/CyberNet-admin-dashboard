import nodemailer from "nodemailer";
import { isValidPackage, TypeContactForm } from "@/types/package";
import { USER_EMAIL, USER_PASS } from "@/utils/environment";
import ClientController from "@/controllers/admin-client.controller";
import MembershipController from "@/controllers/admin-membership.controller";
import { getClientMember } from "@/utils/database";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: USER_EMAIL,
    pass: USER_PASS,
  },
});

export const escapeHtml = (text: string = ""): string => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  return /^(\+62|0)[0-9]{9,12}$/.test(phone.replace(/\s/g, ""));
};

const sendEmail = async (body: TypeContactForm) => {
  const { fullName, phoneNumber, email, address, packageId } = body;

  if (!fullName || !phoneNumber || !email || !address || !packageId) {
    throw new Error("Semuanya wajib di isi!");
  }

  if (!isValidEmail(email)) {
    throw new Error("Format email salah! Gunakan format: nama@domain.com");
  }

  if (!isValidPhoneNumber(phoneNumber)) {
    throw new Error(
      "Nomor telepon tidak valid! Gunakan format: 08xx atau +62xx",
    );
  }

  if (!isValidPackage(packageId)) {
    throw new Error("Paket yang dipilih tidak valid!");
  }

  // Validasi duplikasi data di database
  try {
    const clientMember = await getClientMember();
    const existingClient = await clientMember.findOne({
      $or: [
        { fullName: { $regex: fullName, $options: "i" } },
        { phoneNumber: phoneNumber.replace(/\s/g, "") },
        { email: { $regex: email, $options: "i" } },
      ],
    });

    if (existingClient) {
      let duplicateField = "";

      if (existingClient.fullName?.toLowerCase() === fullName.toLowerCase()) {
        duplicateField = "Nama pelanggan";
      } else if (
        existingClient.phoneNumber === phoneNumber.replace(/\s/g, "")
      ) {
        duplicateField = "Nomor telepon";
      } else if (existingClient.email?.toLowerCase() === email.toLowerCase()) {
        duplicateField = "Email";
      }

      throw new Error(
        `Data dengan ${duplicateField} "${fullName}" sudah terdaftar di database! Gunakan data seperti Email, atau nomor handphone yang berbeda.`,
      );
    }
  } catch (dbError) {
    if (
      dbError instanceof Error &&
      dbError.message.includes("sudah terdaftar")
    ) {
      throw dbError;
    }
    console.error("Database check error:", dbError);
    throw new Error("Gagal memeriksa data di database, coba lagi nanti");
  }

  const escape = {
    fullName: escapeHtml(fullName),
    phoneNumber: escapeHtml(phoneNumber),
    email: escapeHtml(email),
    address: escapeHtml(address),
    packageId: escapeHtml(packageId),
  };

  try {
    const response = await MembershipController.getMembership();
    const allPackages = response?.data || [];
    const cleanPaketName = packageId.replace(/^PAKET\s+/i, "").trim();
    const packageDetails = allPackages.find(
      (item: any) => item.paket.toLowerCase() === cleanPaketName.toLowerCase(),
    );

    if (!packageDetails) {
      throw new Error(`Paket "${packageId}" tidak ditemukan di database!`);
    }

    const currentPackagePrice = packageDetails.price || 0;

    const infoClient = await transporter.sendMail({
      from: `"${escape.fullName}" <${USER_EMAIL}>`,
      replyTo: email,
      to: USER_EMAIL,
      subject: `Pendaftaran ${escape.packageId} dari ${escape.fullName}`,
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0f172b; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0;">📋 Pendaftaran Paket Internet Baru</h2>
        </div>

        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #0f172b; margin-top: 0;">👤 Data Pelanggan</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px 0; font-weight: bold; color: #0f172b; width: 30%;">Nama:</td>
              <td style="padding: 10px 0;">${escape.fullName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px 0; font-weight: bold; color: #0f172b;">Email:</td>
              <td style="padding: 10px 0;">${escape.email}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px 0; font-weight: bold; color: #0f172b;">Telepon:</td>
              <td style="padding: 10px 0;">${escape.phoneNumber}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px 0; font-weight: bold; color: #0f172b;">Alamat:</td>
              <td style="padding: 10px 0;">${escape.address}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #e8f4f8; padding: 20px; border-radius: 8px; border-left: 4px solid #0f172b; margin-bottom: 20px;">
          <h3 style="color: #0f172b; margin-top: 0;">📦 Paket yang Dipilih</h3>
          <p style="margin: 0 0 10px 0;"><strong>${escape.packageId}</strong></p>
          <p style="margin: 0; color: #666;">Harga: Rp ${currentPackagePrice.toLocaleString("id-ID")}/bulan</p>
        </div>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <small style="color: #999;">
          Email ini dikirim otomatis dari website CyberNet pada ${new Date().toLocaleString("id-ID")}
        </small>
      </div>
    `,
    });

    await transporter.sendMail({
      from: `CyberNet <${USER_EMAIL}>`,
      to: email,
      subject: `Pendaftaran ${escape.packageId} Diterima - CyberNet`,
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <h2>Terima kasih telah mendaftar! 🎉</h2>
        <p>Halo ${escape.fullName},</p>
        <p>Kami telah menerima pendaftaran Anda untuk paket <strong>${escape.packageId}</strong>.</p>
        <p>Tim kami akan menghubungi Anda segera di nomor <strong>${escape.phoneNumber}</strong> untuk mengkonfirmasi dan mengatur instalasi.</p>
        <p>Jika ada pertanyaan, silakan hubungi kami di nomor admin kami.</p>
        <br>
        <p>Salam,<br><strong>CyberNet Team</strong></p>
      </div>
    `,
    });

    await ClientController.addClient(body);

    return {
      success: true,
      result: infoClient,
      message: "Pendaftaran berhasil! Tim kami akan menghubungi Anda segera.",
    };
  } catch (error) {
    console.error("Email error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Gagal mengirim email, coba lagi nanti",
    };
  }
};

export default sendEmail;