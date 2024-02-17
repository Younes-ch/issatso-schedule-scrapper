import GroupSchedules from "@/components/GroupSchedules";
import GroupSelector from "@/components/GroupSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useMediaQuery from "@/hooks/useMediaQuery";
import colorStore from "@/stores/colorStore";
import cursorHideStore from "@/stores/cursorHideStore";
import groupQueryStore from "@/stores/groupQueryStore";
import { useEffect } from "react";

const Schedules = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const setColor = colorStore((state) => state.setColor);
  const setCursorHidden = cursorHideStore((state) => state.setCursorHidden);
  const setSelectedGroup = groupQueryStore((state) => state.setSelectedGroup);

  useEffect(() => {
    setColor("blue");
    const hideOnHoverElements = document.querySelectorAll(".hide-on-hover");
    hideOnHoverElements.forEach((element) => {
      element.addEventListener("mouseenter", () => setCursorHidden(true));
      element.addEventListener("mouseleave", () => setCursorHidden(false));
    });

    return () => {
      setCursorHidden(false);
      setSelectedGroup(null);
      hideOnHoverElements.forEach((element) => {
        element.removeEventListener("mouseenter", () => setCursorHidden(true));
        element.removeEventListener("mouseleave", () => setCursorHidden(false));
      });
    };
  }, []);

  return (
    <Card className={`${!isDesktop ? "w-[90vw]" : ""}`}>
      <CardHeader>
        <CardTitle>Choose a group</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 items-center">
        <GroupSelector />
        <GroupSchedules />
      </CardContent>
    </Card>
  );
};

export default Schedules;
