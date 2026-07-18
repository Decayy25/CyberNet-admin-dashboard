import { useRouter } from "next/router";
import { MembershipPlan } from "@/types/UI";
import { useCallback, useEffect, useState } from "react";
import membershipService from "@/services/membership.service";
import { typeMembership } from "@/types";

interface MembershipFormData extends typeMembership {
  isPopular: boolean;
}

const useMembership = () => {
  const router = useRouter();
  const currentSearch =
    typeof router.query.search === "string" ? router.query.search : "";

  const [membership, setMembership] = useState<MembershipPlan[]>([]);
  const [featuresText, setFeaturesText] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>(currentSearch);
  const [formData, setFormData] = useState<MembershipFormData>({
    paket: "",
    price: 0,
    period: "bulan",
    features: [],
    isPopular: false,
  });

  const fetchMembership = useCallback(async () => {
    try {
      setIsLoading(true);

      const params = currentSearch
        ? `search=${encodeURIComponent(currentSearch)}`
        : "";
      const res = await membershipService.getMembership(params);

      if (res?.data?.data && Array.isArray(res.data.data)) {
        setMembership(res.data.data);
      } else {
        setMembership([]);
      }
    } catch (error) {
      console.error("Error fetching membership:", error);
      setMembership([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentSearch]);

  useEffect(() => {
    (async () => {
      if (searchQuery !== currentSearch) {
        setSearchQuery(currentSearch);
      }
    })();
  }, [currentSearch, searchQuery]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchMembership();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchMembership, refreshKey]);

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
        { shallow: true },
      );
    },
    [router],
  );

  const handleDataChange = () => setRefreshKey((prev) => prev + 1);

  const handleInputChange = (
    field: keyof MembershipFormData,
    value: string | number | boolean | string[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveMembership = async () => {
    try {
      setIsLoading(true);
      const payload = {
        ...formData,
        features: featuresText
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
      };

      if (isEditMode) {
        await membershipService.updateMembership(payload, isEditMode);
      } else {
        await membershipService.addMembership(payload);
      }
      await fetchMembership();
      resetForm();
      return { success: true };
    } catch (error) {
      console.error("Error saving membership:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMembership = async (id: string) => {
    try {
      setIsLoading(true);
      await membershipService.deleteMembership(id);
      await fetchMembership();
      return { success: true };
    } catch (error) {
      console.error("Error deleting membership:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

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
      closeModal();
      await fetchMembership();
    } catch (error) {
      alert("Gagal menyimpan paket: " + (error || "Unknown error"));
    }
  };

  const openAddModal = () => {
    setIsEditMode("");
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (plan: MembershipPlan) => {
    setIsEditMode(plan._id);
    setFormData({
      paket: plan.paket,
      price: plan.price,
      period: plan.period === "tahun" ? "tahun" : "bulan",
      features: plan.features || [],
      isPopular: plan.isPopular || false,
    });
    setFeaturesText(plan.features?.join(", ") || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setIsEditMode("");
    setFormData({
      paket: "",
      price: 0,
      period: "bulan",
      features: [],
      isPopular: false,
    });

    setFeaturesText("");
  };

  return {
    membership,
    isLoading,
    isEditMode,
    isModalOpen,
    formData,
    searchQuery,
    featuresText,
    setFeaturesText,
    fetchMembership,
    handleSearch,
    handleSaveMembership,
    handleSaveWithRefresh,
    handleDataChange,
    handleInputChange,
    handleDeleteWithConfirm,
    handleDeleteMembership,
    openAddModal,
    openEditModal,
    closeModal,
  };
};

export default useMembership;
