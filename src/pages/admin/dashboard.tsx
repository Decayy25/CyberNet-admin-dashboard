import React, { Fragment } from "react";
import PageHead from "@/components/PageHead";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { MapPin, CreditCard, Users, TrendingUp } from "lucide-react";
import Refresh from "@/components/refresh";
import { useDashboard } from "@/hooks/useDashboard";
import { KPICardProps} from "@/types/UI";



const KPICard = ({ title, value, icon, trend, color }: KPICardProps) => {
  return (
    <div
      className={`bg-linear-to-br from-[#111827] to-[#1F2937] border border-${color}/20 rounded-2xl p-6 space-y-3`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400 font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
          {trend !== undefined && (
            <p
              className={`text-xs mt-2 ${
                trend > 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 bg-${color}/10 rounded-lg text-${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
}

const StatsCard = ({ title, value, subtitle }: StatsCardProps) => (
  <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
    <h4 className="text-sm text-gray-400 font-medium mb-2">{title}</h4>
    <p className="text-2xl font-bold text-emerald-400">{value}</p>
    <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
  </div>
);

// Location Item Component
const LocationItem = ({ area, id, status }: any) => (
  <div className="flex justify-between items-center p-3 bg-[#1F2937]/50 rounded-lg">
    <div>
      <p className="font-medium text-white">{area}</p>
      <p className="text-xs text-gray-500">ID: {id?.slice(0, 8)}</p>
    </div>
    <span
      className={`text-xs px-2 py-1 rounded-full ${
        status === "tersedia"
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-red-500/10 text-red-400"
      }`}
    >
      {status}
    </span>
  </div>
);

// Membership Item Component
const MembershipItem = ({ paket, price, period, isPopular }: any) => (
  <div className="flex justify-between items-center p-3 bg-[#1F2937]/50 rounded-lg">
    <div>
      <p className="font-medium text-white">{paket}</p>
      <p className="text-xs text-emerald-400">
        Rp {price.toLocaleString("id-ID")} / {period}
      </p>
    </div>
    {isPopular && (
      <span className="text-xs px-2 py-1 bg-amber-500/10 text-amber-400 rounded-full">
        ⭐ Popular
      </span>
    )}
  </div>
);

// Main Dashboard Component
const DashboardPage = (): React.JSX.Element => {
  const { locations, membership, isLoading, metrics, handleDataChange } =
    useDashboard();

  const {
    totalLocations,
    activeLocations,
    totalMembership,
    averagePrice,
    totalClient,
    coverageRate,
  } = metrics;

  return (
    <Fragment>
      <PageHead title="Dashboard | CyberNet" />
      <Header />
      <div className="flex min-h-full bg-[#0B0F19] text-white">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto pl-70 pt-20">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back, <span className="text-blue-400">Admin</span>!
                    👋
                  </h1>
                  <p className="text-gray-400 mt-2">
                    Here&apos;s what&apos;s happening with your CyberNet network
                    today.
                  </p>
                </div>
                <Refresh onClick={handleDataChange} />
              </div>
            </div>

            {isLoading && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-blue-400">
                Loading dashboard data...
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Total Wilayah"
                value={totalLocations}
                icon={<MapPin size={24} />}
                trend={12}
                color="blue"
              />
              <KPICard
                title="Wilayah Aktif"
                value={activeLocations}
                icon={<TrendingUp size={24} />}
                trend={8}
                color="emerald"
              />
              <KPICard
                title="Paket Membership"
                value={totalMembership}
                icon={<CreditCard size={24} />}
                trend={5}
                color="purple"
              />
              <KPICard
                title="Total Client"
                value={totalClient}
                icon={<Users size={24} />}
                trend={15}
                color="pink"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Harga Rata-rata Paket"
                value={`Rp ${averagePrice.toLocaleString("id-ID")}`}
                subtitle={`Dari ${totalMembership} paket aktif`}
              />

              <StatsCard
                title="Client per Wilayah"
                value={
                  totalLocations > 0
                    ? (totalClient / totalLocations).toFixed(1)
                    : 0
                }
                subtitle="Rata-rata per lokasi"
              />

              <StatsCard
                title="Coverage Rate"
                value={`${coverageRate}%`}
                subtitle="Wilayah aktif dari total"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">Wilayah Terbaru</h3>
                <div className="space-y-3">
                  {locations.length > 0 ? (
                    locations
                      .slice(-3)
                      .reverse()
                      .map((loc, idx) => (
                        <LocationItem
                          key={idx}
                          area={loc.area}
                          id={loc._id}
                          status={loc.status}
                        />
                      ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Belum ada data wilayah
                    </p>
                  )}
                </div>
              </div>

              {/* Recent Memberships */}
              <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">
                  Paket Membership Terbaru
                </h3>
                <div className="space-y-3">
                  {membership.length > 0 ? (
                    membership
                      .slice(-3)
                      .reverse()
                      .map((mem, idx) => (
                        <MembershipItem
                          key={idx}
                          paket={mem.paket}
                          price={mem.price}
                          period={mem.period}
                          isPopular={mem.isPopular}
                        />
                      ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Belum ada data paket
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Fragment>
  );
}

export default DashboardPage;