import React from "react";
import { LayoutDashboard, CreditCard, MapPin, LogOut } from "lucide-react";
import Link from "next/link";

export default function Sidebar(): React.JSX.Element {
  return (
    <aside className="w-64 h-screen top-0 bg-[#111827] border-r sticky border-gray-800/60 flex flex-col justify-between p-6 z-40">
      <div className="space-y-6">

        <Link href={"/admin/dashboard"} className="flex items-center gap-3 bg-blue-600/10 border border-blue-500/20 px-4 py-3 rounded-xl text-blue-400 cursor-pointer shadow-lg shadow-blue-500/5">
          <LayoutDashboard size={18} />
          <span className="text-sm font-medium">Dashboard</span>
        </Link>

        <Link href={"/admin/membership"} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800/50 hover:text-white cursor-pointer transition-all">
          <CreditCard size={18} />
          <span className="text-sm font-medium">Membership Paket</span>
        </Link>


        <Link href={"/admin/location"} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800/50 hover:text-white cursor-pointer transition-all">
          <MapPin size={18} />
          <span className="text-sm font-medium">Perluasan Wilayah</span>
        </Link>
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

        
        <button className="text-gray-500 hover:text-red-400 transition-colors">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
