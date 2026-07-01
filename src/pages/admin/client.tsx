import { Fragment } from "react";
import PageHead from "@/components/common/PageHead";
import Refresh from "@/components/ui/refresh";
import ClientTable from "@/components/views/ClientTable";
import ClientModal from "@/components/modals/ClientModal";
import useClient from "@/hooks/useClient";
import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import SearchBar from "@/components/ui/SearchBar";

const ClientPage = (): React.JSX.Element => {
  const {
    client,
    isLoading,
    isModalOpen,
    isEditMode,
    formData,
    searchQuery,
    handleSearch,
    handleInputChange,
    handleSaveClient,
    handleDeleteClient,
    handleRefreshClient,
    openAddModal,
    openEditModal,
    closeModal,
  } = useClient();

  return (
    <Fragment>
      <PageHead title="Manajemen Client | CyberNet" />
      <Header />
      <div className="flex min-h-screen bg-[#0B0F19] text-white">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto pl-70 pt-20">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Manajemen <span className="text-blue-400">Client</span>
                </h1>
                <p className="text-gray-400 mt-2">
                  Kelola data pelanggan dan langganan mereka
                </p>

                <div className="mt-5">
                  <SearchBar
                    value={searchQuery}
                    onSearch={handleSearch}
                    isLoading={isLoading}
                    placeholder="Cari client..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-20">
                <Refresh onClick={handleRefreshClient} />
                <button
                  onClick={openAddModal}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/10"
                >
                  + Tambah Client Baru
                </button>
              </div>
            </div>

            {/* CLIENT TABLE */}
            <ClientTable
              client={client}
              isLoading={isLoading}
              onEdit={openEditModal}
              onDelete={handleDeleteClient}
            />

            {/*  CLIENT MODAL */}
            {isModalOpen && (
              <ClientModal
                isOpen={isModalOpen}
                isEditMode={isEditMode}
                formData={formData}
                isLoading={isLoading}
                onInputChange={handleInputChange}
                onSave={handleSaveClient}
                onClose={closeModal}
              />
            )}
          </div>
        </main>
      </div>
    </Fragment>
  );
}

export default ClientPage;