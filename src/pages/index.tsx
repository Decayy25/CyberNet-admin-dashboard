import CoverageForm from "@/components/views/CoverageForm";
import PageHead from "@/components/common/PageHead";
import RegistrationClientForm from "@/components/views/RegistrationForm";
import MembershipSection from "@/components/views/MembershipSection";
import ClientHeader from "@/components/common/Client/ClientHeader";
import { Fragment } from "react/jsx-runtime";
import ClientNavbar from "@/components/common/Client/ClientNavbar";

export default function Home() {
  return (
    <Fragment>
      <ClientHeader />
      <ClientNavbar />
      <main className="min-h-screen bg-gray-100 p-10">
        <PageHead title="CyberNet" />
        <MembershipSection />
        <CoverageForm />
        <RegistrationClientForm />
      </main>
    </Fragment>
  );
}
