import NavBar from "@/components/NavBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen">
      <NavBar />
      <Outlet />
      <div className="pb-3 text-center">Footer</div>
    </div>
  );
};

export default Layout;
