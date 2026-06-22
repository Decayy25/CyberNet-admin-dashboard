import { MembershipPlan } from "@/types/UI";
import { useCallback, useState, useEffect } from "react";
import membershipService from "@/services/membership.service";

const useMembership = () => {
  const [membership, setMembership] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formData, setFormData] = useState<any>({
    paket: "",
    price: 0,
    period: "bulan",
    features: [],
    isPopular: false,
  });


  const fetchMembership = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await membershipService.getMembership();
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
  }, []);


  useEffect(() => {
    (async () => {
      await fetchMembership();
    })();
  }, [fetchMembership, refreshKey]);


  const handleDataChange = () => setRefreshKey((prev) => prev + 1);


  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };


  const handleSaveMembership = async () => {
    try {
      setIsLoading(true);
      if (isEditMode) {
        // Update membership
        await membershipService.updateMembership(isEditMode, formData);
      } else {
        // Create new membership
        await membershipService.addMembership(formData);
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

  // Handle delete
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

  // Open modal for create
  const openAddModal = () => {
    setIsEditMode("");
    resetForm();
    setIsModalOpen(true);
  };

  // Open modal for edit
  const openEditModal = (plan: MembershipPlan) => {
    setIsEditMode(plan._id);
    setFormData({
      paket: plan.paket,
      price: plan.price,
      period: plan.period,
      features: plan.features || [],
      isPopular: plan.isPopular || false,
    });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setIsEditMode("");
    setFormData({
      paket: "",
      price: 0,
      period: "bulan",
      features: [],
      isPopular: false,
    });
  };

  return {
    membership,
    isLoading,
    isEditMode,
    isModalOpen,
    formData,
    fetchMembership,
    handleDataChange,
    handleInputChange,
    handleSaveMembership,
    handleDeleteMembership,
    openAddModal,
    openEditModal,
    closeModal,
  };
};

export default useMembership;