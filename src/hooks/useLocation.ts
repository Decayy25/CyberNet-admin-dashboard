import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { LocationArea } from "@/types/UI";

const useLocation = () => {
  const [locations, setLocations] = useState<LocationArea[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // State UI (Modal & Form)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [areaInput, setAreaInput] = useState<string>("");
  const [statusInput, setStatusInput] = useState<string>("tersedia");
  const [refreshKey, setRefreshKey] = useState(0);


  const fetchLocations = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/location");
      if (response.data?.data && Array.isArray(response.data.data)) {
        setLocations(response.data.data);
      } else {
        setLocations([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data lokasi:", error);
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isMounted = useRef(true);

  useEffect(() => {
    const initFetch = async () => {
      if (isMounted.current) {
        await fetchLocations();
      }
    };

    initFetch();

    return () => {
      isMounted.current = false;
    };
  }, [fetchLocations, refreshKey]);

  const handleDataChange = () => setRefreshKey((prev) => prev + 1);

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();

    const rawPayload: LocationArea = {
      _id: isEditMode ? selectedId : "",
      area: areaInput,
      status: statusInput,
    };

    try {
      if (isEditMode) {
        const { _id, ...cleanPayload } = rawPayload;
        await axios.put(`/api/location/${_id}`, cleanPayload);
      } else {
        await axios.post("/api/location", rawPayload);
      }

      closeModal();
      await fetchLocations();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Terjadi kesalahan pada sistem.");
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus wilayah ini?")) return;
    try {
      await axios.delete(`/api/location/${id}`);
      alert("Wilayah berhasil dihapus!");
      await fetchLocations();
    } catch (error: any) {
      console.error("Gagal menghapus lokasi:", error);
      alert(error?.response?.data?.message || "Gagal menghapus data.");
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedId("");
    setAreaInput("");
    setStatusInput("tersedia");
    setIsModalOpen(true);
  };

  const openEditModal = (loc: LocationArea) => {
    setIsEditMode(true);
    setSelectedId(loc._id || "");
    setAreaInput(loc.area);
    setStatusInput(loc.status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedId("");
    setAreaInput("");
  };

  return {
    locations,
    isLoading,
    isModalOpen,
    isEditMode,
    areaInput,
    statusInput,
    setAreaInput,
    setStatusInput,
    openAddModal,
    openEditModal,
    closeModal,
    handleDataChange,
    handleSaveLocation,
    handleDeleteLocation,
  };
};

export default useLocation;
