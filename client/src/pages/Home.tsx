import WelcomeHeader from "@/components/WelcomeHeader";
import colorStore from "@/stores/colorStore";
import cursorHideStore from "@/stores/cursorHideStore";
import { useEffect } from "react";

const Home = () => {
  const setCursorHidden = cursorHideStore((state) => state.setCursorHidden);
  const setColor = colorStore((state) => state.setColor);

  setTimeout(() => {
    const hideOnHoverElements = document.querySelectorAll(".hide-on-hover");
    hideOnHoverElements.forEach((element) => {
      element.addEventListener("mouseenter", () => setCursorHidden(true));
      element.addEventListener("mouseleave", () => setCursorHidden(false));
    });
  }, 200);

  useEffect(() => {
    setColor("blue");

    return () => {
      setCursorHidden(false);
      const hideOnHoverElements = document.querySelectorAll(".hide-on-hover");
      hideOnHoverElements.forEach((element) => {
        element.removeEventListener("mouseenter", () => setCursorHidden(true));
        element.removeEventListener("mouseleave", () => setCursorHidden(false));
      });
    };
  }, []);

  return (
    <>
      <WelcomeHeader />
    </>
  );
};

export default Home;
