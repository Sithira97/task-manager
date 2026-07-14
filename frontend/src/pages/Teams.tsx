import Navbar from "../components/Navbar.js";
import { useIsMobile } from "../hooks/IsMobileHook";
import MobileNav from "../components/MobileNav.js";

const Teams: React.FC = () => {
  const isMobile = useIsMobile();
  return (
    <div className="flex h-screen relative">
      <div className="sm:ml-64 w-full h-screen flex flex-col">
        {isMobile ? <MobileNav /> : <Navbar />}
        <main className="flex-1 overflow-y-auto"></main>
      </div>
    </div>
  );
};

export default Teams;
