import React, { Fragment } from "react";
import PageHead from "@/components/PageHead";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function DashboardPage(): React.JSX.Element {

  return (
    <Fragment>
      <PageHead title="Dashboard | CyberNet" />
      <Header />
      <div className="flex min-h-full bg-[#0B0F19] text-white">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <h1 className="text-2xl">Welocome to Dashboard <strong className="underline">CyberNet</strong> </h1>
          </div>
        </main>
      </div>
    </Fragment>
  );
}
