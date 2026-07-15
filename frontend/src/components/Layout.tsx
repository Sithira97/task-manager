import React from "react";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";
import { useIsMobile } from "../hooks/IsMobileHook";
import { type User } from "../types";
import { useNavigate } from "react-router-dom";

const Layout: React.FC<{
  children: React.ReactNode;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}> = ({ children, user, setUser }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("http://localhost:3001/api/auth/logout", {
      method: "POST",
    });
    localStorage.removeItem("auth_user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="flex h-screen relative">
      <div className="sm:ml-64 w-full h-screen flex flex-col">
        {isMobile ? (
          <MobileNav />
        ) : (
          <Navbar user={user} onLogout={handleLogout} />
        )}
        {children}
      </div>
    </div>
  );
};

export default Layout;
