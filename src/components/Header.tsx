import React from "react";
import { useRouter } from "next/router";
import { Search } from "lucide-react";

const Header = (): React.JSX.Element => {
  const router = useRouter();

  const getPlaceholder = () => {
    if (router.pathname.includes("membership")) return "Cari paket internet...";
    if (router.pathname.includes("location")) return "Cari area wilayah...";
    return "Pencarian global...";
  };

  return (
    <header className="h-16 bg-[#111827]/50 backdrop-blur-md border-b top-0 border-gray-800 flex items-center justify-between px-8 z-10">
      <div className="flex items-center gap-3 bg-[#1F2937]/60 border border-gray-800 px-4 py-2 rounded-xl w-80 focus-within:border-blue-500/50 transition-all duration-200">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder={getPlaceholder()}
          className="bg-transparent text-sm text-gray-200 focus:outline-none w-full placeholder-gray-500"
        />
      </div>


      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5 bg-gray-800/40 border border-gray-800 px-3 py-1.5 rounded-full">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-mono tracking-wider text-gray-400 uppercase">
            NextJS Engine: Live
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;