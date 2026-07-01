import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { LocationArea } from "@/types/UI";
import locationService from "@/services/location.service";
import { useRouter } from "next/router";

const useLocation = () => {
  const router = useRouter();
  const currentSearch =
    typeof router.query.search === "string" ? router.query.search : "";
  const [locations, setLocations] = useState<LocationArea[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // State UI (Modal & Form)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [areaInput, setAreaInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>(currentSearch);
  const [statusInput, setStatusInput] = useState<string>("tersedia");
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchLocations = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = currentSearch
        ? `search=${encodeURIComponent(currentSearch)}`
        : "";

      const res = await locationService.getLocation(params);
      if (res?.data?.data && Array.isArray(res.data.data)) {
        setLocations(res.data.data);
      } else {
        setLocations([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data lokasi:", error);
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentSearch]);

  const handleSearch = useCallback(
    (query: string) => {
      const normalized = query.trim();
      setSearchQuery(normalized);

      void router.replace(
        {
          pathname: router.pathname,
          query: normalized ? { search: normalized } : {},
        },
        undefined,
        {
          shallow: true,
        },
      );
    },
    [router],
  );

  const isMounted = useRef(true);

  useEffect(() => {
    (async () => {
      if (searchQuery !== currentSearch) {
        setSearchQuery(currentSearch);
      }
    })();
  }, [currentSearch, searchQuery]);

  useEffect(() => {
    const initFetch = async () => {
      if (isMounted.current) {
        await fetchLocations();
      }
    };

    initFetch();

    const timer = window.setTimeout(() => {
      void fetchLocations();
    }, 0);

    return () => {
      isMounted.current = false;
      window.clearTimeout(timer);
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
        await locationService.updateLocation( _id, cleanPayload)
      } else {
        await axios.post("/api/location", rawPayload);
      }

      closeModal();
      await fetchLocations();
    } catch (error: any) {
      alert(error?.res?.data?.message || "Terjadi kesalahan pada sistem.");
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
      alert(error?.res?.data?.message || "Gagal menghapus data.");
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
  };
};

export default useLocation;