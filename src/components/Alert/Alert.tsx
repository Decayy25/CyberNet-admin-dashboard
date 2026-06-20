import { useState } from "react";
import { AlertProps } from "@/types/UI";

const Alert = ({
  area,
  status,
  confidence,
  isVerified,
  matchedArea,
}: AlertProps) => {
  const [isOpen, setIsOpen] = useState(true);
  

  if (!isOpen) return null;
  const isAvailable =
    status.toLowerCase().includes("tersedia layanan") &&
    !status.toLowerCase().includes("tidak tersedia");

  const variant = isAvailable ? "success" : isVerified ? "info" : "warning";

  const styles = {
    success: {
      container: "bg-green-50 border-green-300 text-green-800",
      button: "bg-green-600 hover:bg-green-700",
      title: "Layanan Tersedia",
    },

    info: {
      container: "bg-blue-50 border-blue-300 text-blue-800",
      button: "bg-blue-600 hover:bg-blue-700",
      title: "Area Ditemukan",
    },

    warning: {
      container: "bg-orange-50 border-orange-300 text-orange-800",
      button: "bg-orange-600 hover:bg-orange-700",
      title: "Area Tidak Ditemukan",
    },
  };

  const current = styles[variant];

  return (
    <div
      className={`border rounded-xl p-4 mt-6 ${current.container}`}
      role="alert"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg">{current.title}</h3>

        <button onClick={() => setIsOpen(false)} className="font-bold">
          ✕
        </button>
      </div>

      <div className="mt-3 space-y-1">
        <p>
          <strong>Area:</strong> {area}
        </p>

        <p>
          <strong>Status:</strong> {status}
        </p>

        <p>
          <strong>Confidence:</strong> {confidence}
        </p>

        {matchedArea && (
          <p>
            <strong>Matched Area:</strong> {matchedArea}
          </p>
        )}
      </div>
    </div>
  );
};

export default Alert;
