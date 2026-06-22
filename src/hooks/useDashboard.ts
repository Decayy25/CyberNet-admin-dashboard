import { useState, useEffect } from "react";
import { MembershipPlan, typeLocation, DashboardMetrics, UseDashboardReturn } from "@/types/UI";
import { Client } from "@/types";
import membershipService from "@/services/membership.service";
import locationService from "@/services/location.service";
import clientService from "@/services/client.service";


export const useDashboard = (): UseDashboardReturn => {
  const [locations, setLocations] = useState<typeLocation[]>([]);
  const [membership, setMembership] = useState<MembershipPlan[]>([]);
  const [client, setClient] = useState<Client[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch locations
        const locRes = await locationService.getLocations();
        if (locRes?.data.data) {
          setLocations(locRes.data.data);
        }

        // Fetch client
        const clientRes = await clientService.getClient();
        if (clientRes?.data) {
          setClient(clientRes.data.data);
        } else {
          console.warn("Struktur data client tidak sesuai:", clientRes);
          setClient([]);
        }

        // Fetch membership
        const memRes = await membershipService.getMembership();
        if (memRes?.data) {
          setMembership(memRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]);

  // Refresh handler
  const handleDataChange = () => setRefreshKey((prev) => prev + 1);

  // Calculate metrics
  const totalLocations = locations.length;
  const activeLocations = locations.filter(
    (loc) => loc.status === "tersedia",
  ).length;
  const totalMembership = membership.length;
  const averagePrice =
    membership.length > 0
      ? Math.round(
          membership.reduce((sum, m) => sum + m.price, 0) / membership.length,
        )
      : 0;
  const totalClient = client.length;
  const coverageRate =
    totalLocations > 0
      ? parseFloat(((activeLocations / totalLocations) * 100).toFixed(1))
      : 0;

  const metrics: DashboardMetrics = {
    totalLocations,
    activeLocations,
    totalMembership,
    averagePrice,
    totalClient,
    coverageRate,
  };

  return {
    locations,
    membership,
    client,
    isLoading,
    metrics,
    handleDataChange,
  };
};
