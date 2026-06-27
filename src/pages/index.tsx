import CoverageForm from "@/components/CoverageForm";
import PageHead from "@/components/PageHead"
import RegistrationClientForm from "@/components/RegistrationForm"
import MembershipSection from "@/components/MembershipSection"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <PageHead title="CyberNet" />
        <MembershipSection />
        <CoverageForm />

      <RegistrationClientForm />
    </main>
  );
}
