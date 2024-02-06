import NavBar from "@/components/NavBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col items-center min-h-screen p-3 cursor-none">
      <NavBar />
      <div className="h-[80vh] w-full flex flex-col items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
