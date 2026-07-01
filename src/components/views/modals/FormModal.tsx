import React, { type FormEvent, useState } from "react";

interface FormModalProps {
  type: "membership" | "location";
  onClose: () => void;
}

const FormModal = ({
  type,
  onClose,
}: FormModalProps): React.JSX.Element => {
  const [featureInput, setFeatureInput] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (type === "membership") {
      const payload = {
        paket: formData.get("paket"),
        price: Number(formData.get("price")),
        period: formData.get("period"),
        features: featureInput
          .split(",")
          .map((f) => f.trim())
          .map((f) => (f.startsWith("✓") ? f : `✓ ${f}`)),
        isPopular: formData.get("isPopular") === "true",
      };
      console.log("Payload Paket:", payload);
      // Di sini fungsi kirim data ke API (POST/PUT)



    } else {
      const payload = {
        area: formData.get("area"),
        status: formData.get("status"),
      };
      console.log("Payload Lokasi:", payload);
      // Di sini fungsi kirim data ke API (POST/PUT)
      


    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111827] border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white capitalize">
            Tambah {type === "membership" ? "Paket Internet" : "Wilayah Baru"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {type === "membership" ? (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                  Nama Paket / Kecepatan
                </label>
                <input
                  name="paket"
                  type="text"
                  className="w-full bg-[#1F2937] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                  placeholder="ex: 10 Mbps"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                    Harga (IDR)
                  </label>
                  <input
                    name="price"
                    type="number"
                    className="w-full bg-[#1F2937] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                    placeholder="170052"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                    Periode Berlangganan
                  </label>
                  <input
                    name="period"
                    type="text"
                    className="w-full bg-[#1F2937] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                    defaultValue="bulan"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                  Fitur Layanan (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  className="w-full bg-[#1F2937] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                  placeholder="Unlimited, Fiber Optik, Support Teknis"
                  required
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input
                  id="isPopular"
                  name="isPopular"
                  type="checkbox"
                  value="true"
                  className="w-4 h-4 bg-[#1F2937] border-gray-800 rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
                />
                <label
                  htmlFor="isPopular"
                  className="text-sm text-gray-300 select-none"
                >
                  Set sebagai paket terpopuler (Popular Plan)
                </label>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                  Nama Wilayah / Kampung
                </label>
                <input
                  name="area"
                  type="text"
                  className="w-full bg-[#1F2937] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                  placeholder="ex: Kp.Dampit"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                  Status Jaringan
                </label>
                <select
                  name="status"
                  className="w-full bg-[#1F2937] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="tersedia">Tersedia</option>
                  <option value="tidak tersedia">Tidak Tersedia</option>
                </select>
              </div>
            </>
          )}

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 text-gray-400 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-500 transition-all"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormModal;