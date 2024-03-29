import BackgroundEffect from "@/components/BackgroundEffect";
import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-between min-h-screen gap-3 cursor-none">
        <NavBar />
        <Outlet />
        <Footer />
      </div>
      <BackgroundEffect />
      <Cursor />
    </>
  );
};

export default Layout;
