import CoverageForm from "@/components/CoverageForm";
import RegistrationClientForm from "@/components/RegistrationClientForm"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <CoverageForm />

      <RegistrationClientForm />
    </main>
  );
}
