import { useState } from "react";
import Alert from "@/components/ui/Alert";
import useCoverage  from "@/hooks/useCoverage";

const CoverageForm = () => {
  const [area, setArea] = useState("");

  const { mutate, data, isPending } = useCoverage();

  const handleSubmit = () => {
    if (!area.trim()) return;

    mutate(area);
  };

  return (
    <section id="coverage" style={{ scrollMarginTop: "120px" }}>
      <div className="bg-white rounded-3xl shadow p-10 w-full">
        <h2 className="text-4xl font-bold mb-5">Cek Coverage Area</h2>

        <div className="flex gap-4">
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Masukkan alamat pemasangan"
            className="flex-1 border rounded-lg px-4 py-3"
          />

          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg">
            {isPending ? "Checking..." : "Cek Coverage"}
          </button>
        </div>

        {data && (
          <Alert
            area={data.data.area}
            status={data.data.status}
            confidence={data.data.confidence}
            isVerified={data.data.isVerified}
            matchedArea={data.data.matchedArea}
          />
        )}
      </div>
    </section>
  );
};

export default CoverageForm;
