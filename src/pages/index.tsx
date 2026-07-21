import CoverageForm from "@/components/views/CoverageForm";
import PageHead from "@/components/common/PageHead";
import RegistrationClientForm from "@/components/views/RegistrationForm";
import MembershipSection from "@/components/views/MembershipSection";
import ClientHeader from "@/components/common/Client/ClientHeader";
import { Fragment } from "react/jsx-runtime";
import ClientNavbar from "@/components/common/Client/ClientNavbar";
import Hero from "@/components/views/Hero";
import FeaturesHome from "@/components/views/FeaturesHome";
import ClientFooter from "@/components/common/Client/ClientFooter";

export default function Home() {
  return (
    <Fragment>
      <PageHead title="CyberNet" />
      <ClientHeader />
      <ClientNavbar />
      <Hero />
      <FeaturesHome />
      <main className="min-h-screen bg-gray-100 p-10">
        <MembershipSection />
        <CoverageForm />
        <RegistrationClientForm />
      </main>
      <ClientFooter />
    </Fragment>
  );
}
