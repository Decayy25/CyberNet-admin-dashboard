import { Fragment, useEffect } from "react";
import MembershipTable from "@/components/MembershipTable";
import PageHead from "@/components/PageHead";
import useMembership from "@/hooks/useMembership";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function MembershipDashboard(): React.JSX.Element {
  const {
    membership,
    isLoading,
    isModalOpen,
    isEditMode,
    formData,
    fetchMembership,
    handleInputChange,
    handleSaveMembership,
    handleDeleteMembership,
    openAddModal,
    openEditModal,
    closeModal,
  } = useMembership();


  useEffect(() => {
    fetchMembership();
  }, []);


  const handleDeleteWithConfirm = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus paket ini?")) {
      handleDeleteMembership(id)
        .then(() => {
          alert("Paket berhasil dihapus!");
          fetchMembership();
        })
        .catch((error) => {
          alert(
            "Gagal menghapus paket: " + (error?.message || "Unknown error"),
          );
        });
    }
  };


  const handleSaveWithRefresh = async () => {
    try {
      await handleSaveMembership();
      alert(
        isEditMode
          ? "Paket berhasil diperbarui!"
          : "Paket berhasil ditambahkan!",
      );
      closeModal();
      await fetchMembership();
    } catch (error) {
      alert("Gagal menyimpan paket: " + (error?.message || "Unknown error"));
    }
  };

  return (
    <Fragment>
      <PageHead title="Membership Plans | CyberNet" />
      <Header />
      <div className="flex min-h-full bg-[#0B0F19] text-white">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Manajemen Paket Membership
                </h1>
                <p className="text-sm text-gray-400">
                  Kelola paket internet dan harga layanan Anda
                </p>
              </div>
              <button
                onClick={openAddModal}
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/10"
              >
                + Tambah Paket
              </button>
            </div>

            <MembershipTable
              membership={membership}
              isLoading={isLoading}
              onEdit={openEditModal}
              onDelete={handleDeleteWithConfirm}
            />


            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="w-full max-w-md bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4 shadow-2xl animate-fadeIn">
                  <h3 className="text-lg font-bold">
                    {isEditMode
                      ? "📦 Edit Paket Membership"
                      : "➕ Tambah Paket Baru"}
                  </h3>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveWithRefresh();
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">
                        Nama Paket
                      </label>
                      <input
                        type="text"
                        value={formData.paket}
                        onChange={(e) =>
                          handleInputChange("paket", e.target.value)
                        }
                        placeholder="Contoh: Paket Pro 50Mbps"
                        className="w-full bg-[#1F2937]/60 border border-gray-800 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">
                        Harga (IDR)
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          handleInputChange(
                            "price",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        placeholder="Contoh: 250000"
                        className="w-full bg-[#1F2937]/60 border border-gray-800 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">
                        Periode
                      </label>
                      <select
                        value={formData.period}
                        onChange={(e) =>
                          handleInputChange("period", e.target.value)
                        }
                        className="w-full bg-[#1F2937]/60 border border-gray-800 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white transition-colors"
                      >
                        <option value="bulan">Per Bulan</option>
                        <option value="tahun">Per Tahun</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">
                        Fitur (pisahkan dengan koma)
                      </label>
                      <textarea
                        value={
                          Array.isArray(formData.features)
                            ? formData.features.join(", ")
                            : ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "features",
                            e.target.value
                              .split(",")
                              .map((f) => f.trim())
                              .filter((f) => f),
                          )
                        }
                        placeholder="Contoh: 50Mbps, Unlimited Data, Free Router"
                        className="w-full bg-[#1F2937]/60 border border-gray-800 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white transition-colors h-24 resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-3 bg-blue-500/5 border border-blue-500/20 px-3 py-2.5 rounded-xl">
                      <input
                        type="checkbox"
                        id="isPopular"
                        checked={formData.isPopular || false}
                        onChange={(e) =>
                          handleInputChange("isPopular", e.target.checked)
                        }
                        className="w-4 h-4 rounded border-gray-600 cursor-pointer accent-blue-500"
                      />
                      <label
                        htmlFor="isPopular"
                        className="text-sm text-gray-300 cursor-pointer flex-1"
                      >
                        ⭐ Tandai sebagai paket populer
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm text-gray-400 transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 rounded-xl text-sm font-medium transition-colors"
                      >
                        {isLoading
                          ? "Menyimpan..."
                          : isEditMode
                            ? "Simpan Perubahan"
                            : "Tambah Paket"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </Fragment>
  );
}
