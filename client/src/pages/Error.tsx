import BackgroundEffect from "@/components/BackgroundEffect";
import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import colorStore from "@/stores/colorStore";
import cursorHideStore from "@/stores/cursorHideStore";
import { useEffect } from "react";
import { Link } from "react-router-dom";

interface ErrorProps {
  header: string;
  message: string;
}

const Error = ({ header, message }: ErrorProps) => {
  const setColor = colorStore((state) => state.setColor);
  const setCursorHidden = cursorHideStore((state) => state.setCursorHidden);

  useEffect(() => {
    setColor("red");

    const hideOnHoverElements = document.querySelectorAll(".hide-on-hover");
    hideOnHoverElements.forEach((element) => {
      element.addEventListener("mouseenter", () => setCursorHidden(true));
      element.addEventListener("mouseleave", () => setCursorHidden(false));
    });

    return () => {
      setCursorHidden(false);
      hideOnHoverElements.forEach((element) => {
        element.removeEventListener("mouseenter", () => setCursorHidden(true));
        element.removeEventListener("mouseleave", () => setCursorHidden(false));
      });
    };
  }, []);

  return (
    <>
      <div className="flex flex-col justify-between items-center min-h-screen gap-3 cursor-none">
        <NavBar />
        <Header>
          <h1 className="text-transparent scroll-m-20 text-2xl font-extrabold tracking-tight md:text-4xl lg:text-5xl py-2 bg-gradient-to-r from-red-600 via-red-300 to-red-600 bg-clip-text bg-200% animate-shine">
            {header}
          </h1>
          <p className="text-sm text-secondary-foreground scroll-m-20 font-semibold px-2 md:text-xl lg:text-3xl">
            {message}
          </p>
          <Button className="text-secondary-foreground mt-4 bg-200% bg-gradient-to-r from-red-600 via-red-400 to-red-600 animate-shine">
            <Link to="/">Go Home</Link>
          </Button>
        </Header>
        <Footer />
      </div>
      <BackgroundEffect />
      <Cursor />
    </>
  );
};

export default Error;
