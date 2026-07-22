import { Edit2, Trash2 } from "lucide-react";
import { LocationDocument } from "@/types/location";
import { getLocationStatusLabel } from "@/constant/location.constant";

interface LocationTableProps {
  location: LocationDocument[];
  isLoading: boolean;
  onEdit: (loc: LocationDocument) => void;
  onDelete: (id: string) => void;
}

const LocationTable = ({
  location,
  isLoading,
  onEdit,
  onDelete,
}: LocationTableProps) => {

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
    <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1F2937]/50 border-b border-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-4">ID Wilayah</th>
              <th className="px-6 py-4">Nama Area / Kampung</th>
              <th className="px-6 py-4">Status Jaringan</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 text-sm text-gray-300">
            {location.map((loc, idx) => (
              <tr
                key={idx}
                className="hover:bg-[#1F2937]/20 transition-colors"
              >
                <td className="px-6 py-4 text-xs font-mono text-gray-500">
                  {loc._id}
                </td>
                <td className="px-6 py-4 font-medium text-white">{loc.area}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${loc.status === "tersedia" ? "bg-green-500/10 text-green-400" : loc.status === "akan_tersedia" ? "bg-blue-500/10 text-blue-400" : "bg-red-500/10 text-red-400" }`}
                  >
                    {getLocationStatusLabel(loc.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => onEdit(loc)}
                    className="p-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-blue-400 transition-all"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(loc._id)}
                    className="p-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationTable;
