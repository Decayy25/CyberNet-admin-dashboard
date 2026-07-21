import Image from "next/image";
import { Fragment } from "react/jsx-runtime";

const ClientHeader = () => {
  return (
    <Fragment>
      <header className="block">
        <div className="top-header relative py-3">
          <div className="mx-10 flex gap-x-20">
            <div className="mr-230"></div>
            <Image src="/cybernet.png" alt="Logo" width={310} height={310} />
          </div>
        </div>
      </header>
    </Fragment>
  );
};

export default ClientHeader;
