import { Fragment } from "react";
import MembershipLayout from "@/components/layouts/MembershipLayout";
import useMembership from "@/hooks/useMembership";

const MembershipSection = () => {
  const { membership, isLoading } = useMembership();

  if (isLoading) {
    return (
      <section className="container mx-auto py-20">
        <p className="text-center text-gray-500 font-semibold">Loading...</p>
      </section>
    );
  }

  return (
    <Fragment>
      <section className="my-10">
        <div className="mb-10">
          <h1 className="font-bold text-3xl text-center">
            Paket Internet CYBERNET
          </h1>
          <p className="text-center text-black/50">
            Pilih paket internet sesuai kebutuhan Anda
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {membership.map((item) => (
            <MembershipLayout key={item._id} data={item} />
          ))}
        </div>
      </section>
    </Fragment>
  );
};

export default MembershipSection;
