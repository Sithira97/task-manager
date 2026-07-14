import React from "react";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";
import { useIsMobile } from "../hooks/IsMobileHook";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile();
  return (
    <div className="flex h-screen relative">
      <div className="sm:ml-64 w-full h-screen flex flex-col">
        {isMobile ? <MobileNav /> : <Navbar />}
        {children}
      </div>
    </div>
  );
};

export default Layout;
