import BackgroundEffect from "@/components/BackgroundEffect";
import Cursor from "@/components/Cursor";
import NavBar from "@/components/NavBar";
import colorStore from "@/stores/colorStore";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const color = colorStore((state) => state.color);
  return (
    <div className="flex flex-col items-center min-h-screen p-3 cursor-none">
      <NavBar />
      <div className="h-[80vh] flex flex-col items-center justify-center">
        <Outlet />
      </div>
      <BackgroundEffect color={color} />
      <Cursor color={color} />
    </div>
  );
};

export default Layout;
