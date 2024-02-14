import AvailableClassroomsTable from "@/components/AvailableClassroomsTable";
import ClassroomAvailabilityTable from "@/components/ClassroomAvailabilityTable";
import DaySelector from "@/components/DaySelector";
import SessionSelector from "@/components/SessionSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import availableClassroomsQueryStore from "@/stores/availableClassroomsQueryStore";
import classroomQueryStore from "@/stores/classroomQueryStore";
import colorStore from "@/stores/colorStore";
import cursorHideStore from "@/stores/cursorHideStore";
import { useScrollIntoView } from "@mantine/hooks";
import { useEffect } from "react";

const AvailableClassrooms = () => {
  const setColor = colorStore((state) => state.setColor);
  const setCursorHidden = cursorHideStore((state) => state.setCursorHidden);
  const { targetRef, scrollIntoView } = useScrollIntoView<HTMLDivElement>();
  const { setWeekday, setSession } = availableClassroomsQueryStore();
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
      setWeekday(null);
      setSession(null);
      setSelectedClassroom(null);
      setCursorHidden(false);
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
        <div className="flex justify-center gap-10">
          <div className="w-1/2">
            <DaySelector />
          </div>
          <div className="w-1/2">
            <SessionSelector />
          </div>
        </div>
        <AvailableClassroomsTable scrollIntoView={scrollIntoView} />
        <div ref={targetRef} className="w-full flex justify-center">
          <ClassroomAvailabilityTable />
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailableClassrooms;
