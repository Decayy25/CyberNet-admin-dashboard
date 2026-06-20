import React, { Fragment, useEffect, useState } from "react";
import PageHead from "@/components/PageHead";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from "recharts";
import { MapPin, CreditCard, Users, TrendingUp } from "lucide-react";
import membershipService from "@/services/membership.service";
import locationService from "@/services/location.service";

// ✅ KPI Card Component
interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  color: string;
}

const KPICard = ({ title, value, icon, trend, color }: KPICardProps) => {
  return (
    <div className={`bg-gradient-to-br from-[#111827] to-[#1F2937] border border-${color}/20 rounded-2xl p-6 space-y-3`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400 font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
          {trend !== undefined && (
            <p className={`text-xs mt-2 ${trend > 0 ? "text-emerald-400" : "text-red-400"}`}>
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

// ✅ Mock Data untuk Chart (real data nanti dari API)
const locationTrendData = [
  { month: "Jan", locations: 12, members: 240 },
  { month: "Feb", locations: 19, members: 221 },
  { month: "Mar", locations: 25, members: 229 },
  { month: "Apr", locations: 28, members: 200 },
  { month: "May", locations: 35, members: 298 },
  { month: "Jun", locations: 42, members: 345 },
];

const membershipData = [
  { name: "Paket Basic", value: 35, price: 99000 },
  { name: "Paket Pro", value: 45, price: 199000 },
  { name: "Paket Premium", value: 20, price: 399000 },
];

const colors = ["#3B82F6", "#8B5CF6", "#EC4899"];

const memberGrowthData = [
  { week: "W1", members: 100 },
  { week: "W2", members: 150 },
  { week: "W3", members: 200 },
  { week: "W4", members: 280 },
  { week: "W5", members: 350 },
  { week: "W6", members: 420 },
  { week: "W7", members: 510 },
  { week: "W8", members: 625 },
];

export default function DashboardPage(): React.JSX.Element {
  const [locations, setLocations] = useState<any[]>([]);
  const [membership, setMembership] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch locations
        const locRes = await locationService.getLocations();
        if (locRes?.data?.data) {
          setLocations(locRes.data.data);
        }

        // Fetch membership
        const memRes = await membershipService.getMembership();
        if (memRes?.data?.data) {
          setMembership(memRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Calculate metrics
  const totalLocations = locations.length;
  const activeLocations = locations.filter((loc) => loc.status === "tersedia").length;
  const totalMembership = membership.length;
  const totalMembers = 625; // Mock data - nanti dari API
  const averagePrice = membership.length > 0
    ? Math.round(membership.reduce((sum, m) => sum + m.price, 0) / membership.length)
    : 0;

  return (
    <Fragment>
      <PageHead title="Dashboard | CyberNet" />
      <Header />
      <div className="flex min-h-full bg-[#0B0F19] text-white">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* ✅ HEADER SECTION */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, <span className="text-blue-400">Admin</span>! 👋
              </h1>
              <p className="text-gray-400 mt-2">
                Here&apos;s what&apos;s happening with your CyberNet network today.
              </p>
            </div>

            {/* ✅ KPI CARDS */}
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
                title="Total Member"
                value={totalMembers}
                icon={<Users size={24} />}
                trend={15}
                color="pink"
              />
            </div>

            {/* ✅ CHARTS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Line Chart - Location Trend */}
              <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">Trend Wilayah & Member</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={locationTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                    <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="locations" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ fill: "#3B82F6" }}
                      name="Wilayah"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="members" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      dot={{ fill: "#8B5CF6" }}
                      name="Member"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart - Membership Pricing */}
              <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">Harga Paket Membership</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={membershipData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                    <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }}
                      labelStyle={{ color: "#fff" }}
                      formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
                    />
                    <Bar dataKey="price" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ✅ SECOND ROW CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Area Chart - Member Growth */}
              <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">Pertumbuhan Member (Weekly)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={memberGrowthData}>
                    <defs>
                      <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                    <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="members" 
                      stroke="#3B82F6" 
                      fillOpacity={1} 
                      fill="url(#colorMembers)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart - Membership Distribution */}
              <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">Distribusi Member per Paket</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={membershipData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {membershipData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }}
                      labelStyle={{ color: "#fff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ✅ STATS SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Average Membership Price */}
              <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
                <h4 className="text-sm text-gray-400 font-medium mb-2">Harga Rata-rata Paket</h4>
                <p className="text-2xl font-bold text-emerald-400">
                  Rp {averagePrice.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-gray-500 mt-2">Dari {totalMembership} paket aktif</p>
              </div>

              {/* Member to Location Ratio */}
              <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
                <h4 className="text-sm text-gray-400 font-medium mb-2">Member per Wilayah</h4>
                <p className="text-2xl font-bold text-blue-400">
                  {totalLocations > 0 ? (totalMembers / totalLocations).toFixed(1) : 0}
                </p>
                <p className="text-xs text-gray-500 mt-2">Rata-rata per lokasi</p>
              </div>

              {/* Coverage Rate */}
              <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
                <h4 className="text-sm text-gray-400 font-medium mb-2">Coverage Rate</h4>
                <p className="text-2xl font-bold text-purple-400">
                  {totalLocations > 0 ? ((activeLocations / totalLocations) * 100).toFixed(1) : 0}%
                </p>
                <p className="text-xs text-gray-500 mt-2">Wilayah aktif dari total</p>
              </div>
            </div>

            {/* ✅ RECENT ACTIVITY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Locations */}
              <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">Wilayah Terbaru</h3>
                <div className="space-y-3">
                  {locations.slice(-3).reverse().map((loc, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-[#1F2937]/50 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{loc.area}</p>
                        <p className="text-xs text-gray-500">ID: {loc._id?.slice(0, 8)}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        loc.status === "tersedia" 
                          ? "bg-emerald-500/10 text-emerald-400" 
                          : "bg-red-500/10 text-red-400"
                      }`}>
                        {loc.status}
                      </span>
                    </div>
                  ))}
                  {locations.length === 0 && (
                    <p className="text-gray-500 text-sm">Belum ada data wilayah</p>
                  )}
                </div>
              </div>

              {/* Recent Memberships */}
              <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">💳 Paket Membership Aktif</h3>
                <div className="space-y-3">
                  {membership.slice(-3).reverse().map((mem, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-[#1F2937]/50 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{mem.paket}</p>
                        <p className="text-xs text-emerald-400">
                          Rp {mem.price.toLocaleString("id-ID")} / {mem.period}
                        </p>
                      </div>
                      {mem.isPopular && (
                        <span className="text-xs px-2 py-1 bg-amber-500/10 text-amber-400 rounded-full">
                          ⭐ Popular
                        </span>
                      )}
                    </div>
                  ))}
                  {membership.length === 0 && (
                    <p className="text-gray-500 text-sm">Belum ada data paket</p>
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