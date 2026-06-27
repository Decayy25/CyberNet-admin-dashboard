import { PackageTypeProps } from "@/types/package";
import Link from "next/link"

interface MembershipLayoutProps {
  data: PackageTypeProps;
  onSelect?: (data: PackageTypeProps) => void;
}

const MembershipLayout = ({ data }: MembershipLayoutProps) => {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white shadow-lg border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
        data.isPopular
          ? "border-blue-600 ring-2 ring-blue-200"
          : "border-gray-200"
      }`}
    >
      {/* Badge Popular */}
      {data.isPopular && (
        <div className="absolute right-4 top-4 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-gray-900">
          Popular
        </div>
      )}

      {/* Header */}
      <div className="bg-blue-900 py-6 text-center">
        <h2 className="text-3xl font-bold text-white">{data.paket}</h2>
      </div>

      {/* Body */}
      <div className="space-y-6 p-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-blue-600">
            {formatPrice(data.price)}
          </h1>

          <p className="mt-2 text-gray-500">per {data.period}</p>
        </div>

        <div className="space-y-3">
          {data.features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 border-b border-gray-200 pb-3 text-gray-700"
            >
              <span className="text-green-600 font-bold"></span>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500">
          Sudah termasuk PPN 11%
        </p>

        <div className="flex justify-center">
          <Link
            href={"#daftar"}
            className="w-full rounded-lg bg-blue-600 py-3 px-2 text-center font-semibold text-white transition hover:bg-blue-700 active:scale-95"
          >
            Pilih Paket
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MembershipLayout;
