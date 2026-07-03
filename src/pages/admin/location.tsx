import { Fragment } from "react";
import { LocationStatus } from "@/types/location";
import {
  LOCATION_STATUS_VALUES,
  LOCATION_STATUS_LABELS,
} from "@/constant/location.constant";
import LocationTable from "@/components/views/LocationTable";
import PageHead from "@/components/common/PageHead";
import useLocation from "@/hooks/useLocation";
import Refresh from "@/components/ui/refresh";
import AdminHeader from "@/components/common/Admin/AdminHeader";
import AdminSidebar from "@/components/common/Admin/AdminSidebar";
import SearchBar from "@/components/ui/SearchBar";

const LocationDashboard = (): React.JSX.Element => {
  const {
    locations,
    isLoading,
    isModalOpen,
    isEditMode,
    areaInput,
    statusInput,
    searchQuery,
    setAreaInput,
    setStatusInput,
    openAddModal,
    openEditModal,
    closeModal,
    handleSearch,
    handleDataChange,
    handleSaveLocation,
    handleDeleteLocation,
  } = useLocation();

  return (
    <Fragment>
      <PageHead title="Management Location | CyberNet" />
      <AdminHeader />
      <div className="flex min-h-screen bg-[#0B0F19] text-white">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-y-auto pl-70 pt-20">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Manajemen <span className="text-blue-400">Wilayah</span>
                </h1>
                <p className="text-sm text-gray-400">
                  Kelola area jangkauan jaringan internet Wifi hotspot Anda
                </p>
                <div className="mt-5">
                  <SearchBar
                    value={searchQuery}
                    onSearch={handleSearch}
                    isLoading={isLoading}
                    placeholder="Cari wilayah..."
                  />
                </div>

              </div>
              <div className="flex justify-between gap-2 pt-20">
                <Refresh onClick={handleDataChange} />
                <button
                  onClick={openAddModal}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/10"
                >
                  + Tambah Wilayah
                </button>
              </div>
            </div>

            <LocationTable
              location={locations}
              isLoading={isLoading}
              onEdit={openEditModal}
              onDelete={handleDeleteLocation}
            />

            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="w-full max-w-md bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4 shadow-2xl animate-fadeIn">
                  <h3 className="text-lg font-bold">
                    {isEditMode ? "📦 Edit Wilayah" : "➕ Tambah Wilayah Baru"}
                  </h3>

                  <form onSubmit={handleSaveLocation} className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">
                        Nama Area / Kampung
                      </label>
                      <input
                        type="text"
                        value={areaInput}
                        onChange={(e) => setAreaInput(e.target.value)}
                        placeholder="Contoh: Malingping"
                        className="w-full bg-[#1F2937]/60 border border-gray-800 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">
                        Status Jaringan
                      </label>
                      <select
                        value={statusInput}
                        onChange={(e) =>
                          setStatusInput(e.target.value as LocationStatus)
                        }
                        className="w-full bg-[#1F2937]/60 border border-gray-800 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white transition-colors"
                      >
                        {LOCATION_STATUS_VALUES.map((status) => (
                          <option key={status} value={status}>
                            {LOCATION_STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
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
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-medium transition-colors"
                      >
                        {isEditMode ? "Simpan Perubahan" : "Tambah Area"}
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

export default LocationDashboard;