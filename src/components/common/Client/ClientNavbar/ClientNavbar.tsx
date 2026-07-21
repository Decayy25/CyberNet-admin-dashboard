import {
  ClipboardList,
  House,
  LayoutDashboard,
  MapPin,
  Phone,
  Wifi,
} from "lucide-react";
import Link from "next/link";

const ClientNavbar = () => {
  const navItems = [
    { href: "/", label: "Beranda", icon: House },
    { href: "#paket", label: "Paket Internet", icon: Wifi },
    { href: "#coverage", label: "Cek Coverage", icon: MapPin },
    { href: "#daftar", label: "Pendaftaran", icon: ClipboardList },
    { href: "#kontak", label: "Kontak", icon: Phone },
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <nav className="bg-blue-900 text-white px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <ul className="flex justify-center gap-8 text-lg font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="group relative inline-flex items-center gap-2 py-2">
                  <Icon
                    size={20}
                    className="transition-colors duration-300 group-hover:text-blue-300"
                  />
                  <span className="transition-colors duration-300 group-hover:text-blue-300">
                    {item.label}
                  </span>

                  <span
                    className="absolute bottom-1 left-1/2 h-0.5 bg-white 
                    w-0 -translate-x-1/2
                    transition-all duration-300 ease-out
                    group-hover:w-full group-hover:left-0 group-hover:translate-x-0"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default ClientNavbar;
