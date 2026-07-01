import React, { ReactElement } from "react";
import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";

interface AdminLayoutProps {
  children: ReactElement;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Header />

      <div className="flex">
        <div className="w-64 fixed left-0 top-20 bottom-0 bg-[#111827] border-r border-gray-800">
          <Sidebar />
        </div>

        <main className="ml-64 pt-20 px-6 pb-6 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
