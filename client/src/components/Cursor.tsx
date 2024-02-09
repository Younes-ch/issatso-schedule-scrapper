import useMediaQuery from "@/hooks/useMediaQuery";
import colorStore from "@/stores/colorStore";
import { useEffect, useState } from "react";

const Cursor = () => {
  const color =
    colorStore((state) => state.color) === "blue" ? "bg-primary" : "bg-red-600";
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX - 25, y: e.clientY - 25 });
    };

    const handleMouseEnter = () => {
      setHidden(true);
    };

    const handleMouseLeave = () => {
      setHidden(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.querySelectorAll(".hide-on-hover").forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.querySelectorAll(".hide-on-hover").forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      {!hidden && isDesktop && (
        <div
          className={`z-50 fixed top-0 left-0 pointer-events-none w-14 h-14 rounded-full ${color} filter blur-lg`}
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          }}
        ></div>
      )}
    </>
  );
};

export default Cursor;
