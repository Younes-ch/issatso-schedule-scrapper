import ClassroomAvailabilityTable from "@/components/ClassroomAvailabilityTable";
import ClassroomSelector from "@/components/ClassroomSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import classroomQueryStore from "@/stores/classroomQueryStore";
import colorStore from "@/stores/colorStore";
import cursorHideStore from "@/stores/cursorHideStore";
import { useEffect } from "react";

const ClassroomAvailability = () => {
  const setColor = colorStore((state) => state.setColor);
  const setCursorHidden = cursorHideStore((state) => state.setCursorHidden);
  const setSelectedClassroom = classroomQueryStore(
    (state) => state.setSelectedClassroom
  );

  useEffect(() => {
    setColor("blue");
    const hideOnHoverElements = document.querySelectorAll(".hide-on-hover");
    hideOnHoverElements.forEach((element) => {
      element.addEventListener("mouseenter", () => setCursorHidden(true));
      element.addEventListener("mouseleave", () => setCursorHidden(false));
    });

    return () => {
      setCursorHidden(false);
      setSelectedClassroom(null);
      hideOnHoverElements.forEach((element) => {
        element.removeEventListener("mouseenter", () => setCursorHidden(true));
        element.removeEventListener("mouseleave", () => setCursorHidden(false));
      });
    };
  }, [setSelectedClassroom]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Choose a classroom</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 items-center">
          <ClassroomSelector />
          <ClassroomAvailabilityTable />
        </CardContent>
      </Card>
    </>
  );
};

export default ClassroomAvailability;
