import DaySelector from "@/components/DaySelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import availableClassroomsQueryStore from "@/stores/availableClassroomsQueryStore";
import colorStore from "@/stores/colorStore";
import cursorHideStore from "@/stores/cursorHideStore";
import { useEffect } from "react";

const AvailableClassrooms = () => {
  const setColor = colorStore((state) => state.setColor);
  const setCursorHidden = cursorHideStore((state) => state.setCursorHidden);
  const setWeekday = availableClassroomsQueryStore((state) => state.setWeekday);

  useEffect(() => {
    setColor("blue");
    const hideOnHoverElements = document.querySelectorAll(".hide-on-hover");
    hideOnHoverElements.forEach((element) => {
      element.addEventListener("mouseenter", () => setCursorHidden(true));
      element.addEventListener("mouseleave", () => setCursorHidden(false));
    });

    return () => {
      setWeekday(null);
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
        <div className="flex justify-center gap-3">
          <div className="w-1/2">
            <DaySelector />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailableClassrooms;
