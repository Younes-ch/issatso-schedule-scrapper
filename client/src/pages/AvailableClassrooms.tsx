import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import colorStore from "@/stores/colorStore";
import cursorHideStore from "@/stores/cursorHideStore";
import { useEffect } from "react";

const AvailableClassrooms = () => {
  const setColor = colorStore((state) => state.setColor);
  const setCursorHidden = cursorHideStore((state) => state.setCursorHidden);

  useEffect(() => {
    setColor("blue");
    const hideOnHoverElements = document.querySelectorAll(".hide-on-hover");
    hideOnHoverElements.forEach((element) => {
      element.addEventListener("mouseenter", () => setCursorHidden(true));
      element.addEventListener("mouseleave", () => setCursorHidden(false));
    });

    return () => {
      hideOnHoverElements.forEach((element) => {
        element.removeEventListener("mouseenter", () => setCursorHidden(true));
        element.removeEventListener("mouseleave", () => setCursorHidden(false));
      });
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pick a day and session</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 items-center">
        <div className="flex justify-center gap-3"></div>
      </CardContent>
    </Card>
  );
};

export default AvailableClassrooms;
