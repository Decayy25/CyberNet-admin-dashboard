import clientService from "@/services/client.service";
import { Client } from "@/types";
import { UseClientReturn } from "@/types/UI";
import { useCallback, useEffect, useState } from "react";

const useClient = (): UseClientReturn => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [client, setClient] = useState<Client[]>([]);

  // Initial form data
  const initialFormData = {
    _id: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    packageId: "",
    address: "",
    createdAt: "",
  };

  const [formData, setFormData] = useState<Client>(initialFormData);

  // Fetch clients
  const fetchClient = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await clientService.getClient();
      if (res?.data.data && Array.isArray(res.data.data)) {
        setClient(res.data.data);
      } else {
        setClient([]);
      }
    } catch (error) {
      console.error("Error fetching client:", error);
      setClient([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount & when refreshKey changes
  useEffect(() => {
    (async () => {
      await fetchClient();
    })();
  }, [fetchClient, refreshKey]);

  // Handle input change
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: Client) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save client (create or update)
  const handleSaveClient = async () => {
    try {
      // Validation
      if (!formData.fullName.trim()) {
        alert("Nama lengkap harus diisi!");
        return;
      }
      if (!formData.email.trim()) {
        alert("Email harus diisi!");
        return;
      }
      if (!formData.phoneNumber.trim()) {
        alert("Nomor telepon harus diisi!");
        return;
      }
      if (!formData.address.trim()) {
        alert("Alamat harus diisi!");
        return;
      }
      if (!formData.packageId.trim()) {
        alert("Pilih paket terlebih dahulu!");
        return;
      }

      setIsLoading(true);

      if (isEditMode) {
        await clientService.updateClient(formData, isEditMode);
        alert("Client berhasil diperbarui!");
      } else {
        await clientService.addClient(formData);
        alert("Client berhasil ditambahkan!");
      }

      // Refresh data
      await fetchClient();
      closeModal();
    } catch (error) {
      console.error("Error saving client:", error);
      alert("Gagal menyimpan client!");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete client
  const handleDeleteClient = async (id: string): Promise<void> => {
    try {
      if (!id) {
        return;
      }

      const confirmed = window.confirm(
        "Apakah Anda yakin ingin menghapus client ini?",
      );

      if (!confirmed) return;
      setIsLoading(true);

      await clientService.removeClient(id);
      await fetchClient();

      alert("Client berhasil dihapus!");
    } catch (error) {
      console.error(" Error deleting client:", error);
      alert("Gagal menghapus client!");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIsEditMode("");
    setFormData(initialFormData);
  };

  const openAddModal = () => {
    setIsEditMode("");
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (clientData: Client) => {
    setIsEditMode(clientData._id || "");
    setFormData(clientData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleRefreshClient = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return {
    client,
    isLoading,
    isModalOpen,
    isEditMode,
    formData,
    handleInputChange,
    handleSaveClient,
    handleDeleteClient,
    handleRefreshClient,
    openAddModal,
    openEditModal,
    closeModal,
  };
};

export default useClient;
