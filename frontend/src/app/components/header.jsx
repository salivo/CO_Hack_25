import React from "react";

const HeaderComponent = ({ children }) => {
  return (
    <>
      <header className="w-full p-4 flex justify-between items-center ">
        {children}
      </header>

      <div className="w-full  px-4">
        <div
          className="
            border-b border-[#2f6f6f]/40
          "
        />
      </div>
    </>
  );
};

export default HeaderComponent;
