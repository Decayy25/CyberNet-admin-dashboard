import { Fragment } from "react/jsx-runtime";

const ClientHeader = () => {
  return (
    <Fragment>
      <header className="block">
        <div className="top-header relative px-0 py-10">
          <div className="w-1/4 mx-10 flex gap-x-20">
            <div className="mr-200"></div>
            <img src="/cybernet.png" alt="Logo" />
          </div>
        </div>
      </header>
    </Fragment>
  );
};

export default ClientHeader;
