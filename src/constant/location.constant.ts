import { LocationStatus } from "@/types/location";

export const LOCATION_STATUS_VALUES: readonly LocationStatus[] = [
  "tersedia",
  "tidak_tersedia",
] as const;

export const LOCATION_STATUS_LABELS: Record<LocationStatus, string> = {
  tersedia: "Tersedia",
  tidak_tersedia: "Tidak Tersedia",
} as const;

export const isValidLocationStatus = (value: string): value is LocationStatus => {
  return LOCATION_STATUS_VALUES.includes(value as LocationStatus);
};

export const getLocationStatusLabel = (status: LocationStatus): string => {
  return LOCATION_STATUS_LABELS[status] || status;
};
