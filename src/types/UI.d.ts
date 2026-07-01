import { Location } from "@/types/location";

export interface MembershipPlan {
  _id: string;
  paket: string;
  price: number;
  period: string;
  features: string[];
  isPopular: boolean;
}

export interface TypeEmail {
  email: string;
  name: string;
  message: string;
}

export interface TypeLoginAdmin {
  identifier: string;
  password: string;
}

export interface typeMembership {
  paket: string;
  price: number;
  period: "bulan" | "tahun";
  features: string[];
  isPopular?: boolean;
}

export interface AlertProps {
  area: string;
  status: string;
  confidence: string;
  isVerified: boolean;
  matchedArea?: string;
}

export interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  color: string;
}

export interface DashboardMetrics {
  totalLocations: number;
  activeLocations: number;
  totalMembership: number;
  averagePrice: number;
  totalClient: number;
  coverageRate: number;
}

export interface UseDashboardReturn {
  locations: Location[];
  membership: MembershipPlan[];
  client: Client[];
  isLoading: boolean;
  metrics: DashboardMetrics;
  handleDataChange: () => void;
}

export interface UseClientReturn {
  client: Client[];
  isLoading: boolean;
  isModalOpen: boolean;
  isEditMode: string;
  formData: Client;
  searchQuery: string;
  handleSearch: (query: string) => void;
  handleInputChange: (field: string, value: string) => void;
  handleSaveClient: () => Promise<void>;
  handleDeleteClient: (id: string) => Promise<void>;
  openAddModal: () => void;
  openEditModal: (client: Client) => void;
  closeModal: () => void;
  handleRefreshClient: () => void;
}
