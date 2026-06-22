import React from "react";
import { LayoutDashboard, CreditCard, MapPin, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

// Navigation Item Component
const NavItem = ({ href, icon, label, isActive }: NavItemProps) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive
          ? "bg-blue-600/10 border border-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/5"
          : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

export default function Sidebar(): React.JSX.Element {
  const router = useRouter();
  const currentPath = router.pathname;
  const isActive = (path: string) => currentPath === path;

  // Menu items
  const menuItems = [
    {
      href: "/admin/dashboard",
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
    },
    {
      href: "/admin/membership",
      icon: <CreditCard size={18} />,
      label: "Membership Paket",
    },
    {
      href: "/admin/location",
      icon: <MapPin size={18} />,
      label: "Perluasan Wilayah",
    },
    {
      href: "/admin/client",
      icon: <User size={18} />,
      label: "Kontrol Pelanggan",
    },
  ];

  return (
    <aside className="w-64 h-screen fixed top-0 right- bg-[#111827] border-r  border-gray-800/60 flex flex-col justify-between p-6 z-40">
      <div className="space-y-6">
        {menuItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={isActive(item.href)}
          />
        ))}
      </div>

      <div className="border-t border-gray-800/60 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-md shadow-blue-600/20">
            CN
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide">
              CyberNet
            </h4>
            <p className="text-[10px] text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
