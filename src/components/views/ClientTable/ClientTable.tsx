import { Client } from "@/types";
import { Edit2, Trash2 } from "lucide-react";

interface ClientTableProps {
  client: Client[];
  isLoading: boolean;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => Promise<void>;
}

const ClientTable = ({
  client,
  isLoading,
  onEdit,
  onDelete,
}: ClientTableProps): React.JSX.Element => {
  const handleDelete = async (id: string) => {
    await onDelete(id);
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
    <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">

      {!isLoading && client.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-gray-800 bg-[#0B0F19]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Nama
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Telepon
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Alamat
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                  Paket
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">
                  Aksi
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {client.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-800/50 hover:bg-[#1F2937]/50 transition-colors"
                >
                  {/* Nama */}
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{item.fullName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      ID: {item._id?.slice(0, 8)}
                    </p>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4">
                    <p className="text-gray-300 text-sm">{item.email}</p>
                  </td>

                  {/* Telepon */}
                  <td className="px-6 py-4">
                    <p className="text-gray-300 text-sm">{item.phoneNumber}</p>
                  </td>

                  {/* Alamat */}
                  <td className="px-6 py-4">
                    <p className="text-gray-300 text-sm">{item.address}</p>
                  </td>

                  {/* Paket */}
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full">
                      {`PAKET ${item.packageId}`}
                    </span>
                  </td>

                  {/* Aksi */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      {/* Edit Button */}
                      <button
                        onClick={() => onEdit(item)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 p-2 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(item._id || "")}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && client.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12">
          <p className="text-gray-500 text-lg">Belum ada data client</p>
          <p className="text-gray-600 text-sm mt-2">
            Mulai dengan menambahkan client baru
          </p>
        </div>
      )}
    </div>
  );
}

export default ClientTable;