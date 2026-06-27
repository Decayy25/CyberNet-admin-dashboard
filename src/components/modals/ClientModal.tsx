import { Client } from "@/types";
import { X } from "lucide-react";
import { PACKAGE_OPTIONS } from "@/types/package";

interface ClientModalProps {
  isOpen: boolean;
  isEditMode: string;
  formData: Client;
  isLoading: boolean;
  onInputChange: (field: string, value: string) => void;
  onSave: () => Promise<void>;
  onClose: () => void;
}

export default function ClientModal({
  isOpen,
  isEditMode,
  formData,
  isLoading,
  onInputChange,
  onSave,
  onClose,
}: ClientModalProps): React.JSX.Element {
  if (!isOpen) return <></>;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#111827] border border-gray-800 rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">
            {isEditMode ? "Edit Client" : "Tambah Client Baru"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-400 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nama Lengkap *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => onInputChange("fullName", e.target.value)}
              placeholder="Masukkan nama lengkap"
              disabled={isLoading}
              className="w-full bg-[#1F2937]/60 border border-gray-800 px-4 py-3 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange("email", e.target.value)}
              placeholder="nama@domain.com"
              disabled={isLoading}
              className="w-full bg-[#1F2937]/60 border border-gray-800 px-4 py-3 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nomor Telepon *
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => onInputChange("phoneNumber", e.target.value)}
              placeholder="08xx atau +62xx"
              disabled={isLoading}
              className="w-full bg-[#1F2937]/60 border border-gray-800 px-4 py-3 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Alamat *
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => onInputChange("address", e.target.value)}
              placeholder="Jalan, Kelurahan, Kecamatan"
              rows={3}
              disabled={isLoading}
              className="w-full bg-[#1F2937]/60 border border-gray-800 px-4 py-3 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Paket Internet *
            </label>
            <select
              value={formData.packageId}
              onChange={(e) => onInputChange("packageId", e.target.value)}
              disabled={isLoading}
              className="w-full bg-[#1F2937]/60 border border-gray-800 px-4 py-3 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <option value="">-- Pilih Paket --</option>
              {PACKAGE_OPTIONS.map((pkg) => (
                <option key={pkg} value={pkg}>
                  {pkg}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700/50 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⌛</span>
                {isEditMode ? "Memperbarui..." : "Menambahkan..."}
              </>
            ) : (
              <>{isEditMode ? "Perbarui Client" : "Tambah Client"}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
