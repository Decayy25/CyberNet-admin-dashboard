export enum PackageType {
  BASIC = "PAKET 10 Mbps",
  STANDARD = "PAKET 20 Mbps",
  PROFESSIONAL = "PAKET 30 Mbps",
  ENTERPRISE = "PAKET 50 Mbps",
}

export const PACKAGE_OPTIONS = Object.values(PackageType);

export const PACKAGE_DETAILS = {
  [PackageType.BASIC]: {
    name: "Paket Basic",
    speed: "10 Mbps",
    price: 170052,
    features: ["Unlimited", "24/7 Support"],
  },
  [PackageType.STANDARD]: {
    name: "Paket Standard",
    speed: "20 Mbps",
    price: 199000,
    features: ["Internet 20Mbps", "24/7 Support", "Free Router"],
  },
  [PackageType.PROFESSIONAL]: {
    name: "Paket Professional",
    speed: "30 Mbps",
    price: 299000,
    features: [
      "Internet 30Mbps",
      "24/7 Support",
      "Free Router",
      "Free Installation",
    ],
  },
  [PackageType.ENTERPRISE]: {
    name: "Paket Enterprise",
    speed: "50 Mbps",
    price: 399000,
    features: [
      "Internet 50Mbps",
      "Priority Support",
      "Free Router",
      "Free Installation",
      "SLA Guarantee",
    ],
  },
} as const;

export interface TypeContactForm {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  packageId: string;
}

export const isValidPackage = (pkg: string): pkg is PackageType => {
  return Object.values(PackageType).includes(pkg as PackageType);
};

export const getPackageName = (packageId: PackageType): string => {
  return PACKAGE_DETAILS[packageId]?.name || packageId;
};

export const getPackagePrice = (packageId: PackageType): number => {
  return PACKAGE_DETAILS[packageId]?.price || 0;
};

export interface PackageTypeProps {
  paket: string;
  price: number;
  period: string;
  features: string[];
  isPopular: boolean;
}