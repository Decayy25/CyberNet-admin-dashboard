import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { MembershipPlan } from "@/types/UI";

interface MembershipTableProps {
  membership: MembershipPlan[];
  isLoading: boolean;
  onEdit: (plan: MembershipPlan) => void;
  onDelete: (id: string) => void;
}

const MembershipTable = ({
  membership,
  isLoading,
  onEdit,
  onDelete,
}: MembershipTableProps): React.JSX.Element => {
  // Helper untuk format rupiah
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (isLoading) {
    return (
      <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden p-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1F2937]/50 border-b border-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Nama Paket / Kecepatan</th>
                <th className="px-6 py-4">Harga & Periode</th>
                <th className="px-6 py-4">Fitur Utama</th>
                <th className="px-6 py-4">Status Populer</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-sm text-gray-300">
              {membership && membership.length > 0 ? (
                membership.map((plan) => (
                  <tr
                    key={plan._id}
                    className="hover:bg-[#1F2937]/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-white">
                      {plan.paket}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-400 font-mono font-semibold">
                        {formatRupiah(plan.price)}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {" "}
                        / {plan.period}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5 max-w-xs">
                        {plan.features && plan.features.length > 0 ? (
                          plan.features.map((feat, idx) => (
                            <span
                              key={idx}
                              className="text-xs text-gray-400 truncate"
                            >
                              {feat}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-600">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {plan.isPopular ? (
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-xs font-medium">
                          Popular
                        </span>
                      ) : (
                        <span className="text-gray-600 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => onEdit(plan)}
                        className="p-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition-all"
                        title="Edit paket"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(plan._id)}
                        className="p-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                        title="Hapus paket"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    Belum ada data paket membership
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MembershipTable;
