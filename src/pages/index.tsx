import CoverageForm from "@/components/views/CoverageForm";
import PageHead from "@/components/common/PageHead"
import RegistrationClientForm from "@/components/views/RegistrationForm"
import MembershipSection from "@/components/views/MembershipSection"

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
