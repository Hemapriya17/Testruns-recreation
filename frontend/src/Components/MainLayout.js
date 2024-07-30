import React, { useState } from "react";
import Navbar from "./Navbar";
import SideLayout from "./SideLayout";

const MainLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar toggleSidebar={toggle} />
      <SideLayout isOpen={isOpen}>
        {children}
      </SideLayout>
    </div>
  );
};

export default MainLayout;
