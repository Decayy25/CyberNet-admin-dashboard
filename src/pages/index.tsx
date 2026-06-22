import CoverageForm from "@/components/CoverageForm";
import PageHead from "@/components/PageHead"
import RegistrationClientForm from "@/components/RegistrationClientForm"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <PageHead title="CyberNet" />
        <CoverageForm />

      <RegistrationClientForm />
    </main>
  );
}
