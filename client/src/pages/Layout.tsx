import BackgroundEffect from "@/components/BackgroundEffect";
import Cursor from "@/components/Cursor";
import NavBar from "@/components/NavBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col items-center min-h-screen p-3 cursor-none">
      <NavBar />
      <Outlet />
      <BackgroundEffect />
      <Cursor />
    </div>
  );
};

export default Layout;
