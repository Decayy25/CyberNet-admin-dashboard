import React, { useState } from "react";
import useMembership from "@/hooks/useMembership";
import axios from "axios";
import { Send } from "lucide-react";

interface FormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  packageId: string
}

const RegistrationClientForm = (): React.JSX.Element => {
  const { membership } = useMembership();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    packageId: ""
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.fullName.trim()) {
        setError("Nama lengkap harus diisi");
        setLoading(false);
        return;
      }

      if (!formData.phoneNumber.trim()) {
        setError("Nomor WhatsApp harus diisi");
        setLoading(false);
        return;
      }

      if (!formData.email.trim()) {
        setError("Email harus diisi");
        setLoading(false);
        return;
      }

      if (!formData.address.trim()) {
        setError("Alamat pemasangan harus diisi");
        setLoading(false);
        return;
      }

      const response = await axios.post("/api/contact", {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        address: formData.address,
        packageId: formData.packageId,
      });

      if (response.data.success) {
        setSubmitted(true);
        setFormData({
          fullName: "",
          phoneNumber: "",
          email: "",
          address: "",
          packageId: "",
        });

        // Reset after 3 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      } else {
        setError(response.data.message || "Gagal mengirim pendaftaran");
      }
    } catch (error: any) {
      setError(
        error?.response?.data?.message || "Terjadi kesalahan, coba lagi",
      );
      console.error("Form error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="daftar" className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center">
          Pendaftaran Pelanggan Baru
        </h2>
        <p className="text-center text-gray-500 mt-2">
          Sebelum isi form, harap cek coverage/area anda barang kali tidak
          terjangakau layanan kami.
        </p>
        <p className="text-center text-gray-500 mb-8">
          Isi form di bawah untuk mendaftar layanan internet kami.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                No WhatsApp
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="08xx atau +62xx"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Paket
              </label>
              <select
                name="packageId"
                value={formData.packageId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 cursor-pointer bg-white"
              >
                <option value="">Pilih Paket</option>
                {membership.map((item) => (
                  <option 
                    key={item._id} 
                    value={item.paket}>
                      {`PAKET ${item.paket}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="nama@domain.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alamat Pemasangan
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Jalan, Kelurahan, Kecamatan"
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {submitted && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              ✅ Pendaftaran berhasil! Tim kami akan menghubungi Anda segera.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg"
          >
            <Send size={20} />
            {loading ? "Mengirim..." : "Kirim Pendaftaran"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Kami akan menghubungi Anda melalui WhatsApp atau Email untuk
          mengkonfirmasi pendaftaran
        </p>
      </div>
    </section>
  );
}

export default RegistrationClientForm;