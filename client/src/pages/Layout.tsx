import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen gap-3">
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
